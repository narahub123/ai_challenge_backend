// models/dialogueUser.ts
import mongoose, { Model, Schema } from "mongoose";
import { IDialogueUser } from "../types";
import { Counter } from "../models";

const DialogueUserSchema = new Schema<IDialogueUser>(
  {
    dialogue_user_idx: { type: Number, unique: true, sparse: true },
    name: { type: String, required: true },
    avatar_url: { type: String, default: null },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// AUTO_INCREMENT
DialogueUserSchema.pre<IDialogueUser>("save", async function () {
  const doc = this;
  // 안전한 검사: undefined 또는 null 일 때만 증가
  if (doc.dialogue_user_idx == null) {
    const counter = await Counter.findByIdAndUpdate(
      "dialogue_user_idx",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).exec();
    if (!counter)
      throw new Error("Failed to create counter for dialogue_user_idx");
    doc.dialogue_user_idx = counter.seq;
  }
});

export const DialogueUser: Model<IDialogueUser> =
  (mongoose.models.DialogueUser as Model<IDialogueUser>) ||
  mongoose.model<IDialogueUser>("DialogueUser", DialogueUserSchema);
