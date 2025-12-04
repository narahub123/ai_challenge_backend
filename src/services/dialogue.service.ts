import dialogueRepository from "../repositories/dialogue.repository";
import { DialogueUser, DialogueEntry } from "../models";
import { DialogueEntity } from "../entities";
import { CreateDialogueDto, UpdateDialogueDto } from "../dtos/request";
import { DialogueResponseDto, PaginationDto } from "../dtos/response";
import { AppError } from "../middleware";

interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationDto;
}

class DialogueService {
  // 모든 대화 조회 (Pagination 및 필터링 지원)
  async getAllDialogues(
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
      status?: boolean | 0 | 1;
    }
  ): Promise<PaginatedResponse<DialogueResponseDto>> {
    // 페이지와 limit 유효성 검증
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit)); // 최대 100개로 제한

    // 필터 정규화 (0/1을 boolean으로 변환)
    const normalizedFilters = filters
      ? {
          search: filters.search,
          status:
            filters.status !== undefined ? Boolean(filters.status) : undefined,
        }
      : undefined;

    // 전체 개수와 데이터 조회
    const [total, documents] = await Promise.all([
      dialogueRepository.count(normalizedFilters),
      dialogueRepository.findAll(validPage, validLimit, normalizedFilters),
    ]);

    // 각 dialogue에 대해 dialogue_users와 dialogue_entries 조회
    const data = await Promise.all(
      documents.map(async (doc) => {
        // participants 배열에서 dialogue_user_idx 목록 추출
        const participantIds = doc.participants || [];

        // dialogue_users 조회
        const dialogueUsers =
          participantIds.length > 0
            ? await DialogueUser.find({
                dialogue_user_idx: { $in: participantIds },
              }).exec()
            : [];

        // dialogue_entries 조회
        const dialogueEntries = await DialogueEntry.find({
          dialogue_idx: doc.dialogue_idx,
        })
          .sort({ created_at: 1 })
          .exec();

        return DialogueResponseDto.fromEntity(
          doc,
          dialogueUsers,
          dialogueEntries
        );
      })
    );

    const pagination = new PaginationDto(total, validPage, validLimit);

    return {
      data,
      pagination,
    };
  }

  // 대화 상세 조회
  async getDialogueById(dialogueIdx: number): Promise<DialogueResponseDto> {
    const document = await dialogueRepository.findById(dialogueIdx);

    if (!document) {
      throw new AppError("대화를 찾을 수 없습니다.", 404);
    }

    // participants 배열에서 dialogue_user_idx 목록 추출
    const participantIds = document.participants || [];

    // dialogue_users 조회
    const dialogueUsers =
      participantIds.length > 0
        ? await DialogueUser.find({
            dialogue_user_idx: { $in: participantIds },
          }).exec()
        : [];

    // dialogue_entries 조회
    const dialogueEntries = await DialogueEntry.find({
      dialogue_idx: dialogueIdx,
    })
      .sort({ created_at: 1 })
      .exec();

    return DialogueResponseDto.fromEntity(
      document,
      dialogueUsers,
      dialogueEntries
    );
  }

  // 대화 생성
  async createDialogue(dto: CreateDialogueDto): Promise<DialogueResponseDto> {
    // DTO → Entity 변환
    const entity = new DialogueEntity(dto);

    // Repository에 Entity 전달하여 생성
    const document = await dialogueRepository.create(entity);

    // participants 배열에서 dialogue_user_idx 목록 추출
    const participantIds = document.participants || [];

    // dialogue_users 조회
    const dialogueUsers =
      participantIds.length > 0
        ? await DialogueUser.find({
            dialogue_user_idx: { $in: participantIds },
          }).exec()
        : [];

    // dialogue_entries는 새로 생성된 대화이므로 빈 배열
    const dialogueEntries: any[] = [];

    // Document → Response DTO 변환
    return DialogueResponseDto.fromEntity(
      document,
      dialogueUsers,
      dialogueEntries
    );
  }

  // 대화 업데이트
  async updateDialogue(
    dialogueIdx: number,
    dto: UpdateDialogueDto
  ): Promise<DialogueResponseDto> {
    // 존재 여부 확인
    const existingDialogue = await dialogueRepository.findById(dialogueIdx);
    if (!existingDialogue) {
      throw new AppError("대화를 찾을 수 없습니다.", 404);
    }

    // DTO → Partial Entity 변환
    const updateData = new UpdateDialogueDto(dto);

    // Repository에 전달하여 업데이트
    const updatedDocument = await dialogueRepository.update(
      dialogueIdx,
      updateData
    );

    if (!updatedDocument) {
      throw new AppError("대화 업데이트에 실패했습니다.", 500);
    }

    // participants 배열에서 dialogue_user_idx 목록 추출
    const participantIds = updatedDocument.participants || [];

    // dialogue_users 조회
    const dialogueUsers =
      participantIds.length > 0
        ? await DialogueUser.find({
            dialogue_user_idx: { $in: participantIds },
          }).exec()
        : [];

    // dialogue_entries 조회
    const dialogueEntries = await DialogueEntry.find({
      dialogue_idx: dialogueIdx,
    })
      .sort({ created_at: 1 })
      .exec();

    // Document → Response DTO 변환
    return DialogueResponseDto.fromEntity(
      updatedDocument,
      dialogueUsers,
      dialogueEntries
    );
  }

  // 대화 삭제
  async deleteDialogue(dialogueIdx: number): Promise<void> {
    const existingDialogue = await dialogueRepository.findById(dialogueIdx);
    if (!existingDialogue) {
      throw new AppError("대화를 찾을 수 없습니다.", 404);
    }

    // 관련 dialogue_entries도 삭제
    await DialogueEntry.deleteMany({ dialogue_idx: dialogueIdx }).exec();

    const deleted = await dialogueRepository.delete(dialogueIdx);
    if (!deleted) {
      throw new AppError("대화 삭제에 실패했습니다.", 500);
    }
  }
}

export default new DialogueService();
