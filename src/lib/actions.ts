"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function toDate(val: string): Date {
  return new Date(val);
}

// Anniversary
export async function addAnniversary(data: {
  title: string;
  date: string;
  description?: string;
  isYearly?: boolean;
}) {
  const sb = createServerClient();
  const { error } = await sb.from("Anniversary").insert({
    title: data.title,
    date: data.date,
    description: data.description ?? null,
    isYearly: data.isYearly ?? true,
  });
  if (error) throw error;
  revalidatePath("/anniversary");
}

export async function updateAnniversary(
  id: number,
  data: { title: string; date: string; description?: string; isYearly?: boolean }
) {
  const sb = createServerClient();
  const { error } = await sb
    .from("Anniversary")
    .update({
      title: data.title,
      date: data.date,
      description: data.description ?? null,
      isYearly: data.isYearly ?? true,
    })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/anniversary");
}

export async function deleteAnniversary(id: number) {
  const sb = createServerClient();
  const { error } = await sb.from("Anniversary").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/anniversary");
}

export async function getAnniversaries() {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("Anniversary")
    .select("*")
    .order("date", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    ...r,
    createdAt: toDate(r.createdAt),
  }));
}

// Timeline
export async function addTimelineEvent(data: {
  title: string;
  date: string;
  description?: string;
  imageUrl?: string;
}) {
  const sb = createServerClient();
  const { error } = await sb.from("TimelineEvent").insert({
    title: data.title,
    date: data.date,
    description: data.description ?? null,
    imageUrl: data.imageUrl ?? null,
  });
  if (error) throw error;
  revalidatePath("/story");
}

export async function updateTimelineEvent(
  id: number,
  data: { title: string; date: string; description?: string; imageUrl?: string }
) {
  const sb = createServerClient();
  const { error } = await sb
    .from("TimelineEvent")
    .update({
      title: data.title,
      date: data.date,
      description: data.description ?? null,
      imageUrl: data.imageUrl ?? null,
    })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/story");
}

export async function deleteTimelineEvent(id: number) {
  const sb = createServerClient();
  const { error } = await sb.from("TimelineEvent").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/story");
}

export async function getTimelineEvents() {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("TimelineEvent")
    .select("*")
    .order("date", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    ...r,
    createdAt: toDate(r.createdAt),
  }));
}

// Photo
export async function addPhoto(data: {
  url: string;
  caption?: string;
  takenAt?: string;
}) {
  const sb = createServerClient();
  const { error } = await sb.from("Photo").insert({
    url: data.url,
    caption: data.caption ?? null,
    takenAt: data.takenAt ?? null,
  });
  if (error) throw error;
  revalidatePath("/album");
}

export async function updatePhotoCaption(id: number, caption: string) {
  const sb = createServerClient();
  const cleanCaption = caption.trim();
  const { error } = await sb
    .from("Photo")
    .update({ caption: cleanCaption || null })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/album");
}

export async function deletePhoto(id: number) {
  const sb = createServerClient();
  const { data: photo } = await sb
    .from("Photo")
    .select("url")
    .eq("id", id)
    .single();
  if (photo?.url) {
    const path = photo.url.split("/photos/")[1];
    if (path) {
      await sb.storage.from("photos").remove([path]);
    }
  }
  const { error } = await sb.from("Photo").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/album");
}

export async function getPhotos() {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("Photo")
    .select("*")
    .order("createdAt", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    ...r,
    createdAt: toDate(r.createdAt),
  }));
}

// Letter (Love Note)
export async function addLetter(data: {
  author: string;
  title?: string;
  content: string;
  scheduledAt?: string;
}) {
  const sb = createServerClient();
  const { error } = await sb.from("Letter").insert({
    author: data.author,
    title: data.title ?? null,
    content: data.content,
    scheduledAt: data.scheduledAt ?? null,
  });
  if (error) throw error;
  revalidatePath("/notes");
}

