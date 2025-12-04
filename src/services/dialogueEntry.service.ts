import dialogueEntryRepository from "../repositories/dialogueEntry.repository";
import dialogueRepository from "../repositories/dialogue.repository";
import { DialogueEntryEntity } from "../entities";
import {
  CreateDialogueEntryDto,
  UpdateDialogueEntryDto,
} from "../dtos/request";
import { DialogueEntryResponseDto } from "../dtos/response";
import { AppError } from "../middleware";

class DialogueEntryService {
  // 특정 dialogue의 모든 엔트리 조회
  async getEntriesByDialogue(
    dialogueIdx: number,
    page: number = 1,
    limit: number = 100
  ): Promise<DialogueEntryResponseDto[]> {
    // dialogue 존재 여부 확인
    const dialogue = await dialogueRepository.findById(dialogueIdx);
    if (!dialogue) {
      throw new AppError("대화를 찾을 수 없습니다.", 404);
    }

    const documents = await dialogueEntryRepository.findByDialogueIdx(
      dialogueIdx,
      page,
      limit
    );

    return documents.map((doc) => DialogueEntryResponseDto.fromEntity(doc));
  }

  // 엔트리 상세 조회
  async getEntryById(entryIdx: number): Promise<DialogueEntryResponseDto> {
    const document = await dialogueEntryRepository.findById(entryIdx);

    if (!document) {
      throw new AppError("대화 엔트리를 찾을 수 없습니다.", 404);
    }

    return DialogueEntryResponseDto.fromEntity(document);
  }

  // dialogue_idx와 entry_idx로 조회
  async getEntryByDialogueAndEntry(
    dialogueIdx: number,
    entryIdx: number
  ): Promise<DialogueEntryResponseDto> {
    const document = await dialogueEntryRepository.findByDialogueAndEntry(
      dialogueIdx,
      entryIdx
    );

    if (!document) {
      throw new AppError("대화 엔트리를 찾을 수 없습니다.", 404);
    }

    return DialogueEntryResponseDto.fromEntity(document);
  }

  // 엔트리 생성
  async createEntry(
    dto: CreateDialogueEntryDto
  ): Promise<DialogueEntryResponseDto> {
    // dialogue 존재 여부 확인
    const dialogue = await dialogueRepository.findById(dto.dialogue_idx);
    if (!dialogue) {
      throw new AppError("대화를 찾을 수 없습니다.", 404);
    }

    // 필수 필드 검증
    if (!dto.sender_dialogue_user_idx) {
      throw new AppError("발신자 ID는 필수입니다.", 400);
    }

    if (!dto.content) {
      throw new AppError("내용은 필수입니다.", 400);
    }

    // DTO → Entity 변환
    const entity = new DialogueEntryEntity(dto);

    // Repository에 Entity 전달하여 생성
    const document = await dialogueEntryRepository.create(entity);

    // Document → Response DTO 변환
    return DialogueEntryResponseDto.fromEntity(document);
  }

  // 엔트리 업데이트
  async updateEntry(
    entryIdx: number,
    dto: UpdateDialogueEntryDto
  ): Promise<DialogueEntryResponseDto> {
    // 존재 여부 확인
    const existingEntry = await dialogueEntryRepository.findById(entryIdx);
    if (!existingEntry) {
      throw new AppError("대화 엔트리를 찾을 수 없습니다.", 404);
    }

    // DTO → Partial Entity 변환
    const updateData = new UpdateDialogueEntryDto(dto);

    // Repository에 전달하여 업데이트
    const updatedDocument = await dialogueEntryRepository.update(
      entryIdx,
      updateData
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
