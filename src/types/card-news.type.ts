import { Document } from "mongoose";

export type CardNewsMediaType =
  | "card"
  | "video"
  | "mixed"
  | "thumbnail"
  | "mission_intro";

export interface ICardNews extends Document {
  card_news_idx?: number;
  card_news_name: string;
  description: string | null;
  thumbnail_url: string[] | null; // JSON 배열 → 문자열 배열
  card_data: any | null; // 카드 콘텐츠 JSON, 자유형 구조
  total_cards: number;
  ai_generated: boolean;
  status: boolean;
  video_urls: string[] | null; // JSON 배열 → 문자열 배열
  media_type: CardNewsMediaType;
  created_at: Date;
  updated_at: Date;
}
