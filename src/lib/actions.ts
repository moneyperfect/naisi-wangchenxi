"use server";

import { db } from "./db";
import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";

// Anniversary
export async function addAnniversary(data: {
  title: string;
  date: string;
  description?: string;
  isYearly?: boolean;
}) {
  await db.anniversary.create({ data });
  revalidatePath("/anniversary");
}

export async function updateAnniversary(
  id: number,
  data: { title: string; date: string; description?: string; isYearly?: boolean }
) {
  await db.anniversary.update({ where: { id }, data });
  revalidatePath("/anniversary");
}

export async function deleteAnniversary(id: number) {
  await db.anniversary.delete({ where: { id } });
  revalidatePath("/anniversary");
}

export async function getAnniversaries() {
  return db.anniversary.findMany({ orderBy: { date: "asc" } });
}

// Timeline
export async function addTimelineEvent(data: {
  title: string;
  date: string;
  description?: string;
  imageUrl?: string;
}) {
  await db.timelineEvent.create({ data });
  revalidatePath("/timeline");
}

export async function updateTimelineEvent(
  id: number,
  data: { title: string; date: string; description?: string; imageUrl?: string }
) {
  await db.timelineEvent.update({ where: { id }, data });
  revalidatePath("/timeline");
}

export async function deleteTimelineEvent(id: number) {
  await db.timelineEvent.delete({ where: { id } });
  revalidatePath("/timeline");
}

export async function getTimelineEvents() {
  return db.timelineEvent.findMany({ orderBy: { date: "asc" } });
}

// Photo
export async function addPhoto(data: {
  url: string;
  caption?: string;
  takenAt?: string;
}) {
  await db.photo.create({ data });
  revalidatePath("/album");
}

export async function deletePhoto(id: number) {
  const photo = await db.photo.findUnique({ where: { id } });
  if (photo?.url) {
    const path = photo.url.split("/photos/")[1];
    if (path) {
      await supabase.storage.from("photos").remove([path]);
    }
  }
  await db.photo.delete({ where: { id } });
  revalidatePath("/album");
}

export async function getPhotos() {
  return db.photo.findMany({ orderBy: { createdAt: "desc" } });
}

// Letter
export async function addLetter(data: {
  author: string;
  title?: string;
  content: string;
}) {
  await db.letter.create({ data });
  revalidatePath("/letters");
}

export async function markLetterRead(id: number) {
  await db.letter.update({ where: { id }, data: { isRead: true } });
  revalidatePath("/letters");
}

export async function updateLetter(
  id: number,
  data: { title?: string; content: string }
) {
  await db.letter.update({ where: { id }, data });
  revalidatePath("/letters");
}

export async function deleteLetter(id: number) {
  await db.letter.delete({ where: { id } });
  revalidatePath("/letters");
}

export async function getLetters() {
  return db.letter.findMany({ orderBy: { createdAt: "desc" } });
}

// Quiz
export async function getQuizQuestions() {
  return db.quizQuestion.findMany();
}

export async function addQuizQuestion(data: {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correct: string;
}) {
  await db.quizQuestion.create({ data });
}

// Diary
export async function addDiaryEntry(data: {
  author: string;
  content: string;
  mood?: string;
  date: string;
}) {
  await db.diaryEntry.create({ data });
  revalidatePath("/diary");
}

export async function updateDiaryEntry(
  id: number,
  data: { content: string; mood?: string }
) {
  await db.diaryEntry.update({ where: { id }, data });
  revalidatePath("/diary");
}

export async function deleteDiaryEntry(id: number) {
  await db.diaryEntry.delete({ where: { id } });
  revalidatePath("/diary");
}

export async function getDiaryEntries() {
  return db.diaryEntry.findMany({ orderBy: { date: "desc" } });
}
