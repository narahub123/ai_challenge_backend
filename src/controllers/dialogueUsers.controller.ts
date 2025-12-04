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

  // 사용자 생성
  createUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // Request Body → DTO 변환
      const createDto = new CreateDialogueUserDto(req.body);

      const user = await dialogueUserService.createUser(createDto);

      res.status(201).json({
        success: true,
        data: user,
      });
    }
  );

  // 사용자 업데이트
  updateUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const dialogueUserId = parseInt(req.params.userId, 10);

      if (isNaN(dialogueUserId)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      // Request Body → DTO 변환
      const updateDto = new UpdateDialogueUserDto(req.body);

      const user = await dialogueUserService.updateUser(
        dialogueUserId,
        updateDto
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
