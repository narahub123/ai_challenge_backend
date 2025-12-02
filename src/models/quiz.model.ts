import mongoose, { Model, Schema } from "mongoose";
import { ICounter, IQuiz } from "../types";

const CounterSchema = new Schema<ICounter>(
  { _id: { type: String, required: true }, seq: { type: Number, default: 0 } },
  { versionKey: false }
);

const Counter: Model<ICounter> =
  (mongoose.models.Counter as Model<ICounter>) ||
  mongoose.model<ICounter>("Counter", CounterSchema);

// Quiz 스키마
const QuizSchema = new Schema<IQuiz>(
  {
    quiz_idx: { type: Number, unique: true, sparse: true },
    quiz_name: { type: String, required: true, trim: true },
    quiz_type: {
      type: String,
      enum: ["OX", "객관식", "주관식", "밸런스게임"],
      required: true,
    },
    question: { type: String, required: true },
    objective_answer: { type: Number, default: null },
    subjective_answer: { type: String, default: null },
    explanation: { type: String, default: null },
    difficulty: {
      type: String,
      enum: ["초급", "중급", "고급"],
      default: "중급",
    },
    status: { type: Boolean, default: true },
    quiz_image_url: { type: String, default: null },
    quiz_video_urls: { type: [String], default: null },
    quiz_order: { type: Number, default: 1 },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// AUTO_INCREMENT 구현: 새 문서 저장 전 quiz_idx 증가
QuizSchema.pre<IQuiz>("save", async function () {
  const doc = this;
  if (doc.isNew && (doc.quiz_idx === undefined || doc.quiz_idx === null)) {
    const counter = await Counter.findByIdAndUpdate(
      "quiz_idx",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).exec();

    if (!counter) throw new Error("Failed to create counter for quiz_idx");
    doc.quiz_idx = counter.seq;
  }
});

// 인덱스
QuizSchema.index({ quiz_order: 1 });
QuizSchema.index({ quiz_idx: 1 });

// 모델 생성
export const Quiz: Model<IQuiz> =
  (mongoose.models.Quiz as Model<IQuiz>) ||
  mongoose.model<IQuiz>("Quiz", QuizSchema);
