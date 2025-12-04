import { DialogueUserType, DialogueContentType } from "../../types";

/**
 * 대화 엔트리 생성 요청 DTO
 */
export class CreateDialogueEntryDto {
  dialogue_idx: number;
  sender_dialogue_user_idx: number;
  user_type: DialogueUserType;
  content_type: DialogueContentType;
  content: string | Record<string, any>;
  image_urls?: string[] | null;
  video_urls?: string[] | null;

  constructor(data: Partial<CreateDialogueEntryDto>) {
    this.dialogue_idx = data.dialogue_idx || 0;
    this.sender_dialogue_user_idx = data.sender_dialogue_user_idx || 0;
    this.user_type = data.user_type || "self";
    this.content_type = data.content_type || "text";
    this.content = data.content || "";
    this.image_urls = data.image_urls ?? null;
    this.video_urls = data.video_urls ?? null;
  }
}

/**
 * 대화 엔트리 업데이트 요청 DTO
 * 모든 필드가 선택적 (Partial Update)
 */
export class UpdateDialogueEntryDto {
  sender_dialogue_user_idx?: number;
  user_type?: DialogueUserType;
  content_type?: DialogueContentType;
  content?: string | Record<string, any>;
  image_urls?: string[] | null;
  video_urls?: string[] | null;

  constructor(data: Partial<UpdateDialogueEntryDto>) {
    if (data.sender_dialogue_user_idx !== undefined) {
      this.sender_dialogue_user_idx = data.sender_dialogue_user_idx;
    }
    if (data.user_type !== undefined) {
      this.user_type = data.user_type;
    }
    if (data.content_type !== undefined) {
      this.content_type = data.content_type;
    }
    if (data.content !== undefined) {
      this.content = data.content;
    }
    if (data.image_urls !== undefined) {
      this.image_urls = data.image_urls;
    }
    if (data.video_urls !== undefined) {
      this.video_urls = data.video_urls;
    }
  }
}

