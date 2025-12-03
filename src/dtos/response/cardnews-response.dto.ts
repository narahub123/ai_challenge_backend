import { CardNewsMediaType, CardData } from "../../types";

/**
 * 카드뉴스 응답 DTO
 * 클라이언트로 반환할 데이터 구조
 */
export class CardNewsResponseDto {
  card_news_idx: number;
  ai_generated: boolean;
  card_data: CardData[] | null;
  card_news_name: string;
  description: string | null;
  media_type: CardNewsMediaType;
  thumbnail_url: string[] | null;
  total_cards: number;
  video_urls: string[] | null;
  created_at: string;
  updated_at: string;
  status: 0 | 1;

  constructor(data: CardNewsResponseDto) {
    this.card_news_idx = data.card_news_idx;
    this.ai_generated = data.ai_generated;
    this.card_data = data.card_data;
    this.card_news_name = data.card_news_name;
    this.description = data.description;
    this.media_type = data.media_type;
    this.thumbnail_url = data.thumbnail_url;
    this.total_cards = data.total_cards;
    this.video_urls = data.video_urls;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.status = data.status;
  }

  /**
   * Entity나 Document를 Response DTO로 변환
   */
  static fromEntity(entity: any): CardNewsResponseDto {
    // Date를 ISO string으로 변환
    const formatDate = (date: Date | undefined | null): string => {
      if (!date) return new Date().toISOString();
      return date instanceof Date ? date.toISOString() : new Date(date).toISOString();
    };

    // boolean을 0 | 1로 변환
    const booleanToNumber = (value: boolean | undefined | null): 0 | 1 => {
      return value ? 1 : 0;
    };

    return new CardNewsResponseDto({
      card_news_idx: entity.card_news_idx || 0,
      ai_generated: Boolean(entity.ai_generated),
      card_data: entity.card_data || null,
      card_news_name: entity.card_news_name || "",
      description: entity.description ?? null,
      media_type: entity.media_type || "card",
      thumbnail_url: entity.thumbnail_url || null,
      total_cards: entity.total_cards || 0,
      video_urls: entity.video_urls || null,
      created_at: formatDate(entity.created_at),
      updated_at: formatDate(entity.updated_at),
      status: booleanToNumber(entity.status),
    });
  }
}
