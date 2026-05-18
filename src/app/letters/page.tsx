import { Suspense } from "react";
import { getLetters } from "@/lib/actions";
import { PageHeader } from "@/components/layout/PageHeader";
import { LetterCard } from "@/components/letters/LetterCard";
import { LetterAddButton } from "./LetterAddButton";
import { LetterSkeleton } from "@/components/letters/LetterSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { Mail } from "lucide-react";

async function LetterList() {
  const letters = await getLetters();

  if (letters.length === 0) {
    return (
      <EmptyState
        icon={<Mail size={32} />}
        title="还没有情书"
        description="写一封信给 TA，把想说的话留下来"
        action={<LetterAddButton />}
      />
    );
  }

  return (
    <div className="space-y-3">
      {letters.map((letter, i) => (
        <ScrollReveal key={letter.id} delay={i * 0.08}>
          <LetterCard letter={letter} />
        </ScrollReveal>
      ))}
    </div>
  );
}

export default function LettersPage() {
  return (
    <div>
      <PageHeader title="情书" showBack action={<LetterAddButton />} />
      <div className="mx-auto max-w-lg px-4 py-6">
        <Suspense fallback={<LetterSkeleton />}>
          <LetterList />
        </Suspense>
      </div>
    </div>
  );
}
