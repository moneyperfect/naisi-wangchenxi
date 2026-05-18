import { getQuizQuestions } from "@/lib/actions";
import { PageHeader } from "@/components/layout/PageHeader";
import { QuizGame } from "@/components/games/QuizGame";

export default async function GamesPage() {
  const questions = await getQuizQuestions();

  return (
    <div>
      <PageHeader title="默契测试" showBack />
      <div className="mx-auto max-w-lg px-4 py-6">
        {questions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-400">题库为空，请先添加题目</p>
          </div>
        ) : (
          <QuizGame questions={questions} />
        )}
      </div>
    </div>
  );
}
