import mongoose, { Model, Schema } from "mongoose";
import { IProjectModuleLink } from "../types";

// ProjectModuleLink 스키마
const ProjectModuleLinkSchema = new Schema<IProjectModuleLink>(
  {
    project_idx: { type: Number, required: true },
    module_idx: { type: Number, required: true },
    session_number: { type: Number, required: true },
    module_order: { type: Number, required: true },
  },
  {
    versionKey: false,
    timestamps: false, // 링크 테이블은 타임스탬프 불필요
  }
);

// 복합 유니크 인덱스 (PRIMARY KEY 대체)
ProjectModuleLinkSchema.index(
  { project_idx: 1, module_idx: 1, session_number: 1 },
  { unique: true }
);

// 조회 성능을 위한 인덱스
ProjectModuleLinkSchema.index({ project_idx: 1, session_number: 1 });
ProjectModuleLinkSchema.index({ module_idx: 1 });

// 모델 생성
export const ProjectModuleLink: Model<IProjectModuleLink> =
  (mongoose.models.ProjectModuleLink as Model<IProjectModuleLink>) ||
  mongoose.model<IProjectModuleLink>(
    "ProjectModuleLink",
    ProjectModuleLinkSchema
  );

