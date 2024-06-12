import { NextRequest, NextResponse } from "next/server";
import mongoose, { Schema, model, models, Document } from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import rateLimiter from "@/lib/rateLimiter";

interface IReview extends Document {
  restaurantId: number;
  rating: number;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
  restaurantId: { type: Number, required: true },
  rating: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Review = models.Review || model<IReview>("Review", reviewSchema);

const rateLimiterMiddleware = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
});

export async function GET(
  req: NextRequest & { params: { restaurantId: string } }
) {
  await connectToDatabase();
  const rateLimitResponse = rateLimiterMiddleware(req);

  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  const { restaurantId } = req.params as { restaurantId: string };
  const reviews = await Review.find({ restaurantId: Number(restaurantId) });
  return NextResponse.json(reviews);
}

export async function POST(
  req: NextRequest & { params: { restaurantId: string } }
) {
  await connectToDatabase();
  const rateLimitResponse = rateLimiterMiddleware(req);

  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  const { rating } = await req.json();
  const { restaurantId } = req.params as { restaurantId: string };

  const review = new Review({ restaurantId: Number(restaurantId), rating });
  await review.save();
  return NextResponse.json(review);
}
