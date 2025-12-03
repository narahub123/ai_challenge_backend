import { Document } from "mongoose";

export type CardNewsMediaType =
  | "card"
  | "video"
  | "mixed"
  | "thumbnail"
  | "mission_intro";

/**
 * 카드 데이터 인터페이스
 */
export interface CardData {
  card_number: number;
  title: string;
  content: string;
  image_urls: string[]; // 백엔드에서는 URL 문자열 배열로 저장
}

export interface ICardNews extends Document {
  card_news_idx?: number;
  card_news_name: string;
  description: string | null;
  thumbnail_url: string[] | null; // JSON 배열 → 문자열 배열
  card_data: CardData[] | null; // 카드 데이터 배열
  total_cards: number;
  ai_generated: boolean;
  status: boolean;
  video_urls: string[] | null; // JSON 배열 → 문자열 배열
  media_type: CardNewsMediaType;
  created_at: Date;
  updated_at: Date;
}
