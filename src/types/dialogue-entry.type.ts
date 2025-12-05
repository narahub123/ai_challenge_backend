import { Document } from "mongoose";

// content 타입
export type ContentType = "text" | "card-news" | "quiz";

// CardNews 참조
export interface CardNewsContent {
  card_news_idx: number;
}


export interface QuizContent {
  quiz_idx: number;
}


// text 타입
export type TextContent = string;

// question / answer 공용 content 타입
export type QuestionContent = TextContent | CardNewsContent | QuizContent;
export type AnswerContent = TextContent | CardNewsContent;

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
  answer: DialogueEntryQA<AnswerContent> | null;

  image_urls: string[] | null;
  video_urls: string[] | null;

  created_at: Date;
  updated_at: Date;
}
