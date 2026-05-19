import { NextResponse } from "next/server";

const COOKIE_NAME = "site_auth";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req: Request) {
  const { password } = await req.json();
  const pwA = process.env.SITE_PASSWORD_A;
  const pwB = process.env.SITE_PASSWORD_B;

  if (!pwA && !pwB) {
    return NextResponse.json({ ok: true });
  }

  const valid = password === pwA || password === pwB;
  if (!valid) {
    return NextResponse.json({ error: "密码不对哦" }, { status: 401 });
  }

  const hashed = await hashPassword(password);
  const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, hashed, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });

  return res;
}
