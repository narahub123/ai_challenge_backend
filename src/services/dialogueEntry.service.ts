import dialogueEntryRepository from "../repositories/dialogueEntry.repository";
import { DialogueEntryEntity } from "../entities";
import {
  CreateDialogueEntryDto,
  UpdateDialogueEntryDto,
} from "../dtos/request";
import { DialogueEntryResponseDto, PaginationDto } from "../dtos/response";
import { AppError } from "../middleware";
import { uploadFiles } from "../utils/fileUpload.util";
import { validateDialogueEntry } from "../utils/dialogueValidation.util";

interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationDto;
}

class DialogueEntryService {
  // 모든 엔트리 조회 (Pagination 및 필터링 지원)
  async getAllEntries(
    page: number = 1,
    limit: number = 10,
    filters?: {
      dialogue_idx?: number;
      self_dialogue_user_idx?: number;
      opponent_dialogue_user_idx?: number;
    }
  ): Promise<PaginatedResponse<DialogueEntryResponseDto>> {
    // 페이지와 limit 유효성 검증
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit)); // 최대 100개로 제한

    // 전체 개수와 데이터 조회
    const [total, documents] = await Promise.all([
      dialogueEntryRepository.count(filters),
      dialogueEntryRepository.findAll(validPage, validLimit, filters),
    ]);

    const data = documents.map((doc) =>
      DialogueEntryResponseDto.fromEntity(doc)
    );
    const pagination = new PaginationDto(total, validPage, validLimit);

    return {
      data,
      pagination,
    };
  }

  // 엔트리 상세 조회
  async getEntryById(entryIdx: number): Promise<DialogueEntryResponseDto> {
    const document = await dialogueEntryRepository.findById(entryIdx);

    if (!document) {
      throw new AppError("대화 엔트리를 찾을 수 없습니다.", 404);
    }

    return DialogueEntryResponseDto.fromEntity(document);
  }

  // dialogue_idx로 엔트리들 조회
  async getEntriesByDialogue(
    dialogueIdx: number
  ): Promise<DialogueEntryResponseDto[]> {
    const documents = await dialogueEntryRepository.findByDialogueIdx(
      dialogueIdx
    );

    return documents.map((doc) => DialogueEntryResponseDto.fromEntity(doc));
  }

  // 엔트리 생성 (File 처리 포함)
  async createEntry(
    dto: CreateDialogueEntryDto,
    files?: {
      image_urls?: Express.Multer.File[];
      video_urls?: Express.Multer.File[];
    }
  ): Promise<DialogueEntryResponseDto> {
    // 필수 필드 검증
    if (!dto.dialogue_idx) {
      throw new AppError("대화 ID는 필수입니다.", 400);
    }

    if (!dto.self_dialogue_user_idx || !dto.opponent_dialogue_user_idx) {
      throw new AppError("참여자 ID(self, opponent)는 필수입니다.", 400);
    }

    if (!dto.question) {
      throw new AppError("Question은 필수입니다.", 400);
    }

    // Question/Answer 내용 유효성 검사
    try {
      validateDialogueEntry(dto);
    } catch (error: any) {
      throw new AppError(error.message, 400);
    }

    // File 처리: image_urls
    if (files?.image_urls && files.image_urls.length > 0) {
      const imageUrls = await uploadFiles(files.image_urls);
      dto.image_urls = imageUrls;
    } else if (dto.image_urls && Array.isArray(dto.image_urls)) {
      dto.image_urls = dto.image_urls as string[];
    } else if (dto.image_urls === null || dto.image_urls === undefined) {
      // null이나 undefined면 빈 배열로 변환 (모델의 default와 일치)
      dto.image_urls = [];
    }

    // File 처리: video_urls
    if (files?.video_urls && files.video_urls.length > 0) {
      const videoUrls = await uploadFiles(files.video_urls);
      dto.video_urls = videoUrls;
    } else if (dto.video_urls && Array.isArray(dto.video_urls)) {
      dto.video_urls = dto.video_urls as string[];
    } else if (dto.video_urls === null || dto.video_urls === undefined) {
      // null이나 undefined면 빈 배열로 변환 (모델의 default와 일치)
      dto.video_urls = [];
    }

    // DTO → Entity 변환 (null을 빈 배열로 변환한 후)
    const entity = new DialogueEntryEntity({
      ...dto,
      image_urls: dto.image_urls || [],
      video_urls: dto.video_urls || [],
    });

    // Repository에 Entity 전달하여 생성
    const document = await dialogueEntryRepository.create(entity);

    // Document → Response DTO 변환
    return DialogueEntryResponseDto.fromEntity(document);
  }

  // 엔트리 업데이트 (File 처리 포함)
  async updateEntry(
    entryIdx: number,
    dto: UpdateDialogueEntryDto,
    files?: {
      image_urls?: Express.Multer.File[];
      video_urls?: Express.Multer.File[];
    }
  ): Promise<DialogueEntryResponseDto> {
    // 존재 여부 확인
    const existingEntry = await dialogueEntryRepository.findById(entryIdx);
    if (!existingEntry) {
      throw new AppError("대화 엔트리를 찾을 수 없습니다.", 404);
    }

    // DTO → Partial Entity 변환
    const updateData = new UpdateDialogueEntryDto(dto);

    // Question/Answer 내용 유효성 검사 (업데이트되는 경우에만)
    if (updateData.question || updateData.answer) {
      // 기존 entry와 병합하여 전체 entry 구성
      const mergedEntry: CreateDialogueEntryDto = {
        dialogue_idx: existingEntry.dialogue_idx,
        self_dialogue_user_idx: updateData.self_dialogue_user_idx ?? existingEntry.self_dialogue_user_idx,
        opponent_dialogue_user_idx: updateData.opponent_dialogue_user_idx ?? existingEntry.opponent_dialogue_user_idx,
        question: updateData.question ?? existingEntry.question,
        answer: updateData.answer !== undefined ? updateData.answer : existingEntry.answer ?? undefined,
        image_urls: updateData.image_urls ?? existingEntry.image_urls,
        video_urls: updateData.video_urls ?? existingEntry.video_urls,
      };

      try {
        validateDialogueEntry(mergedEntry);
      } catch (error: any) {
        throw new AppError(error.message, 400);
      }
    }

    // File 처리: image_urls
    if (files?.image_urls && files.image_urls.length > 0) {
      const imageUrls = await uploadFiles(files.image_urls);
      updateData.image_urls = imageUrls;
    } else if (updateData.image_urls && Array.isArray(updateData.image_urls)) {
      updateData.image_urls = updateData.image_urls as string[];
    } else if (updateData.image_urls === null) {
      // null이면 빈 배열로 변환
      updateData.image_urls = [];
    }

    // File 처리: video_urls
    if (files?.video_urls && files.video_urls.length > 0) {
      const videoUrls = await uploadFiles(files.video_urls);
      updateData.video_urls = videoUrls;
    } else if (updateData.video_urls && Array.isArray(updateData.video_urls)) {
      updateData.video_urls = updateData.video_urls as string[];
    } else if (updateData.video_urls === null) {
      // null이면 빈 배열로 변환
      updateData.video_urls = [];
    }

    // Repository에 전달하여 업데이트 (null을 빈 배열로 변환)
    const updateEntity: Partial<DialogueEntryEntity> = {
      ...updateData,
      image_urls: updateData.image_urls === null ? [] : updateData.image_urls,
      video_urls: updateData.video_urls === null ? [] : updateData.video_urls,
    };

    const updatedDocument = await dialogueEntryRepository.update(
      entryIdx,
      updateEntity
    );

    if (!updatedDocument) {
      throw new AppError("대화 엔트리 업데이트에 실패했습니다.", 500);
    }

    // Document → Response DTO 변환
    return DialogueEntryResponseDto.fromEntity(updatedDocument);
  }

  // 엔트리 삭제
  async deleteEntry(entryIdx: number): Promise<void> {
    const existingEntry = await dialogueEntryRepository.findById(entryIdx);
    if (!existingEntry) {
      throw new AppError("대화 엔트리를 찾을 수 없습니다.", 404);
    }

    const deleted = await dialogueEntryRepository.delete(entryIdx);
    if (!deleted) {
      throw new AppError("대화 엔트리 삭제에 실패했습니다.", 500);
    }
  }
}

export default new DialogueEntryService();

