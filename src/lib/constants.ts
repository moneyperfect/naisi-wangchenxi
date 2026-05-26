export const COUPLE = {
  partnerA: "乃斯",
  partnerB: "晨曦",
  startDate: "2026-05-09",
  siteTitle: "我们的故事",
};

export const LOVE_QUOTES = [
  "你是我所有不安的安定",
  "想把世界上最好的都给你",
  "今天也是喜欢你的一天",
  "你笑起来真好看",
  "遇见你是我最美丽的意外",
  "我想和你一起慢慢变老",
  "你是我藏在心底的秘密",
  "有你的日子都是好天气",
  "我喜欢你，认真且怂，从一而终",
  "你是我最想留住的幸运",
  "余生很长，我只想和你走",
  "你是我所有的少女情怀和心之所向",
  "想牵你的手，从心动到古稀",
  "你是我疲惫生活中唯一的英雄梦想",
  "我这一生，除了故乡，只为你一个人写过月亮",
  "你是我的今天和所有的明天",
  "我见过春风十里，见过夏至未至，试过秋光潋滟，爱过冬日暖阳，全都不及你",
  "你是我温暖的手套，冰冷的啤酒，带着阳光味道的衬衫，日复一日的梦想",
  "我从未让你骄傲，你却待我如宝",
  "你的名字是我见过最短的情诗",
];

// 今日挑战池
export const CHALLENGES = [
  "今天谁先说「我爱你」，输的人请喝奶茶",
  "用三个词形容对方，不准用重复的",
  "模仿对方最常说的一句话，让对方猜",
  "给对方拍一张最丑的照片（不准删！）",
  "今天主动牵手至少3次，少一次罚一个吻",
  "互相分享今天最开心的一件事",
  "给对方起一个新的昵称，要用一整天",
  "一起做一顿饭，不准点外卖",
  "互相读一首诗给对方听",
  "今天吵架了？那就互相道歉，不管谁对谁错",
  "一起看一部对方选的电影，不准抱怨",
  "给对方写一封50字以内的情书",
  "一起散步30分钟，不准看手机",
  "互相说三个对方的优点",
  "一起做一件从没做过的事",
];

// 辩论题目池
export const DEBATE_TOPICS = [
  { topic: "甜粽子 vs 咸粽子", optionA: "甜粽子yyds", optionB: "咸粽子才是正统" },
  { topic: "猫派 vs 狗派", optionA: "猫猫天下第一", optionB: "狗狗永远的神" },
  { topic: "夏天 vs 冬天", optionA: "夏天有冰淇淋和裙子", optionB: "冬天有被窝和火锅" },
  { topic: "先有鸡 vs 先有蛋", optionA: "当然是先有鸡", optionB: "蛋表示不服" },
  { topic: "可乐 vs 奶茶", optionA: "快乐水永远的神", optionB: "奶茶续命" },
  { topic: "早起 vs 晚睡", optionA: "早起的鸟儿有虫吃", optionB: "晚睡的猫儿有鱼吃" },
  { topic: "做饭 vs 点外卖", optionA: "自己做饭才有灵魂", optionB: "外卖拯救世界" },
  { topic: "旅行 vs 宅家", optionA: "世界那么大我想去看看", optionB: "家里那么舒服为什么要出门" },
  { topic: "电影 vs 电视剧", optionA: "电影两小时搞定", optionB: "电视剧才有深度" },
  { topic: "苹果 vs 安卓", optionA: "苹果生态无敌", optionB: "安卓自由万岁" },
];

// 成就列表
export const ACHIEVEMENTS = [
  { key: "first_rant", name: "开喷达人", desc: "首次在吐槽墙发言", icon: "MessageSquare" },
  { key: "streak_7", name: "钢铁情侣", desc: "连续7天访问网站", icon: "Flame" },
  { key: "quiz_perfect", name: "灵魂伴侣", desc: "默契测试获得满分", icon: "Brain" },
  { key: "whack_record", name: "手速之王", desc: "打地鼠刷新纪录", icon: "Zap" },
  { key: "wishlist_10", name: "心愿收割机", desc: "完成10个心愿", icon: "Sparkles" },
  { key: "story_20", name: "故事大王", desc: "记录20条故事", icon: "BookOpen" },
  { key: "first_debate", name: "辩手出道", desc: "首次参加辩论", icon: "Swords" },
  { key: "first_challenge", name: "挑战新手", desc: "完成第一个挑战", icon: "Target" },
  { key: "photo_50", name: "摄影大师", desc: "上传50张照片", icon: "Camera" },
  { key: "note_30", name: "情话达人", desc: "发送30条心里话", icon: "Heart" },
];

// 吐槽等级
export const RANT_LEVELS = [
  { key: "whisper", label: "小声bb", color: "bg-stone-100 text-stone-600" },
  { key: "shout", label: "大声嚷嚷", color: "bg-orange-100 text-orange-600" },
  { key: "rage", label: "暴怒模式", color: "bg-red-100 text-red-600" },
];

// 打地鼠吐槽文案
export const WHACK_ROASTS = [
  "打中了！{name}痛得嗷嗷叫",
  "暴击！{name}表示不服",
  "{name}被制裁了！",
  "精准打击！{name}哭晕在厕所",
  "{name}：你等着，我一定报仇！",
  "漂亮的一击！{name}瑟瑟发抖",
];

// 游戏结束评价
export const GAME_REVIEWS = [
  { min: 0, max: 5, text: "手残晚期，建议多练习", icon: "Frown" },
  { min: 6, max: 10, text: "还行吧，勉强及格", icon: "Meh" },
  { min: 11, max: 20, text: "不错不错，有点东西", icon: "Smile" },
  { min: 21, max: 30, text: "高手！手速惊人", icon: "Flame" },
  { min: 31, max: 999, text: "神仙操作！建议去打电竞", icon: "Trophy" },
];

// 默契测试吐槽文案
export const QUIZ_ROASTS = [
  "这都不知道？回去面壁",
  "看来你们还不够了解对方啊",
  "答错了！罚抄对方名字100遍",
  "这题都不会？建议重新谈恋爱",
  "对方表示很失望",
];
