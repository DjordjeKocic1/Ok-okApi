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
    transportDescription: String,
    packageWeight: Number,
    specialRequest: { type: String, required: false },
    specialRequestCost: { type: Number, required: false },
  },
  { timestamps: true },
);

export default mongoose.model<ServiceRequest>(
  "ServiceRequest",
  serviceRequestSchema,
);
