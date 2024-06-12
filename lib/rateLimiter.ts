import { NextRequest, NextResponse } from "next/server";

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

export default function rateLimiter(options: RateLimitOptions) {
  return (req: NextRequest) => {
    const { windowMs, maxRequests } = options;
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      req.ip ||
      "unknown";
    const currentTime = Date.now();

    const rateLimitInfo = rateLimitStore.get(ip) || {
      count: 0,
      timestamp: currentTime,
    };

    if (currentTime - rateLimitInfo.timestamp > windowMs) {
      rateLimitInfo.count = 0;
      rateLimitInfo.timestamp = currentTime;
    }

    rateLimitInfo.count += 1;

    if (rateLimitInfo.count > maxRequests) {
      return NextResponse.json(
        { message: "Too many requests, please try again later." },
        { status: 429 }
      );
    }

    rateLimitStore.set(ip, rateLimitInfo);
    return NextResponse.next();
  };
}
