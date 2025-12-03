import { Request, Response, NextFunction } from "express";
import quizService from "../services/quiz.service";
import { CreateQuizDto, UpdateQuizDto } from "../dtos/request";
import { catchAsync } from "../middleware";

class QuizController {
  // 모든 퀴즈 조회 (Pagination 및 필터링 지원)
  getAllQuizzes = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // Query 파라미터에서 page, limit 추출
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      // 필터 파라미터 추출
      const filters = {
        search: req.query.search as string | undefined,
        quiz_type: req.query.quiz_type as string | undefined,
        difficulty: req.query.difficulty as string | undefined,
        status:
          req.query.status !== undefined
            ? (req.query.status === "true" ||
              req.query.status === "1" ||
              parseInt(req.query.status as string, 10) === 1)
              ? true
              : false
            : undefined,
      };

      const result = await quizService.getAllQuizzes(page, limit, filters);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    }
  );

  // 퀴즈 상세 조회
  getQuizById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const quizIdx = parseInt(req.params.id, 10);

      if (isNaN(quizIdx)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      const quiz = await quizService.getQuizById(quizIdx);

      res.status(200).json({
        success: true,
        data: quiz,
      });
    }
  );

  // 퀴즈 생성 (File 처리 포함)
  createQuiz = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // multipart/form-data에서 JSON 데이터 파싱
      let bodyData = req.body;

      // multipart/form-data인 경우 (파일 업로드)
      if (req.body.data && typeof req.body.data === "string") {
        try {
          bodyData = JSON.parse(req.body.data);
        } catch (e) {
          bodyData = req.body;
        }
      } else if (Object.keys(req.body).length > 0) {
        // 일반 JSON 요청인 경우 req.body를 그대로 사용
        bodyData = req.body;
      }

      // Request Body → DTO 변환
      const createDto = new CreateQuizDto(bodyData);

      // multer로 받은 파일들
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      } | undefined;

      const quiz = await quizService.createQuiz(createDto, {
        quiz_image_url: files?.quiz_image_url,
        quiz_video_urls: files?.quiz_video_urls,
      });

      res.status(201).json({
        success: true,
        data: quiz,
      });
    }
  );

  // 퀴즈 업데이트 (File 처리 포함)
  updateQuiz = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const quizIdx = parseInt(req.params.id, 10);

      if (isNaN(quizIdx)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      // multipart/form-data에서 JSON 데이터 파싱
      let bodyData = req.body;

      if (req.body.data && typeof req.body.data === "string") {
        try {
          bodyData = JSON.parse(req.body.data);
        } catch (e) {
          bodyData = req.body;
        }
      } else if (Object.keys(req.body).length > 0) {
        bodyData = req.body;
      }

      // Request Body → DTO 변환
      const updateDto = new UpdateQuizDto(bodyData);

      // multer로 받은 파일들
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      } | undefined;

      const quiz = await quizService.updateQuiz(quizIdx, updateDto, {
        quiz_image_url: files?.quiz_image_url,
        quiz_video_urls: files?.quiz_video_urls,
      });

      res.status(200).json({
        success: true,
        data: quiz,
      });
    }
  );

  // 퀴즈 삭제
  deleteQuiz = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const quizIdx = parseInt(req.params.id, 10);

      if (isNaN(quizIdx)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      await quizService.deleteQuiz(quizIdx);

      res.status(200).json({
        success: true,
        data: null,
      });
    }
  );

}

export default new QuizController();
