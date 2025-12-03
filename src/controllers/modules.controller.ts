import { Request, Response, NextFunction } from "express";
import moduleService from "../services/module.service";
import { CreateModuleDto, UpdateModuleDto } from "../dtos/request";
import { catchAsync } from "../middleware";

class ModuleController {
  // 모든 모듈 조회 (Pagination 및 필터링 지원)
  getAllModules = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // Query 파라미터에서 page, limit 추출
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      // 필터 파라미터 추출
      const filters = {
        search: req.query.search as string | undefined,
        format_type: req.query.format_type as string | undefined,
        status:
          req.query.status !== undefined
            ? (req.query.status === "true" ||
              req.query.status === "1" ||
              parseInt(req.query.status as string, 10) === 1)
              ? true
              : false
            : undefined,
      };

      const result = await moduleService.getAllModules(page, limit, filters);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    }
  );

  // 모듈 상세 조회
  getModuleById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const moduleIdx = parseInt(req.params.id, 10);

      if (isNaN(moduleIdx)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      const module = await moduleService.getModuleById(moduleIdx);

      res.status(200).json({
        success: true,
        data: module,
      });
    }
  );

  // 모듈 생성
  createModule = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // Request Body → DTO 변환
      const createDto = new CreateModuleDto(req.body);

      const module = await moduleService.createModule(createDto);

      res.status(201).json({
        success: true,
        data: module,
      });
    }
  );

  // 모듈 업데이트
  updateModule = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const moduleIdx = parseInt(req.params.id, 10);

      if (isNaN(moduleIdx)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      // Request Body → DTO 변환
      const updateDto = new UpdateModuleDto(req.body);

      const module = await moduleService.updateModule(moduleIdx, updateDto);

      res.status(200).json({
        success: true,
        data: module,
      });
    }
  );

  // 모듈 삭제
  deleteModule = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const moduleIdx = parseInt(req.params.id, 10);

      if (isNaN(moduleIdx)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      await moduleService.deleteModule(moduleIdx);

      res.status(200).json({
        success: true,
        data: null,
      });
    }
  );
}

export default new ModuleController();
