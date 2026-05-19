-- 情侣网站重构：新增表和字段
-- 在 Supabase SQL Editor 中执行此文件

-- 1. 日记加标签（合并时间线用）
ALTER TABLE "DiaryEntry" ADD COLUMN IF NOT EXISTS "tag" TEXT DEFAULT '日常';

-- 2. 心愿清单
CREATE TABLE IF NOT EXISTS "Wishlist" (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '其他',
  completed BOOLEAN DEFAULT false,
  "completedBy" TEXT,
  "completedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- 3. 今日一问
CREATE TABLE IF NOT EXISTS "DailyQuestion" (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "DailyAnswer" (
  id SERIAL PRIMARY KEY,
  "questionId" INTEGER REFERENCES "DailyQuestion"(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  answer TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  UNIQUE("questionId", author)
);

-- 4. 随机约会
CREATE TABLE IF NOT EXISTS "DateIdea" (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT '其他',
  location TEXT,
  duration TEXT,
  locked BOOLEAN DEFAULT false,
  "lockedBy" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- 5. 心里话加定时发送
ALTER TABLE "Letter" ADD COLUMN IF NOT EXISTS "scheduledAt" TIMESTAMPTZ;

-- 6. 种子数据：30 个每日问题
INSERT INTO "DailyQuestion" (question) VALUES
('你最喜欢对方的哪个小习惯？'),
('如果我们可以瞬间去任何地方，你想去哪？'),
('你第一次对我心动是什么时候？'),
('用三个词形容我们的关系'),
('你觉得我们之间最默契的一件事是什么？'),
('你最想和我一起尝试的新事物是什么？'),
('如果明天是世界末日，你想和我做什么？'),
('你收到过最感动的一件事是什么？'),
('你觉得我什么时候最可爱？'),
('你最想对我说但一直没说出口的话是什么？'),
('如果我们可以变成任何动物，你想变成什么？'),
('你觉得我们以后会住在哪里？'),
('你最珍惜我们之间的哪个回忆？'),
('如果有一天我们吵架了，你希望我怎么哄你？'),
('你觉得爱情中最重要的是什么？'),
('你最想和我一起看的电影是哪部？'),
('如果给我写一条短信，你会写什么？'),
('你觉得我做的最好吃的一道菜是什么？'),
('你最想和我一起实现的梦想是什么？'),
('你觉得我们之间最有仪式感的事情是什么？'),
('如果可以回到过去，你想回到哪一天？'),
('你觉得我最需要改进的地方是什么？'),
('你最想和我一起养什么宠物？'),
('你觉得我们老了以后会是什么样子？'),
('如果可以给我一个超能力，你会选什么？'),
('你觉得我们之间最浪漫的一刻是什么？'),
('你最想和我一起做的一件疯狂的事是什么？'),
('你觉得我穿什么最好看？'),
('如果用一首歌代表我们的关系，你选哪首？'),
('你最想对我说的一句情话是什么？');

-- 7. 种子数据：15 个约会点子
INSERT INTO "DateIdea" (title, type, location, duration) VALUES
('一起做一顿饭', '美食', '家里', '2小时'),
('看日落', '户外', '附近', '1小时'),
('密室逃脱', '冒险', '市区', '2小时'),
('逛夜市', '美食', '附近', '2小时'),
('公园野餐', '户外', '附近', '3小时'),
('一起画一幅画', '室内', '家里', '2小时'),
('骑自行车', '户外', '附近', '2小时'),
('看电影马拉松', '室内', '家里', '4小时'),
('做甜点', '美食', '家里', '2小时'),
('去游乐园', '冒险', '远', '半天'),
('海边散步', '户外', '远', '2小时'),
('一起打游戏', '室内', '家里', '2小时'),
('去咖啡店学习', '室内', '附近', '3小时'),
('拍情侣照', '户外', '附近', '2小时'),
('一起运动/跑步', '户外', '附近', '1小时');
