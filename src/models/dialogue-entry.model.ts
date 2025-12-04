import mongoose, { Model, Schema } from "mongoose";
import { IDialogueEntry } from "../types";
import { Counter } from "../models";

const DialogueEntrySchema = new Schema<IDialogueEntry>(
  {
    entry_idx: { type: Number, unique: true, sparse: true },
    dialogue_idx: { type: Number, required: true },
    sender_dialogue_user_idx: {
      type: Number,
      required: true,
    },
    user_type: { type: String, enum: ["self", "opponent"], required: true },
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
          const contentType = (this as any).content_type;
          
          // text 타입: string이어야 함
          if (contentType === "text") {
            return typeof value === "string" && value.trim().length > 0;
          }
          
          // cardnews 타입: CardNews 구조 검증
          if (contentType === "cardnews") {
            if (!value || typeof value !== "object") return false;
            // 최소 필수 필드: card_news_idx 또는 card_news_name
            return (
              typeof value.card_news_idx === "number" ||
              (typeof value.card_news_name === "string" && value.card_news_name.trim().length > 0)
            );
          }
          
          // quiz 타입: Quiz 구조 검증
          if (contentType === "quiz") {
            if (!value || typeof value !== "object") return false;
            // 최소 필수 필드: quiz_idx 또는 quiz_name
            return (
              typeof value.quiz_idx === "number" ||
              (typeof value.quiz_name === "string" && value.quiz_name.trim().length > 0)
            );
          }
          
          return false;
        },
        message: function (props: any) {
          const contentType = (props as any).content_type;
          if (contentType === "text") {
            return "content_type이 'text'일 때 content는 비어있지 않은 문자열이어야 합니다.";
          }
          if (contentType === "cardnews") {
            return "content_type이 'cardnews'일 때 content는 card_news_idx 또는 card_news_name을 포함하는 CardNews 객체여야 합니다.";
          }
          if (contentType === "quiz") {
            return "content_type이 'quiz'일 때 content는 quiz_idx 또는 quiz_name을 포함하는 Quiz 객체여야 합니다.";
          }
          return "content 검증에 실패했습니다.";
        },
      },
    },
    image_urls: { type: [String], default: null },
    video_urls: { type: [String], default: null },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

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
