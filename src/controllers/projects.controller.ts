import { Request, Response, NextFunction } from "express";
import projectService from "../services/project.service";
import { CreateProjectDto, UpdateProjectDto } from "../dtos/request";
import { catchAsync } from "../middleware";

class ProjectController {
  // 모든 프로젝트 조회 (Pagination 및 필터링 지원)
  getAllProjects = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // Query 파라미터에서 page, limit 추출
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      // 필터 파라미터 추출
      const filters = {
        search: req.query.search as string | undefined,
        grade: req.query.grade as string | undefined,
        subject: req.query.subject as string | undefined,
        status:
          req.query.status !== undefined
            ? (req.query.status === "true" ||
              req.query.status === "1" ||
              parseInt(req.query.status as string, 10) === 1)
              ? true
              : false
            : undefined,
      };

      const result = await projectService.getAllProjects(page, limit, filters);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    }
  );

  // 프로젝트 상세 조회
  getProjectById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const projectIdx = parseInt(req.params.id, 10);

      if (isNaN(projectIdx)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      const project = await projectService.getProjectById(projectIdx);

      res.status(200).json({
        success: true,
        data: project,
      });
    }
  );

  // 프로젝트 생성 (File 처리 포함)
  createProject = catchAsync(
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
      const createDto = new CreateProjectDto(bodyData);

      // multer로 받은 파일들
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      } | undefined;

      const project = await projectService.createProject(createDto, {
        gamebg_images: files?.gamebg_images,
      });

      res.status(201).json({
        success: true,
        data: project,
      });
    }
  );

  // 프로젝트 업데이트 (File 처리 포함)
  updateProject = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const projectIdx = parseInt(req.params.id, 10);

      if (isNaN(projectIdx)) {
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
      const updateDto = new UpdateProjectDto(bodyData);

      // multer로 받은 파일들
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      } | undefined;

      const project = await projectService.updateProject(projectIdx, updateDto, {
        gamebg_images: files?.gamebg_images,
      });

      res.status(200).json({
        success: true,
        data: project,
      });
    }
  );

  // 프로젝트 삭제
  deleteProject = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const projectIdx = parseInt(req.params.id, 10);

      if (isNaN(projectIdx)) {
        return res.status(400).json({
          success: false,
          data: null,
        });
      }

      await projectService.deleteProject(projectIdx);

      res.status(200).json({
        success: true,
        data: null,
      });
    }
  );
}

export default new ProjectController();
