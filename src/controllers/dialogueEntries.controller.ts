import { Request, Response, NextFunction } from "express";
import dialogueEntryService from "../services/dialogueEntry.service";
import {
  CreateDialogueEntryDto,
  UpdateDialogueEntryDto,
} from "../dtos/request";
import { catchAsync } from "../middleware";

class DialogueEntryController {
  // 특정 dialogue의 모든 엔트리 조회
  getEntriesByDialogue = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const dialogueIdx = parseInt(req.params.dialogueId, 10);
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 100;

      if (isNaN(dialogueIdx)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      const entries = await dialogueEntryService.getEntriesByDialogue(
        dialogueIdx,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: entries,
      });
    }
  );

  // 엔트리 상세 조회
  getEntryById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const entryIdx = parseInt(req.params.entryId, 10);

      if (isNaN(entryIdx)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      const entry = await dialogueEntryService.getEntryById(entryIdx);

      res.status(200).json({
        success: true,
        data: entry,
      });
    }
  );

  // 엔트리 생성 (File 처리 포함)
  createEntry = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const dialogueIdx = parseInt(req.params.dialogueId, 10);

      if (isNaN(dialogueIdx)) {
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
      const createDto = new CreateDialogueEntryDto({
        ...bodyData,
        dialogue_idx: dialogueIdx,
      });

      // multer로 받은 파일들
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      } | undefined;

      const entry = await dialogueEntryService.createEntry(createDto, {
        image_urls: files?.image_urls,
        video_urls: files?.video_urls,
      });

      res.status(201).json({
        success: true,
        data: entry,
      });
    }
  );

  // 엔트리 업데이트 (File 처리 포함)
  updateEntry = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const entryIdx = parseInt(req.params.entryId, 10);

      if (isNaN(entryIdx)) {
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
      const updateDto = new UpdateDialogueEntryDto(bodyData);

      // multer로 받은 파일들
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      } | undefined;

      const entry = await dialogueEntryService.updateEntry(entryIdx, updateDto, {
        image_urls: files?.image_urls,
        video_urls: files?.video_urls,
      });

      res.status(200).json({
        success: true,
        data: entry,
      });
    }
  );

  // 엔트리 삭제
  deleteEntry = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const entryIdx = parseInt(req.params.entryId, 10);

      if (isNaN(entryIdx)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      await dialogueEntryService.deleteEntry(entryIdx);

      res.status(200).json({
        success: true,
        data: null,
      });
    }
  );
}

export default new DialogueEntryController();
