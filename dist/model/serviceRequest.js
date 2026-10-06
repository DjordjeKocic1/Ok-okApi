"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const serviceRequestSchema = new Schema({
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
}, { timestamps: true });
serviceRequestSchema.index({ service: 1, fromUser: 1 }, { unique: true });
exports.default = mongoose_1.default.model("ServiceRequest", serviceRequestSchema);
