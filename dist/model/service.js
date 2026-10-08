"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const serviceSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        immutable: true,
    },
    status: {
        type: String,
        enum: {
            values: ["active", "cancelled", "completed"],
            message: "INVALID_STATUS",
        },
        default: "active",
    },
    tripNote: {
        type: String,
        trim: true,
        required: true,
        minlength: 5,
        maxlength: 500,
    },
    destinationStart: {
        country: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
    },
    destinationEnd: {
        country: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
    },
    departureTime: { type: Date, required: true },
    cost: { type: Number, min: 0 },
    maxWeight: {
        type: Number,
        required: true,
        min: 0.1,
        max: 500,
    },
    restrictedItems: {
        type: [
            {
                type: String,
                enum: {
                    values: ["pets", "breakingGlass", "flammableMaterials", "alcohol"],
                    message: "INVALID_RESTRICTED_ITEM",
                },
            },
        ],
        default: [],
    },
    spotsAvailable: {
        type: Number,
        required: true,
        min: 0,
    },
    transportMode: {
        type: String,
        required: true,
        enum: {
            values: ["car", "bus", "plane", "train", "truck"],
            message: "INVALID_TRANSPORT_MODE",
        },
    },
}, {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
serviceSchema.virtual("requests", {
    ref: "ServiceRequest",
    localField: "_id",
    foreignField: "service",
});
exports.default = mongoose_1.default.model("Service", serviceSchema);
