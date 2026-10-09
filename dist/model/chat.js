"use strict";
// import mongoose from "mongoose";
// const Schema = mongoose.Schema;
// const chatSchema = new Schema(
//   {
//     users: {
//       type: [{ type: Schema.Types.ObjectId, ref: "User" }],
//       required: true,
//       validate: (v: unknown[]) => v.length === 2,
//     },
//     messages: [
//       {
//         fromUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
//         text: { type: String, required: true, trim: true, maxlength: 2000 },
//         createdAt: { type: Date, default: Date.now },
//       },
//     ],
//   },
//   { timestamps: true },
// );
// chatSchema.index({ users: 1 });
// export default mongoose.model("Chat", chatSchema);
