import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import rateLimiter from "@/lib/rateLimiter";
import { Review } from "@/lib/models";

// Rate limiter middleware
const rateLimiterMiddleware = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
});

export async function POST(
  req: NextRequest,
  context: { params: { restaurantId: string } }
) {
  await connectToDatabase();
  
  // Apply rate limiter
  const rateLimitResponse = rateLimiterMiddleware(req);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  // Get rating from request body
  const { rating } = await req.json();
  const { restaurantId } = context.params;

  // Create and save the review
  const review = new Review({ restaurantId: Number(restaurantId), rating });
  await review.save();

  // Return the created review
  return NextResponse.json(review);
}