export async function markLetterRead(id: number) {
  const sb = createServerClient();
  const { error } = await sb
    .from("Letter")
    .update({ isRead: true })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/notes");
}

export async function updateLetter(
  id: number,
  data: { title?: string; content: string }
) {
  const sb = createServerClient();
  const { error } = await sb
    .from("Letter")
    .update({ title: data.title ?? null, content: data.content })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/notes");
}

export async function deleteLetter(id: number) {
  const sb = createServerClient();
  const { error } = await sb.from("Letter").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/notes");
}

export async function getLetters() {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("Letter")
    .select("*")
    .order("createdAt", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    ...r,
    createdAt: toDate(r.createdAt),
    scheduledAt: r.scheduledAt ? toDate(r.scheduledAt) : null,
  }));
}

export async function getUnreadNoteCount() {
  const sb = createServerClient();
  const { count, error } = await sb
    .from("Letter")
    .select("*", { count: "exact", head: true })
    .eq("isRead", false);
  if (error) throw error;
  return count ?? 0;
}

// Quiz
export async function getQuizQuestions() {
  const sb = createServerClient();
  const { data, error } = await sb.from("QuizQuestion").select("*").order("id", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    ...r,
    createdAt: toDate(r.createdAt),
  }));
}

export async function addQuizQuestion(data: {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correct: string;
}) {
  const sb = createServerClient();
  const { error } = await sb.from("QuizQuestion").insert({
    question: data.question,
    optionA: data.optionA,
    optionB: data.optionB,
    optionC: data.optionC,
    optionD: data.optionD,
    correct: data.correct,
  });
  if (error) throw error;
}

// Diary
export async function addDiaryEntry(data: {
  author: string;
  content: string;
  mood?: string;
  date: string;
  tag?: string;
}) {
  const sb = createServerClient();
  const { error } = await sb.from("DiaryEntry").insert({
    author: data.author,
    content: data.content,
    mood: data.mood ?? null,
    date: data.date,
    tag: data.tag ?? "日常",
  });
  if (error) throw error;
  revalidatePath("/story");
}

export async function updateDiaryEntry(
  id: number,
  data: { content: string; mood?: string }
) {
  const sb = createServerClient();
  const { error } = await sb
    .from("DiaryEntry")
    .update({ content: data.content, mood: data.mood ?? null })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/story");
}

export async function deleteDiaryEntry(id: number) {
  const sb = createServerClient();
  const { error } = await sb.from("DiaryEntry").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/story");
}

export async function getDiaryEntries() {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("DiaryEntry")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    ...r,
    createdAt: toDate(r.createdAt),
    tag: r.tag ?? "日常",
  }));
}

// Story (merged diary + timeline)
export async function getStoryEntries() {
  const sb = createServerClient();
  const [diaryRes, timelineRes] = await Promise.all([
    sb.from("DiaryEntry").select("*").order("date", { ascending: false }),
    sb.from("TimelineEvent").select("*").order("date", { ascending: false }),
  ]);
  if (diaryRes.error) throw diaryRes.error;
  if (timelineRes.error) throw timelineRes.error;

  const diaryItems = (diaryRes.data ?? []).map((r) => ({
    ...r,
    createdAt: toDate(r.createdAt),
    tag: r.tag ?? "日常",
    type: "diary" as const,
  }));

  const timelineItems = (timelineRes.data ?? []).map((r) => ({
    ...r,
    createdAt: toDate(r.createdAt),
    type: "milestone" as const,
  }));

  return [...diaryItems, ...timelineItems].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

// Wishlist
export async function getWishlistItems() {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("Wishlist")
    .select("*")
    .order("createdAt", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    ...r,
    createdAt: toDate(r.createdAt),
    completedAt: r.completedAt ? toDate(r.completedAt) : null,
  }));
}

export async function addWishlistItem(data: {
  text: string;
  category: string;
}) {
  const sb = createServerClient();
  const { error } = await sb.from("Wishlist").insert({
    text: data.text,
    category: data.category,
  });
  if (error) throw error;
  revalidatePath("/wishlist");
}

