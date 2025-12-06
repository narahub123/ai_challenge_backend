import { Request, Response, NextFunction } from "express";
import {dialogueService} from "../services";
import { CreateDialogueDto, UpdateDialogueDto } from "../dtos";
import { catchAsync } from "../middleware";

class DialogueController {
  // 모든 대화 조회 (Pagination 및 필터링 지원)
  getAllDialogues = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // Query 파라미터에서 page, limit 추출
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      // 필터 파라미터 추출
      const filters = {
        search: req.query.search as string | undefined,
        status:
          req.query.status !== undefined
            ? (req.query.status === "true" ||
              req.query.status === "1" ||
              parseInt(req.query.status as string, 10) === 1)
              ? true
              : false
            : undefined,
      };

      const result = await dialogueService.getAllDialogues(page, limit, filters);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    }
  );

  // 대화 상세 조회
  getDialogueById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const dialogueIdx = parseInt(req.params.id, 10);

      if (isNaN(dialogueIdx)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      const dialogue = await dialogueService.getDialogueById(dialogueIdx);

      res.status(200).json({
        success: true,
        data: dialogue,
      });
    }
  );

  // 대화 생성
  createDialogue = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // Request Body → DTO 변환
      const createDto = new CreateDialogueDto(req.body);

      // 파일 업로드 처리 (entries 배열의 각 entry에 대한 파일)
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      } | undefined;

      const dialogue = await dialogueService.createDialogue(createDto, files);

      res.status(201).json({
        success: true,
        data: dialogue,
      });
    }
  );

  // 대화 업데이트
  updateDialogue = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const dialogueIdx = parseInt(req.params.id, 10);

      if (isNaN(dialogueIdx)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      // Request Body → DTO 변환
      const updateDto = new UpdateDialogueDto(req.body);

      // 파일 업로드 처리 (entries 배열의 각 entry에 대한 파일)
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      } | undefined;

      const dialogue = await dialogueService.updateDialogue(
        dialogueIdx,
        updateDto,
        files
      );

      res.status(200).json({
        success: true,
        data: dialogue,
      });
    }
  );

  // 대화 삭제
  deleteDialogue = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const dialogueIdx = parseInt(req.params.id, 10);

      if (isNaN(dialogueIdx)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      await dialogueService.deleteDialogue(dialogueIdx);

      res.status(200).json({
        success: true,
        data: null,
      });
    }
  );
}

export default new DialogueController();

