import moduleRepository from "../repositories/module.repository";
import { ModuleEntity } from "../entities";
import { CreateModuleDto, UpdateModuleDto } from "../dtos/request";
import { ModuleResponseDto, PaginationDto } from "../dtos/response";
import { AppError } from "../middleware";

interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationDto;
}

class ModuleService {
  // 모든 모듈 조회 (Pagination 및 필터링 지원)
  async getAllModules(
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
      format_type?: string;
      status?: boolean | 0 | 1;
    }
  ): Promise<PaginatedResponse<ModuleResponseDto>> {
    // 페이지와 limit 유효성 검증
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit)); // 최대 100개로 제한

    // 필터 정규화 (0/1을 boolean으로 변환)
    const normalizedFilters = filters
      ? {
          search: filters.search,
          format_type: filters.format_type,
          status:
            filters.status !== undefined ? Boolean(filters.status) : undefined,
        }
      : undefined;

    // 전체 개수와 데이터 조회
    const [total, documents] = await Promise.all([
      moduleRepository.count(normalizedFilters),
      moduleRepository.findAll(validPage, validLimit, normalizedFilters),
    ]);

    const data = documents.map((doc) => ModuleResponseDto.fromEntity(doc));
    const pagination = new PaginationDto(total, validPage, validLimit);

    return {
      data,
      pagination,
    };
  }

  // 모듈 상세 조회
  async getModuleById(moduleIdx: number): Promise<ModuleResponseDto> {
    const document = await moduleRepository.findById(moduleIdx);

    if (!document) {
      throw new AppError("모듈을 찾을 수 없습니다.", 404);
    }

    return ModuleResponseDto.fromEntity(document);
  }

  // 모듈 생성
  async createModule(dto: CreateModuleDto): Promise<ModuleResponseDto> {
    // 필수 필드 검증
    if (!dto.module_name) {
      throw new AppError("모듈 이름은 필수입니다.", 400);
    }

    if (!dto.format_type) {
      throw new AppError("포맷 타입은 필수입니다.", 400);
    }

    if (dto.format_ref_id === undefined || dto.format_ref_id === null) {
      throw new AppError("포맷 참조 ID는 필수입니다.", 400);
    }

    // DTO → Entity 변환 (status를 boolean으로 명시적 변환)
    const entityData = {
      ...dto,
      status: dto.status !== undefined ? Boolean(dto.status) : true,
    };
    const entity = new ModuleEntity(entityData);

    // Repository에 Entity 전달하여 생성
    const document = await moduleRepository.create(entity);

    // Document → Response DTO 변환
    return ModuleResponseDto.fromEntity(document);
  }

  // 모듈 업데이트
  async updateModule(
    moduleIdx: number,
    dto: UpdateModuleDto
  ): Promise<ModuleResponseDto> {
    // 존재 여부 확인
    const existingModule = await moduleRepository.findById(moduleIdx);
    if (!existingModule) {
      throw new AppError("모듈을 찾을 수 없습니다.", 404);
    }

    // DTO → Partial Entity 변환 (status를 boolean으로 명시적 변환)
    const updateData = {
      ...dto,
      status: dto.status !== undefined ? Boolean(dto.status) : undefined,
    };

    // Repository에 전달하여 업데이트
    const updatedDocument = await moduleRepository.update(moduleIdx, updateData);

    if (!updatedDocument) {
      throw new AppError("모듈 업데이트에 실패했습니다.", 500);
    }

    // Document → Response DTO 변환
    return ModuleResponseDto.fromEntity(updatedDocument);
  }

  // 모듈 삭제
  async deleteModule(moduleIdx: number): Promise<void> {
    const existingModule = await moduleRepository.findById(moduleIdx);
    if (!existingModule) {
      throw new AppError("모듈을 찾을 수 없습니다.", 404);
    }

    const deleted = await moduleRepository.delete(moduleIdx);
    if (!deleted) {
      throw new AppError("모듈 삭제에 실패했습니다.", 500);
    }
  }
}

export default new ModuleService();
