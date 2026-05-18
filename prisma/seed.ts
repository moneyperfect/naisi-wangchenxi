import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const quizQuestions = [
  {
    question: "对方最喜欢吃什么？",
    optionA: "火锅",
    optionB: "烧烤",
    optionC: "寿司",
    optionD: "西餐",
    correct: "A",
  },
  {
    question: "对方最想去哪个国家旅行？",
    optionA: "日本",
    optionB: "法国",
    optionC: "意大利",
    optionD: "泰国",
    correct: "A",
  },
  {
    question: "对方的生日是几月？",
    optionA: "1-3月",
    optionB: "4-6月",
    optionC: "7-9月",
    optionD: "10-12月",
    correct: "B",
  },
  {
    question: "对方最喜欢什么颜色？",
    optionA: "蓝色",
    optionB: "粉色",
    optionC: "绿色",
    optionD: "紫色",
    correct: "A",
  },
  {
    question: "对方周末最喜欢做什么？",
    optionA: "宅在家",
    optionB: "出去逛街",
    optionC: "运动健身",
    optionD: "看电影",
    correct: "A",
  },
  {
    question: "对方最怕什么？",
    optionA: "打雷",
    optionB: "虫子",
    optionC: "高处",
    optionD: "孤独",
    correct: "B",
  },
  {
    question: "对方喜欢什么类型的电影？",
    optionA: "喜剧",
    optionB: "爱情",
    optionC: "科幻",
    optionD: "悬疑",
    correct: "A",
  },
  {
    question: "对方最珍惜的东西是？",
    optionA: "手机",
    optionB: "照片",
    optionC: "礼物",
    optionD: "回忆",
    correct: "D",
  },
  {
    question: "对方生气时会怎么做？",
    optionA: "沉默不语",
    optionB: "大声争论",
    optionC: "出去走走",
    optionD: "吃东西",
    correct: "A",
  },
  {
    question: "对方最喜欢什么季节？",
    optionA: "春天",
    optionB: "夏天",
    optionC: "秋天",
    optionD: "冬天",
    correct: "A",
  },
];

async function main() {
  const count = await db.quizQuestion.count();
  if (count === 0) {
    for (const q of quizQuestions) {
      await db.quizQuestion.create({ data: q });
    }
    console.log(`Seeded ${quizQuestions.length} quiz questions`);
  } else {
    console.log(`Quiz questions already exist (${count}), skipping seed`);
  }
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
