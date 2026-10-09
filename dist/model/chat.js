"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const chatSchema = new Schema({
    users: {
        type: [{ type: Schema.Types.ObjectId, ref: "User" }],
        required: true,
        validate: (v) => v.length === 2,
    },
    messages: [
        {
            fromUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
            text: { type: String, required: true, trim: true, maxlength: 2000 },
            createdAt: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true });
chatSchema.index({ users: 1 });
exports.default = mongoose_1.default.model("Chat", chatSchema);
