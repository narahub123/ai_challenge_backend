import mongoose, { Model, Schema, CallbackError } from "mongoose";
import { IDialogueEntry } from "../types";
import { Counter } from "../models";

// Validator 함수: content_type에 따른 content 구조 검증
const contentValidator = function (value: any) {
  // this context 문제로 인해 상위 레벨에서 처리하거나,
  // 여기서는 value 자체의 구조만 검증합니다.
  // 실제 content_type과의 일치 여부는 pre-save 훅 등에서 추가 검증이 필요할 수 있으나,
  // Mongoose Mixed 타입 특성상 여기서 최대한 검증합니다.

  // 주의: 이 validator는 'content' 필드 자체에 대한 검증입니다.
  // 형제 필드인 'content_type'에 접근하기 어려울 수 있으므로,
  // 스키마 레벨의 validate나 pre hook을 보완적으로 사용해야 합니다.
  return true;
};

const DialogueEntrySchema = new Schema<IDialogueEntry>(
  {
    entry_idx: { type: Number, unique: true, sparse: true },
    dialogue_idx: { type: Number, required: true },

    self_dialogue_user_idx: { type: Number, required: true },
    opponent_dialogue_user_idx: { type: Number, required: true },

    question: {
      content_type: {
        type: String,
        enum: ["text", "cardnews", "quiz"],
        required: true,
      },
      content: {
        type: Schema.Types.Mixed,
        required: true,
        validate: {
          validator: function (value: any) {
            // this는 문서 인스턴스 (생성 시) 또는 쿼리 (업데이트 시)일 수 있음
            // 안전하게 접근하기 위해 parent(question)의 content_type을 확인해야 함.
            // 하지만 Mongoose에서 중첩된 경로의 형제 필드 접근은 까다로움.
            // 따라서 기본적으로 null/undefined 체크만 수행하고,
            // 상세 검증은 pre('save')에서 수행하는 것이 안전함.
            return value !== null && value !== undefined;
          },
          message: "Question content is required",
        },
      },
    },

    answer: {
      content_type: {
        type: String,
        enum: ["text", "cardnews", "quiz"],
        required: false,
      },
      content: {
        type: Schema.Types.Mixed,
        required: false,
      },
    },

    image_urls: { type: [String], default: [] },
    video_urls: { type: [String], default: [] },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// 상세 유효성 검사 (Pre-save Hook)
DialogueEntrySchema.pre("save", async function () {
  const doc = this as IDialogueEntry;

  // 1. Question Validation
  if (doc.question) {
    const { content_type, content } = doc.question;
    if (!validateContent(content_type, content)) {
      throw new Error(`Invalid content structure for question type: ${content_type}`);
    }
  }

  // 2. Answer Validation (if exists)
  if (doc.answer && doc.answer.content_type) {
    const { content_type, content } = doc.answer;
    if (!validateContent(content_type, content)) {
      throw new Error(`Invalid content structure for answer type: ${content_type}`);
    }
  }
});

// Helper: Content Validation Logic
function validateContent(type: string, content: any): boolean {
  if (!content) return false;

  switch (type) {
    case "text":
      return typeof content === "string" && content.trim().length > 0;
    case "cardnews":
      return typeof content === "object" && typeof content.card_news_idx === "number";
    case "quiz":
      // QuizContent (question) or QuizAnswerContent (answer)
      // 공통적으로 quiz_idx는 필수
      return typeof content === "object" && typeof content.quiz_idx === "number";
    default:
      return false;
  }
}

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

    if (!counter) throw new Error("Failed to create counter for entry_idx");
    doc.entry_idx = counter.seq;
  }
});

// 인덱스
DialogueEntrySchema.index({ entry_idx: 1 });
DialogueEntrySchema.index({ dialogue_idx: 1, created_at: -1 });

export const DialogueEntry: Model<IDialogueEntry> =
  (mongoose.models.DialogueEntry as Model<IDialogueEntry>) ||
  mongoose.model<IDialogueEntry>("DialogueEntry", DialogueEntrySchema);
