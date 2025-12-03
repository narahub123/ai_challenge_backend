import { CardNewsMediaType } from "../../types";

/**
 * 카드뉴스 생성 요청 DTO
 */
export class CreateCardNewsDto {
  card_news_name: string;
  description?: string | null;
  thumbnail_url?: string[] | null;
  card_data?: any | null;
  total_cards?: number;
  ai_generated?: boolean;
  status?: boolean;
  video_urls?: string[] | null;
  media_type?: CardNewsMediaType;

  constructor(data: Partial<CreateCardNewsDto>) {
    this.card_news_name = data.card_news_name || "";
    this.description = data.description ?? null;
    this.thumbnail_url = data.thumbnail_url ?? null;
    this.card_data = data.card_data ?? null;
    this.total_cards = data.total_cards ?? 1;
    this.ai_generated = data.ai_generated !== undefined ? Boolean(data.ai_generated) : false;
    this.status = data.status !== undefined ? Boolean(data.status) : true;
    this.video_urls = data.video_urls ?? null;
    this.media_type = data.media_type || "card";
  }
}

/**
 * 카드뉴스 업데이트 요청 DTO
 * 모든 필드가 선택적 (Partial Update)
 */
export class UpdateCardNewsDto {
  card_news_name?: string;
  description?: string | null;
  thumbnail_url?: string[] | null;
  card_data?: any | null;
  total_cards?: number;
  ai_generated?: boolean;
  status?: boolean;
  video_urls?: string[] | null;
  media_type?: CardNewsMediaType;

  constructor(data: Partial<UpdateCardNewsDto>) {
    if (data.card_news_name !== undefined) {
      this.card_news_name = data.card_news_name;
    }
    if (data.description !== undefined) {
      this.description = data.description;
    }
    if (data.thumbnail_url !== undefined) {
      this.thumbnail_url = data.thumbnail_url;
    }
    if (data.card_data !== undefined) {
      this.card_data = data.card_data;
    }
    if (data.total_cards !== undefined) {
      this.total_cards = data.total_cards;
    }
    if (data.ai_generated !== undefined) {
      this.ai_generated = Boolean(data.ai_generated);
    }
    if (data.status !== undefined) {
      this.status = Boolean(data.status);
    }
    if (data.video_urls !== undefined) {
      this.video_urls = data.video_urls;
    }
    if (data.media_type !== undefined) {
      this.media_type = data.media_type;
    }
  }
}

