import { RequestHandler } from "express";
import Chat from "../model/chat";
import User from "../model/user";
import { http422Error } from "../utils/customError";
import { Types } from "mongoose";

export const sendMessage: RequestHandler<
  { userId: string },
  {},
  { text: string }
> = async (req, res, next) => {
  try {
    const me = new Types.ObjectId(req.userId);
    const other = new Types.ObjectId(req.params.userId);

    if (me === other) throw new http422Error("CANT_MESSAGE_YOURSELF");

    const payload = {
      fromUser: me,
      text: req.body.text,
      createdAt: new Date(),
    };

    let chat = await Chat.findOneAndUpdate(
      { users: { $all: [me, other] } },
      { $push: { messages: payload } },
      { returnDocument: "after", runValidators: true },
    ).populate({
      path: "messages",
      populate: {
        path: "fromUser",
        select: "firstName lastName",
      },
    });

    if (!chat) {
      chat = await Chat.create({ users: [me, other], messages: [payload] });
    }

    res.status(201).json({ chat });
  } catch (error) {
    next(error);
  }
};

export const getChats: RequestHandler = async (req, res, next) => {
  try {
    const chats = await Chat.find(
      { users: req.userId },
      { messages: { $slice: -1 }, users: 1, updatedAt: 1 },
    )
      .populate("users", "firstName")
      .sort({ updatedAt: -1 });

    res.status(200).json({ chats });
  } catch (error) {
    next(error);
  }
};

export const getChat: RequestHandler<{ userId: string }> = async (
  req,
  res,
  next,
) => {
  try {
    const chat = await Chat.findOne({
      users: { $all: [req.userId, req.params.userId] },
    });

    res.status(200).json({ chat: chat?.messages });
  } catch (error) {
    next(error);
  }
};
