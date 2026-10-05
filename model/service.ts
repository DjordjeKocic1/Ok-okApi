import mongoose from "mongoose";
import { Service } from "../types/type";

const Schema = mongoose.Schema;

const serviceSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["active", "cancelled", "completed"],
      default: "active",
    },
    tripNote: String,
    destinationStart: { country: String, city: String },
    destinationEnd: { country: String, city: String },
    departureTime: { type: Date, required: true },
    cost: Number,
    maxWeight: Number,
    restrictedItems: {
      type: [String],
      enum: ["pets", "breakingGlass", "flammableMaterials", "alcohol"],
      default: [],
    },
    spotsAvailable: Number,
    transportMode: {
      type: String,
      enum: ["car", "bus", "plane", "train", "truck"],
    },
  },
  {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

serviceSchema.virtual("requests", {
  ref: "ServiceRequest",
  localField: "_id",
  foreignField: "service",
});

export default mongoose.model<Service>("Service", serviceSchema);
