import cardNewsRepository from "../repositories/cardnews.repository";
import { CardNewsEntity } from "../entities";
import { CreateCardNewsDto, UpdateCardNewsDto } from "../dtos/request";
import { CardNewsResponseDto, PaginationDto } from "../dtos/response";
import { AppError } from "../middleware";
import { uploadFile } from "../utils/fileUpload.util";
import { CardData } from "../types";

interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationDto;
}

class CardNewsService {
  // 모든 카드뉴스 조회 (Pagination 및 필터링 지원)
  async getAllCardNews(
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
      media_type?: string;
      ai_generated?: boolean | 0 | 1;
      status?: boolean | 0 | 1;
    }
  ): Promise<PaginatedResponse<CardNewsResponseDto>> {
    // 페이지와 limit 유효성 검증
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit)); // 최대 100개로 제한

    // 필터 정규화 (0/1을 boolean으로 변환)
    const normalizedFilters = filters
      ? {
          search: filters.search,
          media_type: filters.media_type,
          ai_generated:
            filters.ai_generated !== undefined
              ? Boolean(filters.ai_generated)
              : undefined,
          status:
            filters.status !== undefined ? Boolean(filters.status) : undefined,
        }
      : undefined;

    // 전체 개수와 데이터 조회
    const [total, documents] = await Promise.all([
      cardNewsRepository.count(normalizedFilters),
      cardNewsRepository.findAll(validPage, validLimit, normalizedFilters),
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

  // 카드뉴스 생성 (File 처리 포함)
  async createCardNews(
    dto: CreateCardNewsDto,
    files?: {
      thumbnail_url?: Express.Multer.File[];
      video_urls?: Express.Multer.File[];
    }
  ): Promise<CardNewsResponseDto> {
    // 필수 필드 검증
    if (!dto.card_news_name) {
      throw new AppError("카드뉴스 이름은 필수입니다.", 400);
    }

    if (dto.total_cards === undefined || dto.total_cards < 1) {
      throw new AppError("총 카드 수는 1 이상이어야 합니다.", 400);
    }

    // File 처리: thumbnail_url
    if (files?.thumbnail_url && files.thumbnail_url.length > 0) {
      // multer로 받은 File 배열을 업로드하여 URL 배열로 변환
      const thumbnailUrls = await Promise.all(
        files.thumbnail_url.map(async (file) => {
          return await uploadFile(file);
        })
      );
      dto.thumbnail_url = thumbnailUrls;
    } else if (dto.thumbnail_url && Array.isArray(dto.thumbnail_url)) {
      // string 배열인 경우 그대로 사용
      dto.thumbnail_url = dto.thumbnail_url as string[];
    }

    // File 처리: video_urls
    if (files?.video_urls && files.video_urls.length > 0) {
      // multer로 받은 File 배열을 업로드하여 URL 배열로 변환
      const videoUrls = await Promise.all(
        files.video_urls.map(async (file) => {
          return await uploadFile(file);
        })
      );
      dto.video_urls = videoUrls;
    } else if (dto.video_urls && Array.isArray(dto.video_urls)) {
      // string 배열인 경우 그대로 사용
      dto.video_urls = dto.video_urls as string[];
    }

    // File 처리: card_data의 image_urls
    if (dto.card_data && Array.isArray(dto.card_data)) {
      // card_data는 JSON으로 전송되므로, 내부 image_urls는 string[]로 처리
      // 실제 File 업로드는 별도 필드로 받아야 하므로 여기서는 string만 처리
      for (const card of dto.card_data) {
        if (card.image_urls && Array.isArray(card.image_urls)) {
          // string 배열만 처리 (File은 프론트엔드에서 URL로 변환 후 전송)
          card.image_urls = card.image_urls.filter(
            (url) => typeof url === "string"
          ) as string[];
        }
      }
    }

    // DTO → Entity 변환
    const entity = new CardNewsEntity(dto);

    // Repository에 Entity 전달하여 생성
    const document = await cardNewsRepository.create(entity);

    // Document → Response DTO 변환
    return CardNewsResponseDto.fromEntity(document);
  }

  // 카드뉴스 업데이트 (File 처리 포함)
  async updateCardNews(
    cardNewsIdx: number,
    dto: UpdateCardNewsDto,
    files?: {
      thumbnail_url?: Express.Multer.File[];
      video_urls?: Express.Multer.File[];
    }
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

    // File 처리: thumbnail_url
    if (files?.thumbnail_url && files.thumbnail_url.length > 0) {
      // multer로 받은 File 배열을 업로드하여 URL 배열로 변환
      const thumbnailUrls = await Promise.all(
        files.thumbnail_url.map(async (file) => {
          return await uploadFile(file);
        })
      );
      dto.thumbnail_url = thumbnailUrls;
    } else if (dto.thumbnail_url && Array.isArray(dto.thumbnail_url)) {
      dto.thumbnail_url = dto.thumbnail_url as string[];
    }

    // File 처리: video_urls
    if (files?.video_urls && files.video_urls.length > 0) {
      // multer로 받은 File 배열을 업로드하여 URL 배열로 변환
      const videoUrls = await Promise.all(
        files.video_urls.map(async (file) => {
          return await uploadFile(file);
        })
      );
      dto.video_urls = videoUrls;
    } else if (dto.video_urls && Array.isArray(dto.video_urls)) {
      dto.video_urls = dto.video_urls as string[];
    }

    // File 처리: card_data의 image_urls (업데이트 시)
    if (dto.card_data && Array.isArray(dto.card_data)) {
      for (const card of dto.card_data) {
        if (card.image_urls && Array.isArray(card.image_urls)) {
          card.image_urls = card.image_urls.filter(
            (url) => typeof url === "string"
          ) as string[];
        }
      }
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

}

export default new CardNewsService();
