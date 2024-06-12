import { Schema, model, models, Document } from "mongoose";

export type Store = {
  restaurantNumber: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  averageRating?: number;
  totalRatings?: number;
};

export interface MapProps {
  storeList: Store[];
  lat: number;
  lng: number;
  onUpdateLocation: (stores: Store[], lat: number, lng: number) => void;
}

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

export const Review = models.Review || model<IReview>("Review", reviewSchema);
