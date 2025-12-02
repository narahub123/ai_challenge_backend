import mongoose, { Model, Schema } from "mongoose";
import { IModule } from "../types";
import { Counter } from "../models";

// Module 스키마
const ModuleSchema = new Schema<IModule>(
  {
    module_idx: { type: Number, unique: true, sparse: true },
    module_name: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    format_type: {
      type: String,
      enum: [
        "chatbot",
        "quiz",
        "card_news",
        "survey",
        "learning_questions",
        "workflow",
        "game",
      ],
      required: true,
    },
    format_ref_id: { type: Number, required: true },
    module_order: { type: Number, default: 0 },
    game_type: { type: String, default: null },
    status: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// AUTO_INCREMENT 구현: 새 문서 저장 전 module_idx 증가
ModuleSchema.pre<IModule>("save", async function () {
  const doc = this;
  if (doc.isNew && (doc.module_idx === undefined || doc.module_idx === null)) {
    const counter = await Counter.findByIdAndUpdate(
      "module_idx",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).exec();

    if (!counter) throw new Error("Failed to create counter for module_idx");
    doc.module_idx = counter.seq;
  }
});

// 인덱스
ModuleSchema.index({ module_idx: 1 });
ModuleSchema.index({ module_order: 1 });
ModuleSchema.index({ format_ref_id: 1 });

// 모델 생성
export const Module: Model<IModule> =
  (mongoose.models.Module as Model<IModule>) ||
  mongoose.model<IModule>("Module", ModuleSchema);

// 시퀀스 초기화 유틸 (기존 데이터가 있는 경우)
export async function initModuleCounter(): Promise<void> {
  const maxDoc = await Module.findOne()
    .sort({ module_idx: -1 })
    .select("module_idx")
    .lean()
    .exec();
  const currentMax = maxDoc?.module_idx ?? 0;

  await Counter.findByIdAndUpdate(
    "module_idx",
    { $max: { seq: currentMax } },
    { upsert: true, new: true }
  ).exec();
}
