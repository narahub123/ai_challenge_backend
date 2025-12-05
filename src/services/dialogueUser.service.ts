import dialogueUserRepository from "../repositories/dialogueUser.repository";
import { DialogueUserEntity } from "../entities";
import {
  CreateDialogueUserDto,
  UpdateDialogueUserDto,
} from "../dtos/request";
import { DialogueUserResponseDto, PaginationDto } from "../dtos/response";
import { AppError } from "../middleware";
import { uploadFile } from "../utils/fileUpload.util";

interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationDto;
}

class DialogueUserService {
  // 모든 사용자 조회 (Pagination 및 필터링 지원)
  async getAllUsers(
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
    }
  ): Promise<PaginatedResponse<DialogueUserResponseDto>> {
    // 페이지와 limit 유효성 검증
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit)); // 최대 100개로 제한

    // 전체 개수와 데이터 조회
    const [total, documents] = await Promise.all([
      dialogueUserRepository.count(filters),
      dialogueUserRepository.findAll(validPage, validLimit, filters),
    ]);

    const data = documents.map((doc) =>
      DialogueUserResponseDto.fromEntity(doc)
    );
    const pagination = new PaginationDto(total, validPage, validLimit);

    return {
      data,
      pagination,
    };
  }

  // 사용자 상세 조회
  async getUserById(userIdx: number): Promise<DialogueUserResponseDto> {
    const document = await dialogueUserRepository.findById(userIdx);

    if (!document) {
      throw new AppError("대화 사용자를 찾을 수 없습니다.", 404);
    }

    return DialogueUserResponseDto.fromEntity(document);
  }

  // 사용자 생성 (File 처리 포함)
  async createUser(
    dto: CreateDialogueUserDto,
    files?: {
      avatar_url?: Express.Multer.File[];
    }
  ): Promise<DialogueUserResponseDto> {
    // 필수 필드 검증
    if (!dto.name || dto.name.trim().length === 0) {
      throw new AppError("이름은 필수입니다.", 400);
    }

    // File 처리: avatar_url
    if (files?.avatar_url && files.avatar_url.length > 0) {
      const avatarUrl = await uploadFile(files.avatar_url[0]);
      dto.avatar_url = avatarUrl;
    } else if (dto.avatar_url && typeof dto.avatar_url === "string") {
      dto.avatar_url = dto.avatar_url;
    } else {
      dto.avatar_url = null;
    }

    // DTO → Entity 변환
    const entity = new DialogueUserEntity({
      name: dto.name.trim(),
      avatar_url: dto.avatar_url,
    });

    // Repository에 Entity 전달하여 생성
    const document = await dialogueUserRepository.create(entity);

    // Document → Response DTO 변환
    return DialogueUserResponseDto.fromEntity(document);
  }

  // 사용자 업데이트 (File 처리 포함)
  async updateUser(
    userIdx: number,
    dto: UpdateDialogueUserDto,
    files?: {
      avatar_url?: Express.Multer.File[];
    }
  ): Promise<DialogueUserResponseDto> {
    // 존재 여부 확인
    const existingUser = await dialogueUserRepository.findById(userIdx);
    if (!existingUser) {
      throw new AppError("대화 사용자를 찾을 수 없습니다.", 404);
    }

    // DTO → Partial Entity 변환
    const updateData = new UpdateDialogueUserDto(dto);

    // File 처리: avatar_url
    if (files?.avatar_url && files.avatar_url.length > 0) {
      const avatarUrl = await uploadFile(files.avatar_url[0]);
      updateData.avatar_url = avatarUrl;
    } else if (updateData.avatar_url && typeof updateData.avatar_url === "string") {
      updateData.avatar_url = updateData.avatar_url;
    } else if (updateData.avatar_url === undefined) {
      // undefined면 기존 값 유지 (업데이트하지 않음)
      updateData.avatar_url = existingUser.avatar_url;
    }

    // Repository에 전달하여 업데이트
    const updateEntity: Partial<DialogueUserEntity> = {
      ...updateData,
      name: updateData.name ? updateData.name.trim() : undefined,
    };

    const updatedDocument = await dialogueUserRepository.update(
      userIdx,
      updateEntity
    );

    if (!updatedDocument) {
      throw new AppError("대화 사용자 업데이트에 실패했습니다.", 500);
    }

    // Document → Response DTO 변환
    return DialogueUserResponseDto.fromEntity(updatedDocument);
  }

  // 사용자 삭제
  async deleteUser(userIdx: number): Promise<void> {
    const existingUser = await dialogueUserRepository.findById(userIdx);
    if (!existingUser) {
      throw new AppError("대화 사용자를 찾을 수 없습니다.", 404);
    }

    const deleted = await dialogueUserRepository.delete(userIdx);
    if (!deleted) {
      throw new AppError("대화 사용자 삭제에 실패했습니다.", 500);
    }
  }
}

export default new DialogueUserService();

