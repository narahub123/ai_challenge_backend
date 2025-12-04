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
          // findOneAndUpdate 시 this가 다를 수 있으므로 여러 방법으로 content_type 찾기
          let contentType = (this as any).content_type;
          
          // 업데이트 시 this.getUpdate()를 통해 접근 시도
          if (!contentType && (this as any).getUpdate) {
            try {
              const update = (this as any).getUpdate();
              if (update && update.$set) {
                contentType = update.$set.content_type;
              } else if (update) {
                contentType = update.content_type;
              }
            } catch (e) {
              // getUpdate()가 사용 불가능한 경우 무시
            }
          }
          
          // this.get()을 통해 접근 시도
          if (!contentType && (this as any).get) {
            try {
              contentType = (this as any).get("content_type");
            } catch (e) {
              // get()이 사용 불가능한 경우 무시
            }
          }
          
          // 여전히 content_type을 찾을 수 없으면 true 반환 (pre-update hook에서 처리)
          if (!contentType) {
            return true;
          }
          
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

// findOneAndUpdate 시 content 검증을 위한 pre-update hook
DialogueEntrySchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate() as any;
  if (!update) return;

  // $set이 없으면 생성
  if (!update.$set) {
    update.$set = {};
  }

  const content = update.$set.content;
  const contentType = update.$set.content_type;

  // content가 업데이트되는데 content_type이 없으면 기존 문서에서 가져오기
  if (content !== undefined && !contentType) {
    const doc = await this.model.findOne(this.getQuery());
    if (doc) {
      update.$set.content_type = doc.content_type;
    }
  }
  
  // content_type이 업데이트되는데 content가 없으면 기존 문서에서 가져오기 (validator를 위해)
  if (contentType !== undefined && content === undefined) {
    const doc = await this.model.findOne(this.getQuery());
    if (doc) {
      update.$set.content = doc.content;
    }
  }
});

// 인덱스
DialogueEntrySchema.index({ entry_idx: 1 });
DialogueEntrySchema.index({ dialogue_idx: 1, created_at: -1 });

export const DialogueEntry: Model<IDialogueEntry> =
  (mongoose.models.DialogueEntry as Model<IDialogueEntry>) ||
  mongoose.model<IDialogueEntry>("DialogueEntry", DialogueEntrySchema);
