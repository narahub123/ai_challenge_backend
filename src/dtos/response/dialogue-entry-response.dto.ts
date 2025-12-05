import {
  IDialogueEntry,
  DialogueEntryQA,
  QuestionContent,
  AnswerContent,
} from "../../types";

/**
 * 대화 엔트리 응답 DTO (백엔드 형식)
 */
export class DialogueEntryResponseDto {
  entry_idx: number;
  dialogue_idx: number;
  self_dialogue_user_idx: number;
  opponent_dialogue_user_idx: number;
  question: DialogueEntryQA<QuestionContent>;
  answer?: DialogueEntryQA<AnswerContent>;
  image_urls: string[] | null;
  video_urls: string[] | null;
  created_at: string;
  updated_at: string;

  constructor(data: DialogueEntryResponseDto) {
    this.entry_idx = data.entry_idx;
    this.dialogue_idx = data.dialogue_idx;
    this.self_dialogue_user_idx = data.self_dialogue_user_idx;
    this.opponent_dialogue_user_idx = data.opponent_dialogue_user_idx;
    this.question = data.question;
    this.answer = data.answer;
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
      self_dialogue_user_idx: entity.self_dialogue_user_idx || 0,
      opponent_dialogue_user_idx: entity.opponent_dialogue_user_idx || 0,
      question: entity.question,
      answer: entity.answer,
      image_urls: entity.image_urls || null,
      video_urls: entity.video_urls || null,
      created_at: formatDate(entity.created_at),
      updated_at: formatDate(entity.updated_at),
    });
  }
}

