import { IDialogueUser } from "../../types";

/**
 * 대화 사용자 응답 DTO
 */
export class DialogueUserResponseDto {
  dialogue_user_idx: number;
  name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;

  constructor(data: DialogueUserResponseDto) {
    this.dialogue_user_idx = data.dialogue_user_idx;
    this.name = data.name;
    this.avatar_url = data.avatar_url;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Entity나 Document를 Response DTO로 변환
   */
  static fromEntity(entity: IDialogueUser): DialogueUserResponseDto {
    // Date를 ISO string으로 변환
    const formatDate = (date: Date | undefined | null): string => {
      if (!date) return new Date().toISOString();
      return date instanceof Date
        ? date.toISOString()
        : new Date(date).toISOString();
    };

    return new DialogueUserResponseDto({
      dialogue_user_idx: entity.dialogue_user_idx || 0,
      name: entity.name || "",
      avatar_url: entity.avatar_url ?? null,
      created_at: formatDate(entity.created_at),
      updated_at: formatDate(entity.updated_at),
    });
  }
}

