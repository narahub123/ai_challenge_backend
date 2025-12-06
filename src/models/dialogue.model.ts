import mongoose, { Model, Schema } from "mongoose";
import { IDialogue } from "../types";
import { Counter } from "../models";

// Dialogue 스키마
const DialogueSchema = new Schema<IDialogue>(
  {
    dialogue_idx: { type: Number, unique: true, sparse: true },
    title: { type: String, default: null, trim: true },
    description: { type: String, default: null, trim: true },
    participants: { type: [Number], default: [] }, // DialogueUser 참조 배열
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

    if (!counter)
      throw new Error("Failed to create counter for dialogue_idx");
    doc.dialogue_idx = counter.seq;
  }
});

// 인덱스
DialogueSchema.index({ dialogue_idx: 1 });
DialogueSchema.index({ status: 1 });
DialogueSchema.index({ participants: 1 });

// 모델 생성
export const Dialogue: Model<IDialogue> =
  (mongoose.models.Dialogue as Model<IDialogue>) ||
  mongoose.model<IDialogue>("Dialogue", DialogueSchema);

// 시퀀스 초기화 유틸 (기존 데이터가 있는 경우)
export async function initDialogueCounter(): Promise<void> {
  const maxDoc = await Dialogue.findOne()
    .sort({ dialogue_idx: -1 })
    .select("dialogue_idx")
    .lean()
    .exec();
  const currentMax = maxDoc?.dialogue_idx ?? 0;

  // 최소값을 1로 보장 (auto increment는 1부터 시작)
  const initialSeq = Math.max(currentMax, 1);

  await Counter.findByIdAndUpdate(
    "dialogue_idx",
    { $max: { seq: initialSeq } },
    { upsert: true, new: true }
  ).exec();
}

