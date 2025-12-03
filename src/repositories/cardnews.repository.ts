import { CardNews } from "../models";
import { ICardNews } from "../types";
import { CardNewsEntity } from "../entities";

class CardNewsRepository {
  // 전체 카드뉴스 개수 조회 (필터 포함)
  async count(filters?: {
    search?: string;
    media_type?: string;
    ai_generated?: boolean;
    status?: boolean;
  }): Promise<number> {
    const query = this.buildQuery(filters);
    return await CardNews.countDocuments(query).exec();
  }

  // 모든 카드뉴스 조회 (Pagination 및 필터링 지원)
  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
      media_type?: string;
      ai_generated?: boolean;
      status?: boolean;
    }
  ): Promise<ICardNews[]> {
    const skip = (page - 1) * limit;
    const query = this.buildQuery(filters);
    
    return await CardNews.find(query)
      .sort({ card_news_idx: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  // 필터 쿼리 빌드
  private buildQuery(filters?: {
    search?: string;
    media_type?: string;
    ai_generated?: boolean;
    status?: boolean;
  }): any {
    const query: any = {};

    if (filters) {
      // 검색: card_news_name, description에서 검색
      if (filters.search) {
        query.$or = [
          { card_news_name: { $regex: filters.search, $options: "i" } },
          { description: { $regex: filters.search, $options: "i" } },
        ];
      }

      // 미디어 타입 필터
      if (filters.media_type) {
        query.media_type = filters.media_type;
      }

      // 생성 방식 필터 (ai_generated)
      if (filters.ai_generated !== undefined) {
        query.ai_generated = filters.ai_generated;
      }

      // 상태 필터
      if (filters.status !== undefined) {
        query.status = filters.status;
      }
    }

    return query;
  }

  // ID로 카드뉴스 조회
  async findById(cardNewsIdx: number): Promise<ICardNews | null> {
    return await CardNews.findOne({ card_news_idx: cardNewsIdx }).exec();
  }

  // 카드뉴스 생성 (Entity 받아서 처리)
  async create(entity: CardNewsEntity): Promise<ICardNews> {
    const cardNews = new CardNews(entity.toPlainObject());
    return await cardNews.save();
  }

  // 카드뉴스 업데이트 (Entity 받아서 처리)
  async update(
    cardNewsIdx: number,
    entity: Partial<CardNewsEntity>
  ): Promise<ICardNews | null> {
    const updateData = entity instanceof CardNewsEntity 
      ? entity.toPlainObject() 
      : entity;
    
    return await CardNews.findOneAndUpdate(
      { card_news_idx: cardNewsIdx },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  // 카드뉴스 삭제
  async delete(cardNewsIdx: number): Promise<boolean> {
    const result = await CardNews.findOneAndDelete({
      card_news_idx: cardNewsIdx,
    }).exec();
    return !!result;
  }

}

export default new CardNewsRepository();
