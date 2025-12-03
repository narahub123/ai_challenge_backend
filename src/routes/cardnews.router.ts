import { Router } from "express";
import cardNewsController from "../controllers/cardnews.controller";
import { uploadCardNewsFiles } from "../middleware/upload.middleware";

export default (router: Router) => {
  // 기본 CRUD 라우트
  router
    .route("/cardnews")
    .get(cardNewsController.getAllCardNews) // GET /api/cardnews - 모든 카드뉴스 조회
    .post(
      uploadCardNewsFiles,
      cardNewsController.createCardNews
    ); // POST /api/cardnews - 카드뉴스 생성 (파일 업로드 지원)

  router
    .route("/cardnews/:id")
    .get(cardNewsController.getCardNewsById) // GET /api/cardnews/:id - 카드뉴스 상세 조회
    .patch(
      uploadCardNewsFiles,
      cardNewsController.updateCardNews
    ) // PATCH /api/cardnews/:id - 카드뉴스 업데이트 (파일 업로드 지원)
    .delete(cardNewsController.deleteCardNews); // DELETE /api/cardnews/:id - 카드뉴스 삭제
};
