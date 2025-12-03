import { QuizType, QuizDifficult } from "../../types";

/**
 * 퀴즈 생성 요청 DTO
 */
export class CreateQuizDto {
  quiz_name: string;
  quiz_type: QuizType;
  question: string;
  objective_answer?: number | null;
  subjective_answer?: string | null;
  explanation?: string | null;
  difficulty?: QuizDifficult;
  status?: boolean | 0 | 1;
  quiz_image_url?: string | null;
  quiz_video_urls?: string[] | null;
  quiz_order?: number;

  constructor(data: Partial<CreateQuizDto>) {
    this.quiz_name = data.quiz_name || "";
    this.quiz_type = data.quiz_type || "OX";
    this.question = data.question || "";
    this.objective_answer = data.objective_answer ?? null;
    this.subjective_answer = data.subjective_answer ?? null;
    this.explanation = data.explanation ?? null;
    this.difficulty = data.difficulty || "중급";
    this.status = data.status !== undefined ? Boolean(data.status) : true;
    this.quiz_image_url = data.quiz_image_url ?? null;
    this.quiz_video_urls = data.quiz_video_urls ?? null;
    this.quiz_order = data.quiz_order ?? 1;
  }
}

/**
 * 퀴즈 업데이트 요청 DTO
 * 모든 필드가 선택적 (Partial Update)
 */
export class UpdateQuizDto {
  quiz_name?: string;
  quiz_type?: QuizType;
  question?: string;
  objective_answer?: number | null;
  subjective_answer?: string | null;
  explanation?: string | null;
  difficulty?: QuizDifficult;
  status?: boolean | 0 | 1;
  quiz_image_url?: string | null;
  quiz_video_urls?: string[] | null;
  quiz_order?: number;

  constructor(data: Partial<UpdateQuizDto>) {
    if (data.quiz_name !== undefined) {
      this.quiz_name = data.quiz_name;
    }
    if (data.quiz_type !== undefined) {
      this.quiz_type = data.quiz_type;
    }
    if (data.question !== undefined) {
      this.question = data.question;
    }
    if (data.objective_answer !== undefined) {
      this.objective_answer = data.objective_answer;
    }
    if (data.subjective_answer !== undefined) {
      this.subjective_answer = data.subjective_answer;
    }
    if (data.explanation !== undefined) {
      this.explanation = data.explanation;
    }
    if (data.difficulty !== undefined) {
      this.difficulty = data.difficulty;
    }
    if (data.status !== undefined) {
      this.status = Boolean(data.status);
    }
    if (data.quiz_image_url !== undefined) {
      this.quiz_image_url = data.quiz_image_url;
    }
    if (data.quiz_video_urls !== undefined) {
      this.quiz_video_urls = data.quiz_video_urls;
    }
    if (data.quiz_order !== undefined) {
      this.quiz_order = data.quiz_order;
    }
  }
}