export async function toggleWishlistItem(id: number, completedBy: string) {
  const sb = createServerClient();
  const { data: item } = await sb
    .from("Wishlist")
    .select("completed")
    .eq("id", id)
    .single();
  const { error } = await sb
    .from("Wishlist")
    .update({
      completed: !item?.completed,
      completedBy: item?.completed ? null : completedBy,
      completedAt: item?.completed ? null : new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/wishlist");
}

export async function deleteWishlistItem(id: number) {
  const sb = createServerClient();
  const { error } = await sb.from("Wishlist").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/wishlist");
}

// Daily Question
export async function getTodaysQuestion() {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("DailyQuestion")
    .select("*")
    .order("id", { ascending: true });
  if (error) throw error;
  if (!data || data.length === 0) return null;
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000
  );
  const idx = dayOfYear % data.length;
  return { ...data[idx], createdAt: toDate(data[idx].createdAt) };
}

export async function getDailyAnswers(questionId: number) {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("DailyAnswer")
    .select("*")
    .eq("questionId", questionId);
  if (error) throw error;
  return (data ?? []).map((r) => ({
    ...r,
    createdAt: toDate(r.createdAt),
  }));
}

export async function submitDailyAnswer(
  questionId: number,
  author: string,
  answer: string
) {
  const sb = createServerClient();
  const { error } = await sb.from("DailyAnswer").upsert(
    { questionId, author, answer },
    { onConflict: "questionId,author" }
  );
  if (error) throw error;
  revalidatePath("/daily");
}

export async function getDailyHistory() {
  const sb = createServerClient();
  const { data: questions, error: qErr } = await sb
    .from("DailyQuestion")
    .select("*")
    .order("id", { ascending: true });
  if (qErr) throw qErr;
  const { data: answers, error: aErr } = await sb
    .from("DailyAnswer")
    .select("*")
    .order("createdAt", { ascending: false });
  if (aErr) throw aErr;

  const answerMap = new Map<number, Record<string, string>>();
  for (const a of answers ?? []) {
    const existing = answerMap.get(a.questionId) ?? {};
    existing[a.author] = a.answer;
    answerMap.set(a.questionId, existing);
  }

  return (questions ?? [])
    .filter((q) => answerMap.has(q.id))
    .map((q) => ({
      ...q,
      createdAt: toDate(q.createdAt),
      answers: answerMap.get(q.id)!,
    }));
}

// Date Idea
export async function getDateIdeas() {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("DateIdea")
    .select("*")
    .order("createdAt", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    ...r,
    createdAt: toDate(r.createdAt),
  }));
}

export async function addDateIdea(data: {
  title: string;
  type: string;
  location?: string;
  duration?: string;
}) {
  const sb = createServerClient();
  const { error } = await sb.from("DateIdea").insert({
    title: data.title,
    type: data.type,
    location: data.location ?? null,
    duration: data.duration ?? null,
  });
  if (error) throw error;
  revalidatePath("/date-idea");
}

export async function toggleLockDateIdea(id: number, lockedBy: string) {
  const sb = createServerClient();
  const { data: item } = await sb
    .from("DateIdea")
    .select("locked")
    .eq("id", id)
    .single();
  const { error } = await sb
    .from("DateIdea")
    .update({
      locked: !item?.locked,
      lockedBy: item?.locked ? null : lockedBy,
    })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/date-idea");
}

export async function deleteDateIdea(id: number) {
  const sb = createServerClient();
  const { error } = await sb.from("DateIdea").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/date-idea");
}

// Rant
export async function getRants() {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("Rant")
    .select("*")
    .order("createdAt", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    ...r,
    createdAt: toDate(r.createdAt),
  }));
}

