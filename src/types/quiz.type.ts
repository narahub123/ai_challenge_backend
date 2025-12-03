import { Document } from "mongoose";

export type QuizType = "OX" | "객관식" | "주관식" | "밸런스게임";

export type QuizDifficult = "초급" | "중급" | "고급";


// Quiz 문서 타입
export interface IQuiz extends Document {
  quiz_idx: number; // AUTO_INCREMENT 시퀀스
  quiz_name: string;
  quiz_type: QuizType;
  question: string;
  objective_answer: number | null;
  subjective_answer: string | null;
  explanation: string | null;
  difficulty: QuizDifficult;
  status: boolean;
  quiz_image_url: string | null;
  quiz_video_urls: string[] | null;
  quiz_order: number;
  created_at: Date;
  updated_at: Date;
}
