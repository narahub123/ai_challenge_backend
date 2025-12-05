import { IDialogueUser, IDialogueEntry } from "../../types";
import { DialogueEntryResponseDto } from "./dialogue-entry-response.dto";

/**
 * 대화 응답 DTO
 * 클라이언트로 반환할 데이터 구조
 */
export class DialogueResponseDto {
  dialogue_idx: number;
  title: string | null;
  description: string | null;
  participants: number[];
  status: 0 | 1;
  created_at: string;
  updated_at: string;
  dialogue_users?: IDialogueUser[];
  dialogue_entries?: DialogueEntryResponseDto[];

  constructor(data: DialogueResponseDto) {
    this.dialogue_idx = data.dialogue_idx;
    this.title = data.title;
    this.description = data.description;
    this.participants = data.participants;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.dialogue_users = data.dialogue_users;
    this.dialogue_entries = data.dialogue_entries;
  }

  private static formatDate(date: Date | string | undefined | null): string {
    if (!date) return ""; // 생성/업데이트 시간이 없으면 빈 문자열로 반환 (프론트와 협의 가능)
    try {
      return date instanceof Date ? date.toISOString() : new Date(date).toISOString();
    } catch {
      return ""; // 파싱 불가 시 빈 문자열로 안전 처리
    }
  }

  /**
   * 상태값을 0|1로 변환(다양한 입력 타입 방어)
   */
  private static toStatusNumber(value: boolean | number | string | undefined | null): 0 | 1 {
    if (value === true) return 1;
    if (value === false) return 0;

    if (typeof value === "number") {
      return value === 1 ? 1 : 0;
    }

    if (typeof value === "string") {
      const s = value.trim().toLowerCase();
      if (s === "1" || s === "true") return 1;
      return 0;
    }

    // undefined / null 등은 기본 0으로 처리 (프론트 요구가 항상 0|1일 때 안전)
    return 0;
  }

  private static normalizeParticipants(input: any): number[] {
    if (!Array.isArray(input)) return [];
    return input
      .map((p) => {
        if (typeof p === "number") return p;
        const n = Number(p);
        return Number.isFinite(n) ? n : null;
      })
      .filter((v): v is number => v !== null);
  }

  static fromEntity(
    entity: any,
    dialogueUsers?: IDialogueUser[],
    dialogueEntries?: IDialogueEntry[]
  ): DialogueResponseDto {
    const statusValue = DialogueResponseDto.toStatusNumber(entity?.status);

    const transformedEntries = dialogueEntries
      ? dialogueEntries.map((entry) => DialogueEntryResponseDto.fromEntity(entry))
      : [];

    const dto = new DialogueResponseDto({
      dialogue_idx: entity?.dialogue_idx ?? 0,
      title: entity?.title ?? null,
      description: entity?.description ?? null,
      participants: DialogueResponseDto.normalizeParticipants(entity?.participants),
      status: statusValue,
      created_at: DialogueResponseDto.formatDate(entity?.created_at),
      updated_at: DialogueResponseDto.formatDate(entity?.updated_at),
      dialogue_users: dialogueUsers ?? [],
      dialogue_entries: transformedEntries,
    });

    return dto;
  }
}


