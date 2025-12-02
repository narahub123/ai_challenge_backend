import { Document } from "mongoose";
import { QuizType } from "../types";

export interface IUserQuizAnswer extends Document {
  answer_idx: number; // AUTO_INCREMENT ID
  user_idx: number; // 사용자 ID
  quiz_idx: number; // 퀴즈 ID
  project_idx: number; // 프로젝트 ID
  answer_type: QuizType;
  answer: string; // 실제 답안
  project_orderidx: number; // 프로젝트 내 순서
  is_correct: boolean | null;
  submitted_at: Date;
}
