import projectRepository from "../repositories/project.repository";
import { ProjectEntity } from "../entities";
import { CreateProjectDto, UpdateProjectDto } from "../dtos/request";
import { ProjectResponseDto, PaginationDto } from "../dtos/response";
import { AppError } from "../middleware";
import { uploadFiles } from "../utils/fileUpload.util";

interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationDto;
}

class ProjectService {
  // 모든 프로젝트 조회 (Pagination 및 필터링 지원)
  async getAllProjects(
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
      grade?: string;
      subject?: string;
      status?: boolean | 0 | 1;
    }
  ): Promise<PaginatedResponse<ProjectResponseDto>> {
    // 페이지와 limit 유효성 검증
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit)); // 최대 100개로 제한

    // 필터 정규화 (0/1을 boolean으로 변환)
    const normalizedFilters = filters
      ? {
          search: filters.search,
          grade: filters.grade,
          subject: filters.subject,
          status:
            filters.status !== undefined ? Boolean(filters.status) : undefined,
        }
      : undefined;

    // 전체 개수와 데이터 조회
    const [total, documents] = await Promise.all([
      projectRepository.count(normalizedFilters),
      projectRepository.findAll(validPage, validLimit, normalizedFilters),
    ]);

    const data = documents.map((doc) => ProjectResponseDto.fromEntity(doc));
    const pagination = new PaginationDto(total, validPage, validLimit);

    return {
      data,
      pagination,
    };
  }

  // 프로젝트 상세 조회
  async getProjectById(projectIdx: number): Promise<ProjectResponseDto> {
    const document = await projectRepository.findById(projectIdx);

    if (!document) {
      throw new AppError("프로젝트를 찾을 수 없습니다.", 404);
    }

    return ProjectResponseDto.fromEntity(document);
  }

  // 프로젝트 생성 (File 처리 포함)
  async createProject(
    dto: CreateProjectDto,
    files?: {
      gamebg_images?: Express.Multer.File[];
    }
  ): Promise<ProjectResponseDto> {
    // 필수 필드 검증
    if (!dto.project_name) {
      throw new AppError("프로젝트 이름은 필수입니다.", 400);
    }

    // File 처리: gamebg_images
    if (files?.gamebg_images && files.gamebg_images.length > 0) {
      // multer로 받은 File 배열을 업로드하여 URL 배열로 변환
      const imageUrls = await uploadFiles(files.gamebg_images);
      dto.gamebg_images = imageUrls;
    } else if (dto.gamebg_images && Array.isArray(dto.gamebg_images)) {
      // string 배열인 경우 그대로 사용
      dto.gamebg_images = dto.gamebg_images as string[];
    } else {
      dto.gamebg_images = null;
    }

    // DTO → Entity 변환 (status를 boolean으로 명시적 변환)
    const entityData = {
      ...dto,
      status: dto.status !== undefined ? Boolean(dto.status) : true,
    };
    const entity = new ProjectEntity(entityData);

    // Repository에 Entity 전달하여 생성
    const document = await projectRepository.create(entity);

    // Document → Response DTO 변환
    return ProjectResponseDto.fromEntity(document);
  }

  // 프로젝트 업데이트 (File 처리 포함)
  async updateProject(
    projectIdx: number,
    dto: UpdateProjectDto,
    files?: {
      gamebg_images?: Express.Multer.File[];
    }
  ): Promise<ProjectResponseDto> {
    // 존재 여부 확인
    const existingProject = await projectRepository.findById(projectIdx);
    if (!existingProject) {
      throw new AppError("프로젝트를 찾을 수 없습니다.", 404);
    }

    // File 처리: gamebg_images
    if (files?.gamebg_images && files.gamebg_images.length > 0) {
      // multer로 받은 File 배열을 업로드하여 URL 배열로 변환
      const imageUrls = await uploadFiles(files.gamebg_images);
      
      // 기존 gamebg_images가 있으면 합치고, 없으면 새로 설정
      if (dto.gamebg_images && Array.isArray(dto.gamebg_images)) {
        // 기존 URL들과 새로운 파일 URL들을 합침
        const existingUrls = dto.gamebg_images.filter(
          (url) => typeof url === "string"
        ) as string[];
        dto.gamebg_images = [...existingUrls, ...imageUrls];
      } else {
        dto.gamebg_images = imageUrls;
      }
    } else if (dto.gamebg_images && Array.isArray(dto.gamebg_images)) {
      // string 배열인 경우 그대로 사용
      dto.gamebg_images = dto.gamebg_images as string[];
    }

    // DTO → Partial Entity 변환 (status를 boolean으로 명시적 변환)
    const updateData = {
      ...dto,
      status: dto.status !== undefined ? Boolean(dto.status) : undefined,
    };

    // Repository에 전달하여 업데이트
    const updatedDocument = await projectRepository.update(projectIdx, updateData);

    if (!updatedDocument) {
      throw new AppError("프로젝트 업데이트에 실패했습니다.", 500);
    }

    // Document → Response DTO 변환
    return ProjectResponseDto.fromEntity(updatedDocument);
  }

  // 프로젝트 삭제
  async deleteProject(projectIdx: number): Promise<void> {
    const existingProject = await projectRepository.findById(projectIdx);
    if (!existingProject) {
      throw new AppError("프로젝트를 찾을 수 없습니다.", 404);
    }

    const deleted = await projectRepository.delete(projectIdx);
    if (!deleted) {
      throw new AppError("프로젝트 삭제에 실패했습니다.", 500);
    }
  }
}

export default new ProjectService();
