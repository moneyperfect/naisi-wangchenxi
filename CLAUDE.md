# CLAUDE.md — 情侣网站 (nascx.xyz)

## 项目概述

乃斯 & 晨曦 的私密情侣网站，部署在 Vercel，域名为 nascx.xyz。
通过共享密码门保护，两人各有一个密码（`SITE_PASSWORD_A` / `SITE_PASSWORD_B`）。

## 技术栈

- **框架:** Next.js 16 (App Router) + React 19 + TypeScript
- **样式:** Tailwind CSS v4 (`@theme` 指令定义在 `globals.css`)
- **数据库:** Supabase (PostgreSQL)，通过 `@supabase/supabase-js` 直接操作
- **动画:** Framer Motion v12
- **图标:** Lucide React（禁止使用 emoji）
- **通知:** Sonner (toast)
- **PWA:** manifest.json + Service Worker

## 关键架构

### 数据层
- **所有数据库操作** 在 `src/lib/actions.ts`（Server Actions，带 `"use server"`）
- **Supabase 客户端:** `src/lib/supabase/server.ts`（服务端）、`client.ts`（浏览器端）
- **类型定义:** `src/types/index.ts`
- **常量:** `src/lib/constants.ts`（COUPLE 对象、LOVE_QUOTES 数组）
- **不使用 Prisma**，直接用 Supabase JS client

### 路由结构 (src/app/)
```
/                  首页（HeroSection + DaysCounter + LoveQuote + QuickLinks）
/gate              密码门（proxy.ts 拦截未验证用户）
/anniversary       纪念日
/album             相册（照片上传 + 瀑布流展示）
/story             故事（日记 + 时间线合并展示）
/notes             情书/便签
/daily             今日一问
/wishlist          心愿清单
/date-idea         随机约会
/rant              吐槽墙
/games             小游戏（打地鼠 + 计分板）
/quiz              默契测试
/more              更多（功能入口网格）
```

### 组件模式
每个功能模块遵循统一结构：
- `*Card.tsx` — 展示卡片
- `*Form.tsx` — 表单组件
- `*Skeleton.tsx` — 加载骨架屏
- `error.tsx` — 错误边界（每个路由目录下）

### 认证 (proxy.ts)
- `src/proxy.ts` — Next.js 16 的 proxy 机制（替代已弃用的 middleware.ts）
- 检查 `site_auth` cookie，未通过跳转 `/gate`
- 白名单：`/gate`、`/api/gate`、静态资源
- API: `src/app/api/gate/route.ts`（验证密码 + 设置 httpOnly cookie，30 天有效）

## 设计规范

- **配色:** 温暖米色/珊瑚色系，禁用纯白纯黑
  - 背景: `stone-50/100`、`cream`、`warm-50`
  - 强调色: `warm-500` (#ff6b4a)
  - 文字: `stone-800`
- **字体:** 标题用 `font-serif`（Noto Serif SC），正文用 `font-sans`（Noto Sans SC）
- **圆角:** 大圆角 `rounded-2xl`/`rounded-3xl`，输入框 `rounded-full`
- **图标:** 只用 Lucide Icons，禁止 emoji
- **动画:** 使用 Framer Motion，避免 CSS animation 滥用

## 环境变量

```
DATABASE_URL          Supabase PostgreSQL 连接串
DIRECT_URL            Supabase 直连串
NEXT_PUBLIC_SUPABASE_URL     Supabase 项目 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  Supabase anon key
SITE_PASSWORD_A       乃斯的密码
SITE_PASSWORD_B       晨曦的密码
```

## 开发命令

```bash
npm run dev      # 本地开发 (Turbopack)
npm run build    # 生产构建
npm run start    # 生产运行
```

## 部署

- **方式:** git push 到 GitHub → Vercel 自动部署（不要直接 `vercel --prod`）
- **环境变量:** Vercel Dashboard → Settings → Environment Variables（本地 `.env` 不会同步到 Vercel）
- **数据库迁移:** 用户通过 Supabase Dashboard SQL Editor 执行

## 注意事项

- Server Actions 中用 `revalidatePath()` 刷新缓存
- `author` 字段是 UI 切换（乃斯/晨曦），不是真实认证用户
- 照片上传走 `/api/upload`，存储在 Supabase Storage 的 `photos` bucket
- 所有 Supabase 表的 RLS 已禁用（通过 proxy 层做访问控制）
- 构建时如有 TypeScript 错误，先检查类型定义是否匹配数据库 schema
