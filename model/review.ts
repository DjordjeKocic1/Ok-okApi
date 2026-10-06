import mongoose from "mongoose";
import { Review } from "../types/type";

const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
    request: {
      type: Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
      immutable: true,
    },
    toUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: false, maxlength: 500 },
  },
  { timestamps: true },
);

reviewSchema.index({ request: 1 }, { unique: true });

export default mongoose.model<Review>("Review", reviewSchema);
