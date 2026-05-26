"use client";

import { useState, useRef, useEffect } from "react";
import { Music, Pause } from "lucide-react";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/music/ambient.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (!hasInteracted) {
      setHasInteracted(true);
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  }

  return (
    <button
      onClick={toggle}
      className="fixed bottom-20 right-4 z-40 w-11 h-11 rounded-full bg-white/80 border border-warm-200/50 shadow-md flex items-center justify-center text-warm-600 hover:bg-warm-100 hover:scale-105 transition-all duration-200"
      title={isPlaying ? "暂停音乐" : "播放音乐"}
    >
      {isPlaying ? <Pause size={18} /> : <Music size={18} />}
    </button>
  );
}
