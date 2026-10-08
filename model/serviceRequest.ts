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
      enum: {
        values: ["pending", "accepted", "rejected", "cancelled"],
        message: "INVALID_STATUS",
      },
      default: "pending",
    },
    rated: { type: Boolean, required: false, default: false },
    transportDescription: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 500,
    },
    packageWeight: {
      type: Number,
      min: 0,
      max: 200,
    },
    specialRequest: {
      type: String,
      required: false,
      minlength: 5,
      maxlength: 500,
    },
    specialRequestCost: { type: Number, required: false, min: 0 },
  },
  { timestamps: true },
);

serviceRequestSchema.index({ service: 1, fromUser: 1 }, { unique: true });

export default mongoose.model<ServiceRequest>(
  "ServiceRequest",
  serviceRequestSchema,
);
