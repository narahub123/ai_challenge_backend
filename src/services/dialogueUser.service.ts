import dialogueUserRepository from "../repositories/dialogueUser.repository";
import { DialogueUserEntity } from "../entities";
import { CreateDialogueUserDto, UpdateDialogueUserDto } from "../dtos/request";
import { DialogueUserResponseDto } from "../dtos/response";
import { AppError } from "../middleware";
import { uploadFile } from "../utils/fileUpload.util";

class DialogueUserService {
  // 모든 사용자 조회 (페이지네이션)
  async getAllUsers(
    page: number = 1,
    limit: number = 100
  ): Promise<DialogueUserResponseDto[]> {
    const documents = await dialogueUserRepository.findAll(page, limit);
    return documents.map((doc) => DialogueUserResponseDto.fromEntity(doc));
  }

  // ID 목록으로 사용자 조회
  async getUsersByIds(
    userIds: number[]
  ): Promise<DialogueUserResponseDto[]> {
    const documents = await dialogueUserRepository.findByIds(userIds);
    return documents.map((doc) => DialogueUserResponseDto.fromEntity(doc));
  }

  // 사용자 상세 조회
  async getUserById(
    dialogueUserId: number
  ): Promise<DialogueUserResponseDto> {
    const document = await dialogueUserRepository.findById(dialogueUserId);

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
    }

    // DTO → Entity 변환
    const entity = new DialogueUserEntity(dto);

    // Repository에 Entity 전달하여 생성
    const document = await dialogueUserRepository.create(entity);

    // Document → Response DTO 변환
    return DialogueUserResponseDto.fromEntity(document);
  }

  // 사용자 업데이트 (File 처리 포함)
  async updateUser(
    dialogueUserId: number,
    dto: UpdateDialogueUserDto,
    files?: {
      avatar_url?: Express.Multer.File[];
    }
  ): Promise<DialogueUserResponseDto> {
    // 존재 여부 확인
    const existingUser = await dialogueUserRepository.findById(dialogueUserId);
    if (!existingUser) {
      throw new AppError("대화 사용자를 찾을 수 없습니다.", 404);
    }

    // 이름 검증 (업데이트하는 경우)
    if (dto.name !== undefined && dto.name.trim().length === 0) {
      throw new AppError("이름은 비어있을 수 없습니다.", 400);
    }

    // DTO → Partial Entity 변환
    const updateData = new UpdateDialogueUserDto(dto);

    // File 처리: avatar_url
    if (files?.avatar_url && files.avatar_url.length > 0) {
      const avatarUrl = await uploadFile(files.avatar_url[0]);
      updateData.avatar_url = avatarUrl;
    } else if (updateData.avatar_url && typeof updateData.avatar_url === "string") {
      updateData.avatar_url = updateData.avatar_url;
    }

    // Repository에 전달하여 업데이트
    const updatedDocument = await dialogueUserRepository.update(
      dialogueUserId,
      updateData
    );

    if (!updatedDocument) {
      throw new AppError("대화 사용자 업데이트에 실패했습니다.", 500);
    }

    // Document → Response DTO 변환
    return DialogueUserResponseDto.fromEntity(updatedDocument);
  }

  // 사용자 삭제
  async deleteUser(dialogueUserId: number): Promise<void> {
    const existingUser = await dialogueUserRepository.findById(dialogueUserId);
    if (!existingUser) {
      throw new AppError("대화 사용자를 찾을 수 없습니다.", 404);
    }

    const deleted = await dialogueUserRepository.delete(dialogueUserId);
    if (!deleted) {
      throw new AppError("대화 사용자 삭제에 실패했습니다.", 500);
    }
  }
}

export default new DialogueUserService();
