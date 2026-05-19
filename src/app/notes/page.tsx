import { Suspense } from "react";
import { getLetters } from "@/lib/actions";

export const dynamic = "force-dynamic";

import { PageHeader } from "@/components/layout/PageHeader";
import { NoteCard } from "@/components/notes/NoteCard";
import { NoteAddButton } from "./NoteAddButton";
import { NoteSkeleton } from "@/components/notes/NoteSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { MessageCircleHeart } from "lucide-react";

async function NoteList() {
  const notes = await getLetters();

  if (notes.length === 0) {
    return (
      <EmptyState
        icon={<MessageCircleHeart size={32} />}
        title="还没有心里话"
        description="想对 TA 说的话，写下来就好"
        action={<NoteAddButton />}
      />
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note, i) => (
        <ScrollReveal key={note.id} delay={i * 0.06}>
          <NoteCard note={note} />
        </ScrollReveal>
      ))}
    </div>
  );
}

export default function NotesPage() {
  return (
    <div>
      <PageHeader title="心里话" showBack action={<NoteAddButton />} />
      <div className="mx-auto max-w-lg px-4 py-6">
        <Suspense fallback={<NoteSkeleton />}>
          <NoteList />
        </Suspense>
      </div>
    </div>
  );
}
