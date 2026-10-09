"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChats = exports.getChat = exports.sendMessage = void 0;
const chat_1 = __importDefault(require("../model/chat"));
const customError_1 = require("../utils/customError");
const mongoose_1 = require("mongoose");
const sendMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const me = new mongoose_1.Types.ObjectId(req.userId);
        const other = new mongoose_1.Types.ObjectId(req.params.userId);
        if (me === other)
            throw new customError_1.http422Error("CANT_MESSAGE_YOURSELF");
        const payload = {
            fromUser: me,
            text: req.body.text,
            createdAt: new Date(),
        };
        let chat = yield chat_1.default.findOneAndUpdate({ users: { $all: [me, other] } }, { $push: { messages: payload } }, { returnDocument: "after", runValidators: true }).populate({
            path: "messages",
            populate: {
                path: "fromUser",
                select: "firstName lastName",
            },
        });
        if (!chat) {
            chat = yield chat_1.default.create({ users: [me, other], messages: [payload] });
        }
        res.status(201).json({ chat });
    }
    catch (error) {
        next(error);
    }
});
exports.sendMessage = sendMessage;
const getChat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        next(error);
    }
});
exports.getChat = getChat;
const getChats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = yield chat_1.default.find({ users: req.userId }, { messages: { $slice: -1 } }).populate("users", "firstName");
        res.status(200).json({ chats });
    }
    catch (error) {
        next(error);
    }
});
exports.getChats = getChats;
