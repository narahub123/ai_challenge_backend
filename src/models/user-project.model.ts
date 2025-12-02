import mongoose, { Model, Schema } from "mongoose";
import { Counter } from "../models";
import { IUserProject } from "../types";

// UserProject 스키마
const UserProjectSchema = new Schema<IUserProject>(
  {
    user_project_idx: { type: Number, unique: true, sparse: true },
    user_idx: { type: Number, required: true },
    project_idx: { type: Number, required: true },
    progress_percent: { type: Number, default: 0 },
    session_progress: { type: [Number], default: null },
    session_status: { type: [String], default: null },
    current_session: { type: Number, default: 1 },
    assigned_at: { type: Date, default: Date.now },
    completed_at: { type: Date, default: null },
  },
  { versionKey: false }
);

// AUTO_INCREMENT 구현
UserProjectSchema.pre<IUserProject>("save", async function () {
  const doc = this;
  if (doc.isNew && !doc.user_project_idx) {
    const counter = await Counter.findByIdAndUpdate(
      "user_project_idx",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).exec();

    if (!counter)
      throw new Error("Failed to create counter for user_project_idx");
    doc.user_project_idx = counter.seq;
  }
});

// 인덱스
UserProjectSchema.index({ user_project_idx: 1 });
UserProjectSchema.index({ user_idx: 1 });
UserProjectSchema.index({ project_idx: 1 });

// 모델 생성
export const UserProject: Model<IUserProject> =
  (mongoose.models.UserProject as Model<IUserProject>) ||
  mongoose.model<IUserProject>("UserProject", UserProjectSchema);

// 시퀀스 초기화 유틸
export async function initUserProjectCounter(): Promise<void> {
  const maxDoc = await UserProject.findOne()
    .sort({ user_project_idx: -1 })
    .select("user_project_idx")
    .lean()
    .exec();
  const currentMax = maxDoc?.user_project_idx ?? 0;

  await Counter.findByIdAndUpdate(
    "user_project_idx",
    { $max: { seq: currentMax } },
    { upsert: true, new: true }
  ).exec();
}
