import { CardNewsMediaType } from "../types";

/**
 * CardNews 도메인 엔티티
 * DB 스키마와 독립적인 순수 도메인 객체
 */
export class CardNewsEntity {
  card_news_idx?: number;
  card_news_name: string;
  description: string | null;
  thumbnail_url: string[] | null;
  card_data: any | null;
  total_cards: number;
  ai_generated: boolean;
  status: boolean;
  video_urls: string[] | null;
  media_type: CardNewsMediaType;
  created_at?: Date;
  updated_at?: Date;

  constructor(data: Partial<CardNewsEntity>) {
    this.card_news_idx = data.card_news_idx;
    this.card_news_name = data.card_news_name || "";
    this.description = data.description ?? null;
    this.thumbnail_url = data.thumbnail_url ?? null;
    this.card_data = data.card_data ?? null;
    this.total_cards = data.total_cards ?? 1;
    this.ai_generated = data.ai_generated ?? false;
    this.status = data.status ?? true;
    this.video_urls = data.video_urls ?? null;
    this.media_type = data.media_type || "card";
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Mongoose Document를 Entity로 변환
   */
  static fromDocument(document: any): CardNewsEntity {
    return new CardNewsEntity({
      card_news_idx: document.card_news_idx,
      card_news_name: document.card_news_name,
      description: document.description,
      thumbnail_url: document.thumbnail_url,
      card_data: document.card_data,
      total_cards: document.total_cards,
      ai_generated: document.ai_generated,
      status: document.status,
      video_urls: document.video_urls,
      media_type: document.media_type,
      created_at: document.created_at,
      updated_at: document.updated_at,
    });
  }

  /**
   * Entity를 일반 객체로 변환
   */
  toPlainObject(): Record<string, any> {
    return {
      card_news_idx: this.card_news_idx,
      card_news_name: this.card_news_name,
      description: this.description,
      thumbnail_url: this.thumbnail_url,
      card_data: this.card_data,
      total_cards: this.total_cards,
      ai_generated: this.ai_generated,
      status: this.status,
      video_urls: this.video_urls,
      media_type: this.media_type,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

