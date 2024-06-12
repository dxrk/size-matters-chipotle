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
  req: NextRequest,
  { params }: { params: { restaurantId: number } }
) {
  await connectToDatabase();

  const { restaurantId } = params;
  const reviews = await Review.find({ restaurantId: Number(restaurantId) });

  const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRatings / reviews.length : 0;

  return NextResponse.json({ reviews, averageRating });
}

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
