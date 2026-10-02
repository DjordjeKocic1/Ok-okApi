import mongoose from "mongoose";
import { User } from "../types/type";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
    },
    phone: { type: String, required: false },
    idVerified: { type: Boolean, required: false },
    password: { type: String, select: false },
    ratings: [
      {
        _id: false,
        reviewer: { type: Schema.Types.ObjectId, ref: "User", required: true },
        firstName: String,
        rating: Number,
        comment: { type: String, required: false },
      },
    ],
    searchedDestinations: [
      {
        _id: false,
        destinationStart: { country: String, city: String },
        destinationEnd: { country: String, city: String },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<User>("User", userSchema);
