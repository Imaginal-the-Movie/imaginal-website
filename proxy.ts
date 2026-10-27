import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

const username = "imaginal";

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

export function proxy(request: NextRequest) {
  const password = process.env.IMAGINAL_PREVIEW_PASSWORD;

  // The local design workspace stays convenient; deployed previews fail closed.
  if (process.env.NODE_ENV === "development" && !password) return NextResponse.next();
  if (!password) {
    return new NextResponse("The Imaginal preview is not configured yet.", {
      status: 503,
      headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" },
    });
  }

  const authorization = request.headers.get("authorization") || "";
  const encoded = /^Basic ([A-Za-z0-9+/=]+)$/i.exec(authorization)?.[1];
  const supplied = encoded ? Buffer.from(encoded, "base64").toString("utf8") : "";
  const authenticated = timingSafeEqual(digest(supplied), digest(`${username}:${password}`));
  if (!authenticated) {
    return new NextResponse("Enter the Imaginal preview username and password.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Imaginal preview", charset="UTF-8"',
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: "/strategy-room/:path*",
};
