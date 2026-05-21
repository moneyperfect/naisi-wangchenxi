"use client";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right";
}

export function ScrollReveal({
  children,
  delay: _delay = 0,
  direction: _direction = "up",
}: ScrollRevealProps) {
  return <div>{children}</div>;
}
