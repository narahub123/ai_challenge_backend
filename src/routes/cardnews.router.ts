import { Router } from "express";
import cardNewsController from "../controllers/cardnews.controller";

export default (router: Router) => {
  // 기본 CRUD 라우트
  router
    .route("/cardnews")
    .get(cardNewsController.getAllCardNews) // GET /api/cardnews - 모든 카드뉴스 조회
    .post(cardNewsController.createCardNews); // POST /api/cardnews - 카드뉴스 생성

  router
    .route("/cardnews/:id")
    .get(cardNewsController.getCardNewsById) // GET /api/cardnews/:id - 카드뉴스 상세 조회
    .patch(cardNewsController.updateCardNews) // PATCH /api/cardnews/:id - 카드뉴스 업데이트
    .delete(cardNewsController.deleteCardNews); // DELETE /api/cardnews/:id - 카드뉴스 삭제

  // 추가 필터링 라우트
  router.get(
    "/cardnews/filter/status",
    cardNewsController.getCardNewsByStatus
  ); // GET /api/cardnews/filter/status?status=true - 상태별 조회

  router.get(
    "/cardnews/filter/media-type/:mediaType",
    cardNewsController.getCardNewsByMediaType
  ); // GET /api/cardnews/filter/media-type/:mediaType - 미디어 타입별 조회
};
