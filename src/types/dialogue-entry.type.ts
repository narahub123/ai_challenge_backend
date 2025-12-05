import { Document } from "mongoose";

// content 타입
export type ContentType = "text" | "cardnews" | "quiz";

// CardNews 참조
export interface CardNewsContent {
  card_news_idx: number;
}

// Quiz 참조 (question)
export interface QuizContent {
  quiz_idx: number;
}

// Quiz 선택/결과 (answer)
export interface QuizAnswerContent {
  quiz_idx: number;
  selected_choice_idx?: number;
  selected_choice_ids?: number[];
  is_correct?: boolean;
  explanation?: string;
}

// text 타입
export type TextContent = string;

// question / answer 공용 content 타입
export type QuestionContent = TextContent | CardNewsContent | QuizContent;
export type AnswerContent = TextContent | CardNewsContent | QuizAnswerContent;

// question/answer 구조
export interface DialogueEntryQA<T extends QuestionContent | AnswerContent> {
  content_type: ContentType;
  content: T;
}

// 최종 DialogueEntry 타입
export interface IDialogueEntry extends Document {
  entry_idx: number; // auto increment
  dialogue_idx: number;

  self_dialogue_user_idx: number;
  opponent_dialogue_user_idx: number;

  question: DialogueEntryQA<QuestionContent>;
  answer?: DialogueEntryQA<AnswerContent>; // quiz의 경우 선택/정답 저장

  image_urls?: string[];
  video_urls?: string[];

  created_at: Date;
  updated_at: Date;
}
