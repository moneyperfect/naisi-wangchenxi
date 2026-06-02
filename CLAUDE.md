# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

乃斯 & 晨曦 的私密情侣网站，部署在 Vercel，域名为 nascx.xyz。
通过共享密码门保护，两人各有一个密码（`SITE_PASSWORD_A` / `SITE_PASSWORD_B`）。

## 开发命令

```bash
npm run dev      # 本地开发 (Turbopack)
npm run build    # 生产构建
npm run start    # 生产运行
npm run lint     # ESLint 检查
```

## 技术栈

- **框架:** Next.js 16 (App Router) + React 19 + TypeScript
- **样式:** Tailwind CSS v4（`@theme` 指令定义在 `globals.css`，自定义色板：warm/mint/sky/cream）
- **数据库:** Supabase (PostgreSQL)，通过 `@supabase/supabase-js` 直接操作
- **动画:** Framer Motion v12
- **图标:** Lucide React（禁止使用 emoji）
- **通知:** Sonner (toast)
- **PWA:** manifest.json + Service Worker（`sw.js` 配置了 no-cache header）

## 关键架构

### 数据层
- **所有数据库操作** 在 `src/lib/actions.ts`（Server Actions，带 `"use server"`）
- **Supabase 客户端:** `src/lib/supabase/server.ts`（服务端）、`client.ts`（浏览器端）
- **Realtime 订阅:** `src/lib/supabase/realtime.ts`（基于 `postgres_changes` 的实时推送）
- **类型定义:** `src/types/index.ts`
- **常量/内容池:** `src/lib/constants.ts`（COUPLE 对象、LOVE_QUOTES、CHALLENGES、DEBATE_TOPICS、ACHIEVEMENTS 等）
- **不使用 Prisma**，直接用 Supabase JS client
- **数据库表名大小写不一致：** Challenge/Debate/Achievement 表用 snake_case（`completed_by_a`），其他表用 camelCase（`createdAt`）

### 认证 (proxy.ts)
- `src/proxy.ts` — Next.js 16 的 proxy 机制（替代已弃用的 middleware.ts）
- 检查 `site_auth` cookie（SHA-256 哈希比对），未通过跳转 `/gate`
- 白名单：`/gate`、`/api/gate`、静态资源
- API: `src/app/api/gate/route.ts`（验证密码 + 设置 httpOnly cookie，30 天有效）
- 所有 Supabase 表的 RLS 已禁用（通过 proxy 层做访问控制）

### author 字段
`author` 字段是 UI 切换（"乃斯"/"晨曦"），不是真实认证用户。通过前端选择身份后传入 Server Actions。

### 路由结构 (src/app/)
```
/                  首页（HeroSection + DaysCounter + LoveQuote + QuickLinks）
/gate              密码门
/anniversary       纪念日
/album             相册（照片上传 → /api/upload → Supabase Storage photos bucket）
/story             故事（日记 + 时间线合并展示，getStoryEntries 合并 DiaryEntry + TimelineEvent）
/notes             情书/便签（支持 scheduledAt 定时发送）
/daily             今日一问（按 dayOfYear 取模轮转问题）
/wishlist          心愿清单
/date-idea         随机约会（支持 locked/lockedBy 锁定机制）
/rant              吐槽墙（支持 acknowledged 确认机制）
/games             小游戏（打地鼠 + 计分板）
/challenge         每日挑战（从 CHALLENGES 常量池按日期轮转）
/debate            辩论（从 DEBATE_TOPICS 常量池选取）
/quiz              默契测试
/more              更多（功能入口网格）
```

### 组件模式
每个功能模块遵循统一结构：
- `*Card.tsx` — 展示卡片
- `*Form.tsx` — 表单组件
- `*Skeleton.tsx` — 加载骨架屏
- `error.tsx` — 错误边界（每个路由目录下）

### 路由过渡
`src/app/template.tsx` 处理页面切换时的过渡遮罩（cream 背景色），通过 `sessionStorage("skip-next-route-loading")` 跳过特定导航的过渡动画。

## 设计规范

- **配色:** 温暖米色/珊瑚色系，禁用纯白纯黑
  - 背景: `stone-50/100`、`cream`（`#fffbf7`）、`warm-50`
  - 强调色: `warm-500`（`#ff6b4a`）
  - 文字: `stone-800`
- **字体:** 标题用 `font-serif`（Noto Serif SC），正文用 `font-sans`（Noto Sans SC）
- **圆角:** 大圆角 `rounded-2xl`/`rounded-3xl`，输入框 `rounded-full`
- **图标:** 只用 Lucide Icons，禁止 emoji
- **动画:** 使用 Framer Motion，避免 CSS animation 滥用（仅 `globals.css` 中预定义的 keyframes）

## 环境变量

```
DATABASE_URL          Supabase PostgreSQL 连接串
DIRECT_URL            Supabase 直连串
NEXT_PUBLIC_SUPABASE_URL     Supabase 项目 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  Supabase anon key
SITE_PASSWORD_A       乃斯的密码
SITE_PASSWORD_B       晨曦的密码
```

## 部署

- **方式:** git push 到 GitHub → Vercel 自动部署（不要直接 `vercel --prod`）
- **环境变量:** Vercel Dashboard → Settings → Environment Variables（本地 `.env` 不会同步到 Vercel）
- **数据库迁移:** 用户通过 Supabase Dashboard SQL Editor 执行
