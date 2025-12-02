import mongoose, { Model, Schema } from "mongoose";
import { Counter } from "../models";
import { IUserQuizAnswer } from "../types";

const UserQuizAnswerSchema = new Schema<IUserQuizAnswer>(
  {
    answer_idx: { type: Number, unique: true, sparse: true },
    user_idx: { type: Number, required: true },
    quiz_idx: { type: Number, required: true },
    project_idx: { type: Number, required: true },
    answer_type: {
      type: String,
      enum: ["OX", "객관식", "주관식", "밸런스게임"],
      required: true,
    },
    answer: { type: String, required: true },
    project_orderidx: { type: Number, required: true },
    is_correct: { type: Boolean, default: null },
    submitted_at: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

// AUTO_INCREMENT 구현
UserQuizAnswerSchema.pre<IUserQuizAnswer>("save", async function () {
  const doc = this;
  if (doc.isNew && !doc.answer_idx) {
    const counter = await Counter.findByIdAndUpdate(
      "user_quiz_answer_idx",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).exec();

    if (!counter)
      throw new Error("Failed to create counter for user_quiz_answer_idx");
    doc.answer_idx = counter.seq;
  }
});

// 인덱스
UserQuizAnswerSchema.index({ answer_idx: 1 });
UserQuizAnswerSchema.index({ user_idx: 1 });
UserQuizAnswerSchema.index({ quiz_idx: 1 });
UserQuizAnswerSchema.index({ project_idx: 1 });

// 모델 생성
export const UserQuizAnswer: Model<IUserQuizAnswer> =
  (mongoose.models.UserQuizAnswer as Model<IUserQuizAnswer>) ||
  mongoose.model<IUserQuizAnswer>("UserQuizAnswer", UserQuizAnswerSchema);

// 시퀀스 초기화 유틸
export async function initUserQuizAnswerCounter(): Promise<void> {
  const maxDoc = await UserQuizAnswer.findOne()
    .sort({ answer_idx: -1 })
    .select("answer_idx")
    .lean()
    .exec();
  const currentMax = maxDoc?.answer_idx ?? 0;

  await Counter.findByIdAndUpdate(
    "user_quiz_answer_idx",
    { $max: { seq: currentMax } },
    { upsert: true, new: true }
  ).exec();
}
