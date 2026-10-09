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
    messages: {
        type: [
            {
                sender: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                    immutable: true,
                },
                text: {
                    type: String,
                    required: true,
                    trim: true,
                    minlength: 1,
                    maxlength: 1000,
                },
                createdAt: { type: Date, default: Date.now, immutable: true },
            },
        ],
        default: [],
    },
}, { timestamps: true });
serviceRequestSchema.index({ service: 1, fromUser: 1 }, { unique: true });
exports.default = mongoose_1.default.model("ServiceRequest", serviceRequestSchema);
