import {
  DialogueEntryQA,
  QuestionContent,
  AnswerContent,
} from "../types";

/**
 * DialogueEntry 도메인 엔티티
 */
export class DialogueEntryEntity {
  entry_idx?: number;
  dialogue_idx: number;

  self_dialogue_user_idx: number;
  opponent_dialogue_user_idx: number;

  question: DialogueEntryQA<QuestionContent>;
  answer?: DialogueEntryQA<AnswerContent>;

  image_urls: string[] | null;
  video_urls: string[] | null;
  created_at?: Date;
  updated_at?: Date;

  constructor(data: Partial<DialogueEntryEntity>) {
    this.entry_idx = data.entry_idx;
    this.dialogue_idx = data.dialogue_idx || 0;
    this.self_dialogue_user_idx = data.self_dialogue_user_idx || 0;
    this.opponent_dialogue_user_idx = data.opponent_dialogue_user_idx || 0;

    // Question is mandatory in logic, but might be partial in constructor
    this.question = data.question!;

    this.answer = data.answer;
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
      self_dialogue_user_idx: document.self_dialogue_user_idx,
      opponent_dialogue_user_idx: document.opponent_dialogue_user_idx,
      question: document.question,
      answer: document.answer,
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
      self_dialogue_user_idx: this.self_dialogue_user_idx,
      opponent_dialogue_user_idx: this.opponent_dialogue_user_idx,
      question: this.question,
      answer: this.answer,
      image_urls: this.image_urls,
      video_urls: this.video_urls,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

