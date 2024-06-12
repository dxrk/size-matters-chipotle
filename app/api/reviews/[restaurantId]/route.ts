import { NextRequest, NextResponse } from "next/server";
import mongoose, { Schema, model, models, Document } from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import rateLimiter from "@/lib/rateLimiter";
import { Review } from "@/lib/models";

const rateLimiterMiddleware = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
});

export async function POST(
  req: NextRequest,
  { params }: { params: { restaurantId: number } }
) {
  await connectToDatabase();
  const rateLimitResponse = rateLimiterMiddleware(req);

  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  const { rating } = await req.json();
  const { restaurantId } = params;

  const review = new Review({ restaurantId: Number(restaurantId), rating });
  await review.save();
  return NextResponse.json(review);
}
