import mongoose, { Model, Schema } from "mongoose";
import { DialogueEntry as IDialogueEntry } from "../types/dialogue-entry.type";
import { Counter } from "../models";

// DialogueEntryQA 서브스키마 (question/answer 공용)
const DialogueEntryQASchema = new Schema(
  {
    content_type: {
      type: String,
      enum: ["text", "card-news", "quiz"],
      required: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
      // content는 string (text) 또는 object (card-news: {card_news_idx}, quiz: {quiz_idx})
    },
  },
  { _id: false }
);

// DialogueEntry 스키마
const DialogueEntrySchema = new Schema<IDialogueEntry>(
  {
    entry_idx: { type: Number, unique: true, sparse: true },
    dialogue_idx: { type: Number, required: true },
    self_dialogue_user_idx: { type: Number, required: true },
    opponent_dialogue_user_idx: { type: Number, required: true },
    question: {
      type: DialogueEntryQASchema,
      required: true,
    },
    answer: {
      type: DialogueEntryQASchema,
      default: null,
    },
    image_urls: { type: [String], default: [] },
    video_urls: { type: [String], default: [] },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// AUTO_INCREMENT 구현: 새 문서 저장 전 entry_idx 증가
DialogueEntrySchema.pre<IDialogueEntry>("save", async function () {
  const doc = this;
  if (
    doc.isNew &&
    (doc.entry_idx === undefined || doc.entry_idx === null)
  ) {
    const counter = await Counter.findByIdAndUpdate(
      "dialogue_entry_idx",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).exec();

    if (!counter)
      throw new Error("Failed to create counter for dialogue_entry_idx");
    doc.entry_idx = counter.seq;
  }
});

// 인덱스
DialogueEntrySchema.index({ entry_idx: 1 });
DialogueEntrySchema.index({ dialogue_idx: 1 });
DialogueEntrySchema.index({ self_dialogue_user_idx: 1 });
DialogueEntrySchema.index({ opponent_dialogue_user_idx: 1 });

// 모델 생성
export const DialogueEntry: Model<IDialogueEntry> =
  (mongoose.models.DialogueEntry as Model<IDialogueEntry>) ||
  mongoose.model<IDialogueEntry>("DialogueEntry", DialogueEntrySchema);

// 시퀀스 초기화 유틸 (기존 데이터가 있는 경우)
export async function initDialogueEntryCounter(): Promise<void> {
  const maxDoc = await DialogueEntry.findOne()
    .sort({ entry_idx: -1 })
    .select("entry_idx")
    .lean()
    .exec();
  const currentMax = maxDoc?.entry_idx ?? 0;

  // 최소값을 1로 보장 (auto increment는 1부터 시작)
  const initialSeq = Math.max(currentMax, 1);

  await Counter.findByIdAndUpdate(
    "dialogue_entry_idx",
    { $max: { seq: initialSeq } },
    { upsert: true, new: true }
  ).exec();
}
