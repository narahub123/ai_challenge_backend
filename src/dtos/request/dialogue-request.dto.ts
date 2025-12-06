import { CreateDialogueEntryDto } from "./dialogue-entry-request.dto";

/**
 * 대화 생성 요청 DTO
 */
export class CreateDialogueDto {
  title?: string | null;
  description?: string | null;
  participants: number[]; // DialogueUser 참조 배열
  status?: boolean | 0 | 1;
  entries?: Omit<CreateDialogueEntryDto, "dialogue_idx">[]; // DialogueEntry 생성 데이터 (dialogue_idx 제외)

  constructor(data: Partial<CreateDialogueDto>) {
    this.title = data.title ?? null;
    this.description = data.description ?? null;
    
    if (!data.participants || !Array.isArray(data.participants) || data.participants.length < 2) {
      throw new Error("participants는 최소 2명 이상이어야 합니다.");
    }
    this.participants = data.participants;
    
    this.status = data.status !== undefined ? Boolean(data.status) : true;

    // entries 처리: 배열이거나 단일 객체일 수 있음
    if (data.entries !== undefined) {
      if (Array.isArray(data.entries)) {
        this.entries = data.entries;
      } else if (typeof data.entries === "object" && data.entries !== null) {
        // 단일 객체를 배열로 변환
        this.entries = [data.entries as Omit<CreateDialogueEntryDto, "dialogue_idx">];
      } else {
        this.entries = [];
      }
    } else {
      this.entries = [];
    }
  }
}

/**
 * 대화 업데이트 요청 DTO
 * 모든 필드가 선택적 (Partial Update)
 */
export class UpdateDialogueDto {
  title?: string | null;
  description?: string | null;
  participants?: number[];
  status?: boolean | 0 | 1;

  constructor(data: Partial<UpdateDialogueDto>) {
    if (data.title !== undefined) {
      this.title = data.title;
    }
    if (data.description !== undefined) {
      this.description = data.description;
    }
    if (data.participants !== undefined) {
      if (!Array.isArray(data.participants) || data.participants.length < 2) {
        throw new Error("participants는 최소 2명 이상이어야 합니다.");
      }
      this.participants = data.participants;
    }
    if (data.status !== undefined) {
      this.status = Boolean(data.status);
    }
  }
}

