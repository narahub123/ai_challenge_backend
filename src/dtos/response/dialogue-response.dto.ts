import { IDialogueUser, IDialogueEntry } from "../../types";

/**
 * 대화 응답 DTO
 * 클라이언트로 반환할 데이터 구조
 */
export class DialogueResponseDto {
  dialogue_idx: number;
  title: string | null;
  description: string | null;
  participants: number[];
  status: boolean;
  created_at: string;
  updated_at: string;
  // 백엔드에서 통합해서 전달되는 필드들
  dialogue_users?: IDialogueUser[];
  dialogue_entries?: IDialogueEntry[];

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

  /**
   * Entity나 Document를 Response DTO로 변환
   */
  static fromEntity(
    entity: any,
    dialogueUsers?: IDialogueUser[],
    dialogueEntries?: IDialogueEntry[]
  ): DialogueResponseDto {
    // Date를 ISO string으로 변환
    const formatDate = (date: Date | undefined | null): string => {
      if (!date) return new Date().toISOString();
      return date instanceof Date
        ? date.toISOString()
        : new Date(date).toISOString();
    };

    return new DialogueResponseDto({
      dialogue_idx: entity.dialogue_idx || 0,
      title: entity.title ?? null,
      description: entity.description ?? null,
      participants: entity.participants || [],
      status: Boolean(entity.status),
      created_at: formatDate(entity.created_at),
      updated_at: formatDate(entity.updated_at),
      dialogue_users: dialogueUsers,
      dialogue_entries: dialogueEntries,
    });
  }
}

