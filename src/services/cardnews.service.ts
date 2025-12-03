import cardNewsRepository from "../repositories/cardnews.repository";
import { CardNewsEntity } from "../entities";
import { CreateCardNewsDto, UpdateCardNewsDto } from "../dtos/request";
import { CardNewsResponseDto, PaginationDto } from "../dtos/response";
import { AppError } from "../middleware";

interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationDto;
}

class CardNewsService {
  // 모든 카드뉴스 조회 (Pagination 지원)
  async getAllCardNews(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<CardNewsResponseDto>> {
    // 페이지와 limit 유효성 검증
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit)); // 최대 100개로 제한

    // 전체 개수와 데이터 조회
    const [total, documents] = await Promise.all([
      cardNewsRepository.count(),
      cardNewsRepository.findAll(validPage, validLimit),
    ]);

    const data = documents.map((doc) => CardNewsResponseDto.fromEntity(doc));
    const pagination = new PaginationDto(total, validPage, validLimit);

    return {
      data,
      pagination,
    };
  }

  // 카드뉴스 상세 조회
  async getCardNewsById(cardNewsIdx: number): Promise<CardNewsResponseDto> {
    const document = await cardNewsRepository.findById(cardNewsIdx);

    if (!document) {
      throw new AppError("카드뉴스를 찾을 수 없습니다.", 404);
    }

    return CardNewsResponseDto.fromEntity(document);
  }

  // 카드뉴스 생성
  async createCardNews(dto: CreateCardNewsDto): Promise<CardNewsResponseDto> {
    // 필수 필드 검증
    if (!dto.card_news_name) {
      throw new AppError("카드뉴스 이름은 필수입니다.", 400);
    }

    if (dto.total_cards === undefined || dto.total_cards < 1) {
      throw new AppError("총 카드 수는 1 이상이어야 합니다.", 400);
    }

    // DTO → Entity 변환
    const entity = new CardNewsEntity(dto);
    
    // Repository에 Entity 전달하여 생성
    const document = await cardNewsRepository.create(entity);
    
    // Document → Response DTO 변환
    return CardNewsResponseDto.fromEntity(document);
  }

  // 카드뉴스 업데이트
  async updateCardNews(
    cardNewsIdx: number,
    dto: UpdateCardNewsDto
  ): Promise<CardNewsResponseDto> {
    // 존재 여부 확인
    const existingCardNews = await cardNewsRepository.findById(cardNewsIdx);
    if (!existingCardNews) {
      throw new AppError("카드뉴스를 찾을 수 없습니다.", 404);
    }

    // total_cards 검증 (업데이트하는 경우)
    if (dto.total_cards !== undefined && dto.total_cards < 1) {
      throw new AppError("총 카드 수는 1 이상이어야 합니다.", 400);
    }

    // DTO → Partial Entity 변환
    const updateData = new UpdateCardNewsDto(dto);
    
    // Repository에 전달하여 업데이트
    const updatedDocument = await cardNewsRepository.update(
      cardNewsIdx,
      updateData
    );

    if (!updatedDocument) {
      throw new AppError("카드뉴스 업데이트에 실패했습니다.", 500);
    }

    // Document → Response DTO 변환
    return CardNewsResponseDto.fromEntity(updatedDocument);
  }

  // 카드뉴스 삭제
  async deleteCardNews(cardNewsIdx: number): Promise<void> {
    const existingCardNews = await cardNewsRepository.findById(cardNewsIdx);
    if (!existingCardNews) {
      throw new AppError("카드뉴스를 찾을 수 없습니다.", 404);
    }

    const deleted = await cardNewsRepository.delete(cardNewsIdx);
    if (!deleted) {
      throw new AppError("카드뉴스 삭제에 실패했습니다.", 500);
    }
  }

  // 상태별 카드뉴스 조회
  async getCardNewsByStatus(status: boolean): Promise<CardNewsResponseDto[]> {
    const documents = await cardNewsRepository.findByStatus(status);
    return documents.map((doc) => CardNewsResponseDto.fromEntity(doc));
  }

  // 미디어 타입별 카드뉴스 조회
  async getCardNewsByMediaType(mediaType: string): Promise<CardNewsResponseDto[]> {
    const documents = await cardNewsRepository.findByMediaType(mediaType);
    return documents.map((doc) => CardNewsResponseDto.fromEntity(doc));
  }
}

export default new CardNewsService();
