import mongoose, { Model, Schema } from "mongoose";
import { ICardNews } from "../types";
import { Counter } from "../models";

// CardNews 스키마
const CardNewsSchema = new Schema<ICardNews>(
  {
    card_news_idx: { type: Number, unique: true, sparse: true },
    card_news_name: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    thumbnail_url: { type: [String], default: null },
    card_data: { type: Schema.Types.Mixed, default: null }, // 자유형 JSON
    total_cards: { type: Number, required: true, default: 1 },
    ai_generated: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    video_urls: { type: [String], default: null },
    media_type: {
      type: String,
      enum: ["card", "video", "mixed", "thumbnail", "mission_intro"],
      default: "card",
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// AUTO_INCREMENT 구현: 새 문서 저장 전 card_news_idx 증가
CardNewsSchema.pre<ICardNews>("save", async function () {
  const doc = this;
  if (
    doc.isNew &&
    (doc.card_news_idx === undefined || doc.card_news_idx === null)
  ) {
    const counter = await Counter.findByIdAndUpdate(
      "card_news_idx",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).exec();

    if (!counter) throw new Error("Failed to create counter for card_news_idx");
    doc.card_news_idx = counter.seq;
  }
});

// 인덱스
CardNewsSchema.index({ card_news_idx: 1 });
CardNewsSchema.index({ total_cards: 1 });

// 모델 생성
export const CardNews: Model<ICardNews> =
  (mongoose.models.CardNews as Model<ICardNews>) ||
  mongoose.model<ICardNews>("CardNews", CardNewsSchema);

// 시퀀스 초기화 유틸 (기존 데이터가 있는 경우)
export async function initCardNewsCounter(): Promise<void> {
  const maxDoc = await CardNews.findOne()
    .sort({ card_news_idx: -1 })
    .select("card_news_idx")
    .lean()
    .exec();
  const currentMax = maxDoc?.card_news_idx ?? 0;

  await Counter.findByIdAndUpdate(
    "card_news_idx",
    { $max: { seq: currentMax } },
    { upsert: true, new: true }
  ).exec();
}
