"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Heart, Trophy, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { COUPLE } from "@/lib/constants";
import { updateGameScore } from "@/lib/actions";
import { cn } from "@/lib/utils";

type Phase = "idle" | "playing" | "result";
type Player = "playerA" | "playerB";

const DURATION = 30;
const GRID_SIZE = 16;
const GRID_COLUMNS = 4;
const MOLE_INTERVAL_MIN = 320;
const MOLE_INTERVAL_MAX = 850;
const MOLE_VISIBLE_MIN = 220;
const MOLE_VISIBLE_MAX = 650;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface WhackAMoleProps {
  bestA: number;
  bestB: number;
  gameId: number | null;
  onScoreSaved: () => void;
}

export function WhackAMole({ bestA, bestB, gameId, onScoreSaved }: WhackAMoleProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [player, setPlayer] = useState<Player>("playerA");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [molePos, setMolePos] = useState<number | null>(null);
  const [hitAnim, setHitAnim] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);
  const moleTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const scoreRef = useRef(0);
  const timeLeftRef = useRef(DURATION);
  const phaseRef = useRef<Phase>("idle");

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

  function spawnMole() {
    const pos = Math.floor(Math.random() * GRID_SIZE);
    setMolePos(pos);
    const ratio = timeLeftRef.current / DURATION;
    const visibleMs = lerp(MOLE_VISIBLE_MIN, MOLE_VISIBLE_MAX, ratio);
    moleTimerRef.current = window.setTimeout(() => {
      setMolePos(null);
      if (phaseRef.current === "playing") {
        const delay =
          lerp(MOLE_INTERVAL_MIN, MOLE_INTERVAL_MAX, ratio) +
          Math.random() * 120;
        moleTimerRef.current = window.setTimeout(() => spawnMole(), delay);
      }
    }, visibleMs);
  }

  function startGame() {
    setScore(0);
    scoreRef.current = 0;
    setTimeLeft(DURATION);
    timeLeftRef.current = DURATION;
    setMolePos(null);
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
        setMolePos(null);
        return;
      }
      timerRef.current = requestAnimationFrame(tick);
    }
    timerRef.current = requestAnimationFrame(tick);

    const delay = MOLE_INTERVAL_MAX + Math.random() * 120;
    moleTimerRef.current = window.setTimeout(() => spawnMole(), delay);
  }

  function handleHit(pos: number) {
    if (pos === molePos) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      setMolePos(null);
      setHitAnim(pos);
      setTimeout(() => setHitAnim(null), 300);

      if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
      const ratio = timeLeftRef.current / DURATION;
      const delay =
        lerp(MOLE_INTERVAL_MIN, MOLE_INTERVAL_MAX, ratio) +
        Math.random() * 120;
      moleTimerRef.current = window.setTimeout(() => spawnMole(), delay);
    }
  }

  async function saveScore() {
    if (!gameId) return;
    try {
      await updateGameScore(gameId, player, score);
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
          <p className="text-sm text-stone-400">30 秒内尽可能多地点中目标</p>
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
        className="grid gap-2.5 mx-auto max-w-xs"
        style={{ gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: GRID_SIZE }).map((_, i) => {
          const isMole = molePos === i;
          const isHit = hitAnim === i;
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
              <Heart
                size={28}
                fill={isMole ? "currentColor" : "none"}
                className={cn(
                  "transition-all duration-150",
                  isMole ? "opacity-100" : "opacity-0"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
