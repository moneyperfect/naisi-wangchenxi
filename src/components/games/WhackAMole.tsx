"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Heart, Trophy, RotateCcw, Flame, Frown, Meh, Smile } from "lucide-react";
import { toast } from "sonner";
import { COUPLE, WHACK_ROASTS, GAME_REVIEWS } from "@/lib/constants";
import { saveWhackAMoleBestScore } from "@/lib/actions";
import { cn } from "@/lib/utils";

type Phase = "idle" | "playing" | "result";
type Player = "playerA" | "playerB";

const DURATION = 30;
const GRID_SIZE = 16;
const GRID_COLUMNS = 4;
const MOLE_VISIBLE_MS = 420;
const MOLE_RESPAWN_MS = 520;
const MOLE_RESPAWN_JITTER_MS = 120;
const QUICK_RESPAWN_MS = 180;

interface WhackAMoleProps {
  bestA: number;
  bestB: number;
  onScoreSaved: () => void;
}

export function WhackAMole({ bestA, bestB, onScoreSaved }: WhackAMoleProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [player, setPlayer] = useState<Player>("playerA");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [molePositions, setMolePositions] = useState<number[]>([]);
  const [hitAnim, setHitAnim] = useState<number[]>([]);

  const timerRef = useRef<number | null>(null);
  const moleTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const scoreRef = useRef(0);
  const timeLeftRef = useRef(DURATION);
  const phaseRef = useRef<Phase>("idle");
  const activePositionsRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
    if (moleTimerRef.current) {
      clearTimeout(moleTimerRef.current);
      moleTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  function setActivePositions(positions: number[]) {
    activePositionsRef.current = positions;
    setMolePositions(positions);
  }

  function getTargetCount() {
    const elapsed = DURATION - timeLeftRef.current;
    if (elapsed >= 20) return 4;
    if (elapsed >= 10) return 3;
    return 2;
  }

  function pickPositions(count: number) {
    const positions = new Set<number>();
    while (positions.size < Math.min(count, GRID_SIZE)) {
      positions.add(Math.floor(Math.random() * GRID_SIZE));
    }
    return Array.from(positions);
  }

  function scheduleNextSpawn(delay = MOLE_RESPAWN_MS + Math.random() * MOLE_RESPAWN_JITTER_MS) {
    if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
    moleTimerRef.current = window.setTimeout(() => spawnMoles(), delay);
  }

  function spawnMoles() {
    if (phaseRef.current !== "playing") return;

    setActivePositions(pickPositions(getTargetCount()));
    moleTimerRef.current = window.setTimeout(() => {
      setActivePositions([]);
      if (phaseRef.current === "playing") {
        scheduleNextSpawn();
      }
    }, MOLE_VISIBLE_MS);
  }

  function startGame() {
    setScore(0);
    scoreRef.current = 0;
    setTimeLeft(DURATION);
    timeLeftRef.current = DURATION;
    setActivePositions([]);
    setHitAnim([]);
    phaseRef.current = "playing";
    setPhase("playing");
    startTimeRef.current = performance.now();

    function tick() {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, DURATION - elapsed);
      const rounded = Math.ceil(remaining);
      setTimeLeft(rounded);
      timeLeftRef.current = rounded;

      if (remaining <= 0) {
        phaseRef.current = "result";
        setPhase("result");
        setActivePositions([]);
        return;
      }
      timerRef.current = requestAnimationFrame(tick);
    }
    timerRef.current = requestAnimationFrame(tick);

    scheduleNextSpawn(520);
  }

  function handleHit(pos: number) {
    if (activePositionsRef.current.includes(pos)) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      setHitAnim((current) => [...current, pos]);

      // Show roast toast every 5 hits to avoid spam
      if (scoreRef.current % 5 === 0) {
        const opponent = player === "playerA" ? COUPLE.partnerB : COUPLE.partnerA;
        const roast = WHACK_ROASTS[Math.floor(Math.random() * WHACK_ROASTS.length)].replace("{name}", opponent);
        toast(roast, { duration: 1500 });
      }

      setTimeout(() => {
        setHitAnim((current) => current.filter((item) => item !== pos));
      }, 260);

      const nextPositions = activePositionsRef.current.filter((item) => item !== pos);
      setActivePositions(nextPositions);

      if (nextPositions.length === 0) {
        scheduleNextSpawn(QUICK_RESPAWN_MS);
      }
    }
  }

  async function saveScore() {
    try {
      await saveWhackAMoleBestScore(player, score);
      onScoreSaved();
    } catch {
      toast.error("保存分数失败");
    }
  }

  useEffect(() => {
    if (phase === "result") {
      clearTimers();
      saveScore();
    }
  }, [phase]);

  const best = player === "playerA" ? bestA : bestB;
  const isNewBest = score > best;

  if (phase === "idle") {
    return (
      <div className="text-center space-y-6">
        <div className="inline-flex p-4 rounded-full bg-warm-100 text-warm-500">
          <Heart size={40} fill="currentColor" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-stone-800 mb-1">
            打地鼠
          </h2>
          <p className="text-sm text-stone-400">30 秒内疯狂点击，决一胜负</p>
        </div>

        <div>
          <p className="text-xs text-stone-400 mb-3">谁来玩？</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setPlayer("playerA")}
              className={cn(
                "px-6 py-3 rounded-2xl text-sm font-medium transition-all",
                player === "playerA"
                  ? "bg-warm-500 text-white shadow-sm"
                  : "bg-white border border-warm-200 text-stone-600"
              )}
            >
              {COUPLE.partnerA}
            </button>
            <button
              onClick={() => setPlayer("playerB")}
              className={cn(
                "px-6 py-3 rounded-2xl text-sm font-medium transition-all",
                player === "playerB"
                  ? "bg-rose-500 text-white shadow-sm"
                  : "bg-white border border-warm-200 text-stone-600"
              )}
            >
              {COUPLE.partnerB}
            </button>
          </div>
        </div>

        <button
          onClick={startGame}
          className="w-full py-3 rounded-2xl bg-warm-500 text-white font-medium hover:bg-warm-600 active:scale-95 transition-all"
        >
          开始游戏
        </button>

        {best > 0 && (
          <p className="text-xs text-stone-400">
            {player === "playerA" ? COUPLE.partnerA : COUPLE.partnerB} 的最高分：{best}
          </p>
        )}
      </div>
    );
  }

  if (phase === "result") {
    const review = GAME_REVIEWS.find((r) => score >= r.min && score <= r.max) || GAME_REVIEWS[0];
    const ReviewIcon = {
      Frown: () => <Frown size={20} className="text-stone-400" />,
      Meh: () => <Meh size={20} className="text-stone-400" />,
      Smile: () => <Smile size={20} className="text-warm-400" />,
      Flame: () => <Flame size={20} className="text-orange-500" />,
      Trophy: () => <Trophy size={20} className="text-amber-500" />,
    }[review.icon] || (() => null);

    return (
      <div className="text-center space-y-6">
        <div className="inline-flex p-4 rounded-full bg-warm-100 text-warm-500">
          <Trophy size={40} />
        </div>
        <div>
          {isNewBest && (
            <p className="text-sm text-warm-500 font-medium mb-2 animate-bounce-in">
              新纪录！
            </p>
          )}
          <p className="text-6xl font-serif font-bold text-warm-600 tabular-nums">
            {score}
          </p>
          <p className="text-sm text-stone-400 mt-1">分</p>
          <p className="text-sm text-stone-500 mt-2 inline-flex items-center gap-1">
            <ReviewIcon /> {review.text}
          </p>
        </div>

        {best > 0 && !isNewBest && (
          <p className="text-xs text-stone-400">
            最高分：{best}（还差 {best - score} 分追平）
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={startGame}
            className="flex-1 py-3 rounded-2xl bg-warm-500 text-white font-medium hover:bg-warm-600 active:scale-95 transition-all inline-flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} />
            再来一局
          </button>
          <button
            onClick={() => {
              setPhase("idle");
              setPlayer(player === "playerA" ? "playerB" : "playerA");
            }}
            className="flex-1 py-3 rounded-2xl border border-warm-300 text-warm-600 font-medium hover:bg-warm-50 active:scale-95 transition-all"
          >
            换人
          </button>
        </div>
      </div>
    );
  }

  const opponent = player === "playerA" ? COUPLE.partnerB : COUPLE.partnerA;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-stone-400">
            {player === "playerA" ? COUPLE.partnerA : COUPLE.partnerB}
          </p>
          <p className="text-4xl font-serif font-bold text-warm-600 tabular-nums">
            {score}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-stone-400">剩余</p>
          <p
            className={cn(
              "text-3xl font-mono tabular-nums",
              timeLeft <= 5 ? "text-red-500" : "text-stone-600"
            )}
          >
            {timeLeft}
          </p>
        </div>
      </div>

      {/* 4x4 Grid */}
      <div
        className="grid gap-2.5 mx-auto max-w-xs touch-manipulation"
        style={{ gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: GRID_SIZE }).map((_, i) => {
          const isMole = molePositions.includes(i);
          const isHit = hitAnim.includes(i);
          return (
            <button
              key={i}
              onClick={() => handleHit(i)}
              className={cn(
                "aspect-square rounded-full flex items-center justify-center transition-all duration-150",
                isMole
                  ? "bg-warm-500 text-white scale-100 shadow-lg"
                  : "bg-white border border-warm-200/50 text-transparent scale-90",
                isHit && "scale-75"
              )}
            >
              <span
                className={cn(
                  "text-lg font-serif font-bold transition-all duration-150",
                  isMole ? "opacity-100" : "opacity-0"
                )}
              >
                {opponent[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
