import { CardNews } from "../models";
import { ICardNews } from "../types";
import { CardNewsEntity } from "../entities";

class CardNewsRepository {
  // 전체 카드뉴스 개수 조회
  async count(): Promise<number> {
    return await CardNews.countDocuments().exec();
  }

  // 모든 카드뉴스 조회 (Pagination 지원)
  async findAll(page: number = 1, limit: number = 10): Promise<ICardNews[]> {
    const skip = (page - 1) * limit;
    return await CardNews.find()
      .sort({ card_news_idx: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
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

  // 조건별 카드뉴스 조회 (옵션)
  async findByStatus(status: boolean): Promise<ICardNews[]> {
    return await CardNews.find({ status }).sort({ card_news_idx: -1 }).exec();
  }

  // 미디어 타입별 카드뉴스 조회
  async findByMediaType(mediaType: string): Promise<ICardNews[]> {
    return await CardNews.find({ media_type: mediaType })
      .sort({ card_news_idx: -1 })
      .exec();
  }
}

export default new CardNewsRepository();
