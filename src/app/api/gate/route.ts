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

function sanitizeRedirect(value?: FormDataEntryValue | string | null) {
  const text = typeof value === "string" ? value : "";
  if (!text || !text.startsWith("/") || text.startsWith("//")) return "/";
  return text;
}

function isJsonRequest(req: Request) {
  return req.headers.get("content-type")?.includes("application/json") ?? false;
}

function setAuthCookies(res: NextResponse, password: string, from: string) {
  const isProd =
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production";

  return hashPassword(password).then((hashed) => {
    res.cookies.set(COOKIE_NAME, hashed, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });

    res.cookies.set("skip_next_app_loading", "1", {
      secure: isProd,
      sameSite: "lax",
      maxAge: 60,
      path: "/",
    });

    res.cookies.set("skip_next_route_loading", "1", {
      secure: isProd,
      sameSite: "lax",
      maxAge: 60,
      path: "/",
    });

    if (from === "/") {
      res.cookies.set("intro_autoplay", "1", {
        secure: isProd,
        sameSite: "lax",
        maxAge: 60,
        path: "/",
      });
    }

    return res;
  });
}

async function readPayload(req: Request) {
  if (isJsonRequest(req)) {
    const body = await req.json();
    return {
      password: typeof body.password === "string" ? body.password : "",
      from: sanitizeRedirect(body.from),
      json: true,
    };
  }

  const form = await req.formData();
  return {
    password: String(form.get("password") ?? ""),
    from: sanitizeRedirect(form.get("from")),
    json: false,
  };
}

export async function POST(req: Request) {
  const { password, from, json } = await readPayload(req);
  const pwA = process.env.SITE_PASSWORD_A;
  const pwB = process.env.SITE_PASSWORD_B;

  if (!pwA && !pwB) {
    if (json) return NextResponse.json({ ok: true });
    return NextResponse.redirect(new URL(from, req.url), { status: 303 });
  }

  const valid = password === pwA || password === pwB;
  if (!valid) {
    if (json) {
      return NextResponse.json({ error: "密码不对哦" }, { status: 401 });
    }

    const url = new URL("/gate", req.url);
    url.searchParams.set("from", from);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, { status: 303 });
  }

  const res = json
    ? NextResponse.json({ ok: true })
    : NextResponse.redirect(new URL(from, req.url), { status: 303 });

  return setAuthCookies(res, password, from);
}
