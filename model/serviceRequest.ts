import mongoose from "mongoose";
import { ServiceRequest } from "../types/type";

const Schema = mongoose.Schema;

const serviceRequestSchema = new Schema(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      immutable: true,
      index: true,
    },
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
    toUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      default: "pending",
    },
    rated: { type: Boolean, required: false, default: false },
    transportDescription: String,
    packageWeight: Number,
    specialRequest: { type: String, required: false },
    specialRequestCost: { type: Number, required: false },
  },
  { timestamps: true },
);

serviceRequestSchema.index({ service: 1, fromUser: 1 }, { unique: true });

export default mongoose.model<ServiceRequest>(
  "ServiceRequest",
  serviceRequestSchema,
);
