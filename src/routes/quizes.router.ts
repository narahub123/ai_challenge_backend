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

  // 추가 필터링 라우트
  router.get(
    "/quizes/filter/quiz-type/:quizType",
    quizController.getQuizzesByQuizType
  ); // GET /api/quizes/filter/quiz-type/:quizType - 퀴즈 타입별 조회

  router.get(
    "/quizes/filter/difficulty/:difficulty",
    quizController.getQuizzesByDifficulty
  ); // GET /api/quizes/filter/difficulty/:difficulty - 난이도별 조회

  router.get(
    "/quizes/filter/status",
    quizController.getQuizzesByStatus
  ); // GET /api/quizes/filter/status?status=true - 상태별 조회
};
