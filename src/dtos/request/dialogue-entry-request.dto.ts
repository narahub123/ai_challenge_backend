import {
  ContentType,
  QuestionContent,
  AnswerContent,
  DialogueEntryQA,
} from "../../types";

/**
 * 대화 엔트리 생성 요청 DTO
 */
export class CreateDialogueEntryDto {
  dialogue_idx: number;

  self_dialogue_user_idx: number;
  opponent_dialogue_user_idx: number;

  question: DialogueEntryQA<QuestionContent>;
  answer?: DialogueEntryQA<AnswerContent>;

  image_urls?: string[] | null;
  video_urls?: string[] | null;

  constructor(data: Partial<CreateDialogueEntryDto>) {
    this.dialogue_idx = data.dialogue_idx || 0;
    this.self_dialogue_user_idx = data.self_dialogue_user_idx || 0;
    this.opponent_dialogue_user_idx = data.opponent_dialogue_user_idx || 0;

    // Question is required
    this.question = data.question!;

    this.answer = data.answer;
    this.image_urls = data.image_urls ?? null;
    this.video_urls = data.video_urls ?? null;
  }
}

/**
 * 대화 엔트리 업데이트 요청 DTO
 * 모든 필드가 선택적 (Partial Update)
 */
export class UpdateDialogueEntryDto {
  self_dialogue_user_idx?: number;
  opponent_dialogue_user_idx?: number;

  question?: DialogueEntryQA<QuestionContent>;
  answer?: DialogueEntryQA<AnswerContent>;

  image_urls?: string[] | null;
  video_urls?: string[] | null;

  constructor(data: Partial<UpdateDialogueEntryDto>) {
    if (data.self_dialogue_user_idx !== undefined) {
      this.self_dialogue_user_idx = data.self_dialogue_user_idx;
    }
    if (data.opponent_dialogue_user_idx !== undefined) {
      this.opponent_dialogue_user_idx = data.opponent_dialogue_user_idx;
    }
    if (data.question !== undefined) {
      this.question = data.question;
    }
    if (data.answer !== undefined) {
      this.answer = data.answer;
    }
    if (data.image_urls !== undefined) {
      this.image_urls = data.image_urls;
    }
    if (data.video_urls !== undefined) {
      this.video_urls = data.video_urls;
    }
  }
}

