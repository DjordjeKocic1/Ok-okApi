"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
    },
    phone: { type: String, required: false },
    idVerified: { type: Boolean, required: false },
    password: String,
    searchedDestinations: [
        {
            _id: false,
            destinationStart: { country: String, city: String },
            destinationEnd: { country: String, city: String },
        },
    ],
    ratingSum: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
}, {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
userSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "toUser",
});
userSchema.virtual("ratingAverage").get(function () {
    return this.ratingCount ? this.ratingSum / this.ratingCount : 0;
});
exports.default = mongoose_1.default.model("User", userSchema);
