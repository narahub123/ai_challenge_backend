import mongoose, { Model, Schema } from "mongoose";
import { IDialogueUser } from "../types/dialogue-user.type";
import { Counter } from "../models";

// DialogueUser 스키마
const DialogueUserSchema = new Schema<IDialogueUser>(
  {
    dialogue_user_idx: { type: Number, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    avatar_url: { type: String, default: null },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// AUTO_INCREMENT 구현: 새 문서 저장 전 dialogue_user_idx 증가
DialogueUserSchema.pre<IDialogueUser>("save", async function () {
  const doc = this;
  if (
    doc.isNew &&
    (doc.dialogue_user_idx === undefined || doc.dialogue_user_idx === null)
  ) {
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

// 인덱스
DialogueUserSchema.index({ dialogue_user_idx: 1 });
DialogueUserSchema.index({ name: 1 });

// 모델 생성
export const DialogueUser: Model<IDialogueUser> =
  (mongoose.models.DialogueUser as Model<IDialogueUser>) ||
  mongoose.model<IDialogueUser>("DialogueUser", DialogueUserSchema);

// 시퀀스 초기화 유틸 (기존 데이터가 있는 경우)
export async function initDialogueUserCounter(): Promise<void> {
  const maxDoc = await DialogueUser.findOne()
    .sort({ dialogue_user_idx: -1 })
    .select("dialogue_user_idx")
    .lean()
    .exec();
  const currentMax = maxDoc?.dialogue_user_idx ?? 0;

  // 최소값을 1로 보장 (auto increment는 1부터 시작)
  const initialSeq = Math.max(currentMax, 1);

  await Counter.findByIdAndUpdate(
    "dialogue_user_idx",
    { $max: { seq: initialSeq } },
    { upsert: true, new: true }
  ).exec();
}
