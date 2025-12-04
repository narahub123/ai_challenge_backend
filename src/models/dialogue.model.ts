import mongoose, { Model, Schema } from "mongoose";
import { IDialogue } from "../types";
import { Counter } from "../models";

const DialogueSchema = new Schema<IDialogue>(
  {
    dialogue_idx: { type: Number, unique: true, sparse: true },
    title: { type: String, default: null },
    description: { type: String, default: null },
    participants: { type: [Number], default: [] },
    status: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// AUTO_INCREMENT 구현: 새 문서 저장 전 dialogue_idx 증가
DialogueSchema.pre<IDialogue>("save", async function () {
  const doc = this;
  if (
    doc.isNew &&
    (doc.dialogue_idx === undefined || doc.dialogue_idx === null)
  ) {
    const counter = await Counter.findByIdAndUpdate(
      "dialogue_idx",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).exec();

    if (!counter) throw new Error("Failed to create counter for dialogue_idx");
    doc.dialogue_idx = counter.seq;
  }
});

export const Dialogue: Model<IDialogue> =
  (mongoose.models.Dialogue as Model<IDialogue>) ||
  mongoose.model<IDialogue>("Dialogue", DialogueSchema);
