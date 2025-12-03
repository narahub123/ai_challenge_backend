import { CardNewsMediaType } from "../../types";

/**
 * 카드뉴스 응답 DTO
 * 클라이언트로 반환할 데이터 구조
 */
export class CardNewsResponseDto {
  card_news_idx: number;
  card_news_name: string;
  description: string | null;
  thumbnail_url: string[] | null;
  card_data: any | null;
  total_cards: number;
  ai_generated: boolean;
  status: boolean;
  video_urls: string[] | null;
  media_type: CardNewsMediaType;
  created_at: Date;
  updated_at: Date;

  constructor(data: CardNewsResponseDto) {
    this.card_news_idx = data.card_news_idx;
    this.card_news_name = data.card_news_name;
    this.description = data.description;
    this.thumbnail_url = data.thumbnail_url;
    this.card_data = data.card_data;
    this.total_cards = data.total_cards;
    this.ai_generated = data.ai_generated;
    this.status = data.status;
    this.video_urls = data.video_urls;
    this.media_type = data.media_type;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Entity나 Document를 Response DTO로 변환
   */
  static fromEntity(entity: any): CardNewsResponseDto {
    return new CardNewsResponseDto({
      card_news_idx: entity.card_news_idx,
      card_news_name: entity.card_news_name,
      description: entity.description,
      thumbnail_url: entity.thumbnail_url,
      card_data: entity.card_data,
      total_cards: entity.total_cards,
      ai_generated: entity.ai_generated,
      status: entity.status,
      video_urls: entity.video_urls,
      media_type: entity.media_type,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }
}
