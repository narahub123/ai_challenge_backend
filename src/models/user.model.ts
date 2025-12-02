import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "../types";
import { Counter } from "../models";

// User 스키마
const UserSchema = new Schema<IUser>(
  {
    user_idx: { type: Number, unique: true, sparse: true },
    user_id: { type: String, required: true, unique: true },
    original_user_id: { type: String, default: null },
    uuid: { type: String, required: true, unique: true },
    team: { type: String, default: null },
    nickname: { type: String, default: null },
    school: { type: String, default: null },
    grade: { type: Number, default: null },
    class_number: { type: Number, default: null },
    gender: { type: String, enum: ["남", "여", "기타"], default: null },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// AUTO_INCREMENT 구현
UserSchema.pre<IUser>("save", async function () {
  const doc = this;
  if (doc.isNew && !doc.user_idx) {
    const counter = await Counter.findByIdAndUpdate(
      "user_idx",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).exec();

    if (!counter) throw new Error("Failed to create counter for user_idx");
    doc.user_idx = counter.seq;
  }
});

// 인덱스
UserSchema.index({ user_idx: 1 });
UserSchema.index({ user_id: 1 });
UserSchema.index({ uuid: 1 });

// 모델 생성
export const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

// 시퀀스 초기화 유틸
export async function initUserCounter(): Promise<void> {
  const maxDoc = await User.findOne()
    .sort({ user_idx: -1 })
    .select("user_idx")
    .lean()
    .exec();
  const currentMax = maxDoc?.user_idx ?? 0;

  await Counter.findByIdAndUpdate(
    "user_idx",
    { $max: { seq: currentMax } },
    { upsert: true, new: true }
  ).exec();
}
