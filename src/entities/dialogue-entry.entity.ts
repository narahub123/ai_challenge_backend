import { DialogueUserType, DialogueContentType } from "../types";

/**
 * DialogueEntry 도메인 엔티티
 */
export class DialogueEntryEntity {
  entry_idx?: number;
  dialogue_idx: number;
  sender_dialogue_user_idx: number;
  user_type: DialogueUserType;
  content_type: DialogueContentType;
  content: string | Record<string, any>;
  image_urls: string[] | null;
  video_urls: string[] | null;
  created_at?: Date;
  updated_at?: Date;

  constructor(data: Partial<DialogueEntryEntity>) {
    this.entry_idx = data.entry_idx;
    this.dialogue_idx = data.dialogue_idx || 0;
    this.sender_dialogue_user_idx = data.sender_dialogue_user_idx || 0;
    this.user_type = data.user_type || "self";
    this.content_type = data.content_type || "text";
    this.content = data.content || "";
    this.image_urls = data.image_urls ?? null;
    this.video_urls = data.video_urls ?? null;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Mongoose Document를 Entity로 변환
   */
  static fromDocument(document: any): DialogueEntryEntity {
    return new DialogueEntryEntity({
      entry_idx: document.entry_idx,
      dialogue_idx: document.dialogue_idx,
      sender_dialogue_user_idx: document.sender_dialogue_user_idx,
      user_type: document.user_type,
      content_type: document.content_type,
      content: document.content,
      image_urls: document.image_urls,
      video_urls: document.video_urls,
      created_at: document.created_at,
      updated_at: document.updated_at,
    });
  }

  /**
   * Entity를 일반 객체로 변환
   */
  toPlainObject(): Record<string, any> {
    return {
      entry_idx: this.entry_idx,
      dialogue_idx: this.dialogue_idx,
      sender_dialogue_user_idx: this.sender_dialogue_user_idx,
      user_type: this.user_type,
      content_type: this.content_type,
      content: this.content,
      image_urls: this.image_urls,
      video_urls: this.video_urls,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

