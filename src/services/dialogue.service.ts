import {dialogueRepository, dialogueEntryRepository} from "../repositories";
import { DialogueUser } from "../models";
import { DialogueEntity } from "../entities";
import { CreateDialogueDto, UpdateDialogueDto, DialogueResponseDto, PaginationDto, DialogueEntryResponseDto, CreateDialogueEntryDto } from "../dtos";
import { AppError } from "../middleware";
import {dialogueEntryService} from "../services";

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
        const dialogueEntries = await dialogueEntryRepository.findByDialogueIdx(
          doc.dialogue_idx
        );

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
    const dialogueEntries = await dialogueEntryRepository.findByDialogueIdx(
      dialogueIdx
    );

    return DialogueResponseDto.fromEntity(
      document,
      dialogueUsers,
      dialogueEntries
    );
  }

  // 대화 생성
  async createDialogue(
    dto: CreateDialogueDto,
    files?: {
      [key: string]: Express.Multer.File[];
    }
  ): Promise<DialogueResponseDto> {
    // 필수 필드 검증
    if (!dto.participants || dto.participants.length < 2) {
      throw new AppError("participants는 최소 2명 이상이어야 합니다.", 400);
    }

    // participants의 dialogue_user_idx가 실제로 존재하는지 확인
    const existingUsers = await DialogueUser.find({
      dialogue_user_idx: { $in: dto.participants },
    }).exec();

    if (existingUsers.length !== dto.participants.length) {
      throw new AppError(
        "일부 참여자 ID가 존재하지 않습니다.",
        400
      );
    }

    // DTO → Entity 변환 (status를 boolean으로 명시적 변환)
    const entity = new DialogueEntity({
      title: dto.title,
      description: dto.description,
      participants: dto.participants,
      status: dto.status !== undefined ? Boolean(dto.status) : true,
    });

    // Repository에 Entity 전달하여 생성
    const document = await dialogueRepository.create(entity);

    // dialogue_entries 생성 (entries가 있는 경우)
    const createdEntries: DialogueEntryResponseDto[] = [];
    if (dto.entries && Array.isArray(dto.entries) && dto.entries.length > 0) {
      // entries 배열을 순회하며 각 entry 생성
      const entryPromises = dto.entries.map(async (entryData, index) => {
        // 각 entry에 대한 파일 추출 (entries[0].image_urls, entries[0].video_urls 형식)
        const entryFiles: {
          image_urls?: Express.Multer.File[];
          video_urls?: Express.Multer.File[];
        } = {};

        // 파일 필드명 패턴: entries[${index}].image_urls, entries[${index}].video_urls
        const imageKey = `entries[${index}].image_urls`;
        const videoKey = `entries[${index}].video_urls`;

        if (files && files[imageKey]) {
          entryFiles.image_urls = files[imageKey];
        }
        if (files && files[videoKey]) {
          entryFiles.video_urls = files[videoKey];
        }

        // CreateDialogueEntryDto 생성 (dialogue_idx 추가)
        const createEntryDto = new CreateDialogueEntryDto({
          ...entryData,
          dialogue_idx: document.dialogue_idx,
        });

        // Entry 생성
        return await dialogueEntryService.createEntry(createEntryDto, entryFiles);
      });

      // 모든 entry 생성 (Promise.allSettled 사용하여 일부 실패해도 계속 진행)
      const entryResults = await Promise.allSettled(entryPromises);
      
      // 성공한 entry들만 수집
      entryResults.forEach((result) => {
        if (result.status === "fulfilled") {
          createdEntries.push(result.value);
        } else {
          // 실패한 entry는 에러 로깅 (하지만 전체 프로세스는 계속 진행)
          console.error("Entry 생성 실패:", result.reason);
        }
      });

      // 모든 entry 생성이 실패한 경우 경고
      if (createdEntries.length === 0 && dto.entries.length > 0) {
        console.warn("모든 entry 생성이 실패했습니다.");
      }
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

    // 생성된 dialogue_entries를 IDialogueEntry 형식으로 조회
    // 생성된 entries는 모두 같은 dialogue_idx를 가지므로 dialogue_idx로 조회
    const dialogueEntries = await dialogueEntryRepository.findByDialogueIdx(
      document.dialogue_idx
    );

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

    // participants 업데이트 시 검증
    if (dto.participants !== undefined) {
      if (dto.participants.length < 2) {
        throw new AppError("participants는 최소 2명 이상이어야 합니다.", 400);
      }

      // participants의 dialogue_user_idx가 실제로 존재하는지 확인
      const existingUsers = await DialogueUser.find({
        dialogue_user_idx: { $in: dto.participants },
      }).exec();

      if (existingUsers.length !== dto.participants.length) {
        throw new AppError(
          "일부 참여자 ID가 존재하지 않습니다.",
          400
        );
      }
    }

    // DTO → Partial Entity 변환 (status를 boolean으로 명시적 변환)
    const updateDataDto = new UpdateDialogueDto(dto);
    const updateData: Partial<DialogueEntity> = {
      ...updateDataDto,
      status:
        updateDataDto.status !== undefined
          ? Boolean(updateDataDto.status)
          : undefined,
    };

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
    const dialogueEntries = await dialogueEntryRepository.findByDialogueIdx(
      dialogueIdx
    );

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
    const entries = await dialogueEntryRepository.findByDialogueIdx(dialogueIdx);
    await Promise.all(
      entries.map((entry) =>
        dialogueEntryRepository.delete(entry.entry_idx)
      )
    );

    const deleted = await dialogueRepository.delete(dialogueIdx);
    if (!deleted) {
      throw new AppError("대화 삭제에 실패했습니다.", 500);
    }
  }
}

export default new DialogueService();

