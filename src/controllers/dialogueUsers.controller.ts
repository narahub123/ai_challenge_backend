import { Request, Response, NextFunction } from "express";
import dialogueUserService from "../services/dialogueUser.service";
import { CreateDialogueUserDto, UpdateDialogueUserDto } from "../dtos/request";
import { catchAsync } from "../middleware";

class DialogueUserController {
  // 모든 사용자 조회 (Pagination 및 필터링 지원)
  getAllUsers = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // Query 파라미터에서 page, limit 추출
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      // 필터 파라미터 추출
      const filters = {
        search: req.query.search as string | undefined,
      };

      const result = await dialogueUserService.getAllUsers(page, limit, filters);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    }
  );

  // 사용자 상세 조회
  getUserById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = parseInt(req.params.userId, 10);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      const user = await dialogueUserService.getUserById(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    }
  );

  // 사용자 생성 (File 처리 포함)
  createUser = catchAsync(
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
      const createDto = new CreateDialogueUserDto(bodyData);

      // multer로 받은 파일들
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      } | undefined;

      const user = await dialogueUserService.createUser(createDto, {
        avatar_url: files?.avatar_url,
      });

      res.status(201).json({
        success: true,
        data: user,
      });
    }
  );

  // 사용자 업데이트 (File 처리 포함)
  updateUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = parseInt(req.params.userId, 10);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

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
      const updateDto = new UpdateDialogueUserDto(bodyData);

      // multer로 받은 파일들
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      } | undefined;

      const user = await dialogueUserService.updateUser(userId, updateDto, {
        avatar_url: files?.avatar_url,
      });

      res.status(200).json({
        success: true,
        data: user,
      });
    }
  );

  // 사용자 삭제
  deleteUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = parseInt(req.params.userId, 10);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      await dialogueUserService.deleteUser(userId);

      res.status(200).json({
        success: true,
        data: null,
      });
    }
  );
}

export default new DialogueUserController();

