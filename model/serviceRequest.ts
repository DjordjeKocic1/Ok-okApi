import mongoose from "mongoose";
import { ServiceRequest } from "../types/type";

const Schema = mongoose.Schema;

const serviceRequestSchema = new Schema(
  {
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    fromUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    toUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    transportDescription: String,
    packageWeight: Number,
    specialRequest: { type: String, require: false },
    specialRequestCost: { type: Number, require: false },
  },
  { timestamps: true },
);

export default mongoose.model<ServiceRequest>(
  "ServiceRequest",
  serviceRequestSchema,
);
