"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const serviceRequestSchema = new Schema({
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    fromUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    toUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    transportDescription: String,
    packageWeight: Number,
    specialRequest: { type: String, require: false },
    specialRequestCost: { type: Number, require: false },
}, { timestamps: true });
exports.default = mongoose_1.default.model("ServiceRequest", serviceRequestSchema);
