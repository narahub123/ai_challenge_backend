import { Router } from "express";
import quizController from "../controllers/quizes.controller";
import { uploadQuizFiles } from "../middleware/upload.middleware";

export default (router: Router) => {
  // 기본 CRUD 라우트
  router
    .route("/quizes")
    .get(quizController.getAllQuizzes) // GET /api/quizes - 모든 퀴즈 조회 (Pagination)
    .post(
      uploadQuizFiles,
      quizController.createQuiz
    ); // POST /api/quizes - 퀴즈 생성 (파일 업로드 지원)

  router
    .route("/quizes/:id")
    .get(quizController.getQuizById) // GET /api/quizes/:id - 퀴즈 상세 조회
    .patch(
      uploadQuizFiles,
      quizController.updateQuiz
    ) // PATCH /api/quizes/:id - 퀴즈 업데이트 (파일 업로드 지원)
    .delete(quizController.deleteQuiz); // DELETE /api/quizes/:id - 퀴즈 삭제
};
