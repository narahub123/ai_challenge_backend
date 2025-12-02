import mongoose, { Model, Schema } from "mongoose";
import { IProject } from "../types";
import { Counter } from "../models";

// Project 스키마
const ProjectSchema = new Schema<IProject>(
  {
    project_idx: { type: Number, unique: true, sparse: true },
    project_name: { type: String, required: true, trim: true },
    project_code: { type: String, unique: true, default: null },
    description: { type: String, default: null },
    grade: { type: String, default: null },
    subject: { type: String, default: null },
    lesson_count: { type: String, default: null },
    target_students: { type: String, default: null },
    objective: { type: String, default: null },
    method: { type: String, default: null },
    session_names: { type: [String], default: null },
    max_session: { type: Number, default: 1 },
    gamebg_images: { type: [String], default: null },
    game_coordinates: { type: [Schema.Types.Mixed], default: null },
    game_types: { type: [String], default: null },
    status: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// AUTO_INCREMENT 구현: 새 문서 저장 전 project_idx 증가
ProjectSchema.pre<IProject>("save", async function () {
  const doc = this;
  if (
    doc.isNew &&
    (doc.project_idx === undefined || doc.project_idx === null)
  ) {
    const counter = await Counter.findByIdAndUpdate(
      "project_idx",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).exec();

    if (!counter) throw new Error("Failed to create counter for project_idx");
    doc.project_idx = counter.seq;
  }
});

// 인덱스
ProjectSchema.index({ project_idx: 1 });
ProjectSchema.index({ project_code: 1 });

// 모델 생성
export const Project: Model<IProject> =
  (mongoose.models.Project as Model<IProject>) ||
  mongoose.model<IProject>("Project", ProjectSchema);

// 시퀀스 초기화 유틸 (기존 데이터가 있는 경우)
export async function initProjectCounter(): Promise<void> {
  const maxDoc = await Project.findOne()
    .sort({ project_idx: -1 })
    .select("project_idx")
    .lean()
    .exec();
  const currentMax = maxDoc?.project_idx ?? 0;

  await Counter.findByIdAndUpdate(
    "project_idx",
    { $max: { seq: currentMax } },
    { upsert: true, new: true }
  ).exec();
}
