"use client";

import { useMemo, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function FloatingHearts() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (pathname !== "/") {
      setVisible(false);
      return;
    }

    const onVisibility = () => {
      setVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", onVisibility);
    setVisible(!document.hidden);

    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [pathname]);

  const particles = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: `${seededRandom(i * 7 + 1) * 80 + 10}%`,
      delay: `${seededRandom(i * 13 + 3) * 10}s`,
      duration: `${10 + seededRandom(i * 17 + 5) * 8}s`,
      size: 10 + Math.floor(seededRandom(i * 23 + 7) * 10),
      opacity: 0.15 + seededRandom(i * 31 + 11) * 0.2,
      isHeart: i < 5,
    }));
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" style={{ willChange: "transform" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 animate-float-up"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        >
          <div
            className="animate-gentle-sway"
            style={{
              animationDelay: p.delay,
              animationDuration: `${5 + p.id}s`,
            }}
          >
            {p.isHeart ? (
              <Heart
                size={p.size}
                className="text-warm-300"
                style={{ opacity: p.opacity }}
                fill="currentColor"
              />
            ) : (
              <div
                className="rounded-full bg-warm-400"
                style={{
                  width: p.size * 0.3,
                  height: p.size * 0.3,
                  opacity: p.opacity * 0.6,
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