export async function addRant(data: {
  author: string;
  content: string;
  category: string;
}) {
  const sb = createServerClient();
  const { error } = await sb.from("Rant").insert({
    author: data.author,
    content: data.content,
    category: data.category,
  });
  if (error) throw error;
  revalidatePath("/rant");
}

export async function acknowledgeRant(id: number, by: string) {
  const sb = createServerClient();
  const { error } = await sb
    .from("Rant")
    .update({ acknowledged: true, acknowledgedBy: by })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/rant");
}

export async function deleteRant(id: number) {
  const sb = createServerClient();
  const { error } = await sb.from("Rant").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/rant");
}

// GameScore
const WHACK_A_MOLE_GAME_NAME = "打地鼠最高纪录";

export async function getGameScores() {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("GameScore")
    .select("*")
    .order("updatedAt", { ascending: false });
  if (error) throw error;
  const scores = data ?? [];
  const record =
    scores.find((g) => g.gameName === WHACK_A_MOLE_GAME_NAME) ?? null;

  if (record) {
    return [
      {
        ...record,
        createdAt: toDate(record.createdAt),
        updatedAt: toDate(record.updatedAt),
      },
    ];
  }

  if (scores.length === 0) return [];

  const latest = scores[0];
  return [
    {
      ...latest,
      gameName: WHACK_A_MOLE_GAME_NAME,
      playerA: Math.max(...scores.map((g) => g.playerA ?? 0)),
      playerB: Math.max(...scores.map((g) => g.playerB ?? 0)),
      createdAt: toDate(latest.createdAt),
      updatedAt: toDate(latest.updatedAt),
    },
  ];
}

export async function saveWhackAMoleBestScore(
  player: "playerA" | "playerB",
  score: number
) {
  const cleanScore = Math.max(0, Math.floor(score));
  const sb = createServerClient();
  const { data, error } = await sb
    .from("GameScore")
    .select("*")
    .order("updatedAt", { ascending: false });
  if (error) throw error;

  const scores = data ?? [];
  const existing = scores.find((g) => g.gameName === WHACK_A_MOLE_GAME_NAME);
  if (!existing) {
    const legacyBestA = Math.max(0, ...scores.map((g) => g.playerA ?? 0));
    const legacyBestB = Math.max(0, ...scores.map((g) => g.playerB ?? 0));
    const { error: insertError } = await sb.from("GameScore").insert({
      gameName: WHACK_A_MOLE_GAME_NAME,
      playerA:
        player === "playerA" ? Math.max(legacyBestA, cleanScore) : legacyBestA,
      playerB:
        player === "playerB" ? Math.max(legacyBestB, cleanScore) : legacyBestB,
      updatedAt: new Date().toISOString(),
    });
    if (insertError) throw insertError;
    revalidatePath("/games");
    return;
  }

  if (cleanScore <= (existing[player] ?? 0)) return;

  const { error: updateError } = await sb
    .from("GameScore")
    .update({ [player]: cleanScore, updatedAt: new Date().toISOString() })
    .eq("id", existing.id);
  if (updateError) throw updateError;
  revalidatePath("/games");
}

export async function createGame(gameName: string) {
  const sb = createServerClient();
  const { error } = await sb.from("GameScore").insert({ gameName });
  if (error) throw error;
  revalidatePath("/games");
}

export async function updateGameScore(
  id: number,
  player: "playerA" | "playerB",
  delta: number
) {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("GameScore")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  const newScore = Math.max(0, (data[player] ?? 0) + delta);
  const { error: updateError } = await sb
    .from("GameScore")
    .update({ [player]: newScore, updatedAt: new Date().toISOString() })
    .eq("id", id);
  if (updateError) throw updateError;
  revalidatePath("/games");
}

export async function resetGameScore(id: number) {
  const sb = createServerClient();
  const { error } = await sb
    .from("GameScore")
    .update({ playerA: 0, playerB: 0, updatedAt: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/games");
}

export async function deleteGame(id: number) {
  const sb = createServerClient();
  const { error } = await sb.from("GameScore").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/games");
}
