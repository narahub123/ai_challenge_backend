import mongoose, { Model, Schema } from "mongoose";
import { IDialogueEntry } from "../types";
import { Counter } from "../models";

const DialogueEntrySchema = new Schema<IDialogueEntry>(
  {
    entry_idx: { type: Number, unique: true, sparse: true },
    dialogue_idx: { type: Number, required: true },
    sender_dialogue_user_idx: {
      type: Number,
      required: true,
    },
    user_type: { type: String, enum: ["self", "opponent"], required: true },
    content_type: {
      type: String,
      enum: ["text", "cardnews", "quiz", "module"],
      required: true,
    },
    content: { type: Schema.Types.Mixed, required: true },
    image_urls: { type: [String], default: null },
    video_urls: { type: [String], default: null },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// AUTO_INCREMENT
DialogueEntrySchema.pre<IDialogueEntry>("save", async function () {
  const doc = this;
  if (!doc.entry_idx) {
    const counter = await Counter.findByIdAndUpdate(
      "dialogue_entry_idx",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).exec();
    if (!counter) throw new Error("Failed to create counter for entry_idx");
    doc.entry_idx = counter.seq;
  }
});

export const DialogueEntry: Model<IDialogueEntry> =
  (mongoose.models.DialogueEntry as Model<IDialogueEntry>) ||
  mongoose.model<IDialogueEntry>("DialogueEntry", DialogueEntrySchema);
