import { Request, Response, NextFunction } from "express";
import cardNewsService from "../services/cardnews.service";
import { CreateCardNewsDto, UpdateCardNewsDto } from "../dtos/request";
import { catchAsync } from "../middleware";

class CardNewsController {
  // 모든 카드뉴스 조회 (Pagination 지원)
  getAllCardNews = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // Query 파라미터에서 page, limit 추출
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const result = await cardNewsService.getAllCardNews(page, limit);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    }
  );

  // 카드뉴스 상세 조회
  getCardNewsById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const cardNewsIdx = parseInt(req.params.id, 10);

      if (isNaN(cardNewsIdx)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      const cardNews = await cardNewsService.getCardNewsById(cardNewsIdx);

      res.status(200).json({
        success: true,
        data: cardNews,
      });
    }
  );

  // 카드뉴스 생성
  createCardNews = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // Request Body → DTO 변환
      const createDto = new CreateCardNewsDto(req.body);
      
      const cardNews = await cardNewsService.createCardNews(createDto);

      res.status(201).json({
        success: true,
        data: cardNews,
      });
    }
  );

  // 카드뉴스 업데이트
  updateCardNews = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const cardNewsIdx = parseInt(req.params.id, 10);

      if (isNaN(cardNewsIdx)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      // Request Body → DTO 변환
      const updateDto = new UpdateCardNewsDto(req.body);

      const cardNews = await cardNewsService.updateCardNews(
        cardNewsIdx,
        updateDto
      );

      res.status(200).json({
        success: true,
        data: cardNews,
      });
    }
  );

  // 카드뉴스 삭제
  deleteCardNews = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const cardNewsIdx = parseInt(req.params.id, 10);

      if (isNaN(cardNewsIdx)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      await cardNewsService.deleteCardNews(cardNewsIdx);

      res.status(200).json({
        success: true,
        data: null,
      });
    }
  );

  // 상태별 카드뉴스 조회
  getCardNewsByStatus = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const status = req.query.status === "true";

      const cardNews = await cardNewsService.getCardNewsByStatus(status);

      res.status(200).json({
        success: true,
        data: cardNews,
      });
    }
  );

  // 미디어 타입별 카드뉴스 조회
  getCardNewsByMediaType = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const mediaType = req.params.mediaType;

      const cardNews = await cardNewsService.getCardNewsByMediaType(mediaType);

      res.status(200).json({
        success: true,
        data: cardNews,
      });
    }
  );
}

export default new CardNewsController();
