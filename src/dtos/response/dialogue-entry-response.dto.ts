import { IDialogueEntry } from "../../types";

/**
 * 대화 엔트리 응답 DTO
 */
export class DialogueEntryResponseDto {
  entry_idx: number;
  dialogue_idx: number;
  sender_dialogue_user_idx: number;
  user_type: string;
  content_type: string;
  content: string | Record<string, any>;
  image_urls: string[] | null;
  video_urls: string[] | null;
  created_at: string;
  updated_at: string;

  constructor(data: DialogueEntryResponseDto) {
    this.entry_idx = data.entry_idx;
    this.dialogue_idx = data.dialogue_idx;
    this.sender_dialogue_user_idx = data.sender_dialogue_user_idx;
    this.user_type = data.user_type;
    this.content_type = data.content_type;
    this.content = data.content;
    this.image_urls = data.image_urls;
    this.video_urls = data.video_urls;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Entity나 Document를 Response DTO로 변환
   */
  static fromEntity(entity: IDialogueEntry): DialogueEntryResponseDto {
    // Date를 ISO string으로 변환
    const formatDate = (date: Date | undefined | null): string => {
      if (!date) return new Date().toISOString();
      return date instanceof Date
        ? date.toISOString()
        : new Date(date).toISOString();
    };

    return new DialogueEntryResponseDto({
      entry_idx: entity.entry_idx || 0,
      dialogue_idx: entity.dialogue_idx || 0,
      sender_dialogue_user_idx: entity.sender_dialogue_user_idx || 0,
      user_type: entity.user_type || "self",
      content_type: entity.content_type || "text",
      content: entity.content || "",
      image_urls: entity.image_urls || null,
      video_urls: entity.video_urls || null,
      created_at: formatDate(entity.created_at),
      updated_at: formatDate(entity.updated_at),
    });
  }
}

