import { Request, Response, NextFunction } from "express";
import dialogueUserService from "../services/dialogueUser.service";
import { CreateDialogueUserDto, UpdateDialogueUserDto } from "../dtos/request";
import { catchAsync } from "../middleware";

class DialogueUserController {
  // 모든 사용자 조회
  getAllUsers = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 100;

      const users = await dialogueUserService.getAllUsers(page, limit);

      res.status(200).json({
        success: true,
        data: users,
      });
    }
  );

  // 사용자 상세 조회
  getUserById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const dialogueUserId = parseInt(req.params.userId, 10);

      if (isNaN(dialogueUserId)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      const user = await dialogueUserService.getUserById(dialogueUserId);

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
      const dialogueUserId = parseInt(req.params.userId, 10);

      if (isNaN(dialogueUserId)) {
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
      const updateDto = new UpdateDialogueUserDto(bodyData);

      // multer로 받은 파일들
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      } | undefined;

      const user = await dialogueUserService.updateUser(
        dialogueUserId,
        updateDto,
        {
          avatar_url: files?.avatar_url,
        }
      );

      res.status(200).json({
        success: true,
        data: user,
      });
    }
  );

  // 사용자 삭제
  deleteUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const dialogueUserId = parseInt(req.params.userId, 10);

      if (isNaN(dialogueUserId)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      await dialogueUserService.deleteUser(dialogueUserId);

      res.status(200).json({
        success: true,
        data: null,
      });
    }
  );
}

export default new DialogueUserController();
