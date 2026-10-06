"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const reviewSchema = new Schema({
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
}, { timestamps: true });
reviewSchema.index({ request: 1 }, { unique: true });
exports.default = mongoose_1.default.model("Review", reviewSchema);
