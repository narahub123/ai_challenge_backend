import { QuizType, QuizDifficult } from "../types";

/**
 * Quiz 도메인 엔티티
 * DB 스키마와 독립적인 순수 도메인 객체
 */
export class QuizEntity {
  quiz_idx?: number;
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
  created_at?: Date;
  updated_at?: Date;

  constructor(data: Partial<QuizEntity>) {
    this.quiz_idx = data.quiz_idx;
    this.quiz_name = data.quiz_name || "";
    this.quiz_type = data.quiz_type || "OX";
    this.question = data.question || "";
    this.objective_answer = data.objective_answer ?? null;
    this.subjective_answer = data.subjective_answer ?? null;
    this.explanation = data.explanation ?? null;
    this.difficulty = data.difficulty || "중급";
    // status를 boolean으로 변환 (0/1도 처리)
    this.status = data.status !== undefined ? Boolean(data.status) : true;
    this.quiz_image_url = data.quiz_image_url ?? null;
    this.quiz_video_urls = data.quiz_video_urls ?? null;
    this.quiz_order = data.quiz_order ?? 1;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Mongoose Document를 Entity로 변환
   */
  static fromDocument(document: any): QuizEntity {
    return new QuizEntity({
      quiz_idx: document.quiz_idx,
      quiz_name: document.quiz_name,
      quiz_type: document.quiz_type,
      question: document.question,
      objective_answer: document.objective_answer,
      subjective_answer: document.subjective_answer,
      explanation: document.explanation,
      difficulty: document.difficulty,
      status: document.status,
      quiz_image_url: document.quiz_image_url,
      quiz_video_urls: document.quiz_video_urls,
      quiz_order: document.quiz_order,
      created_at: document.created_at,
      updated_at: document.updated_at,
    });
  }

  /**
   * Entity를 일반 객체로 변환
   */
  toPlainObject(): Record<string, any> {
    return {
      quiz_idx: this.quiz_idx,
      quiz_name: this.quiz_name,
      quiz_type: this.quiz_type,
      question: this.question,
      objective_answer: this.objective_answer,
      subjective_answer: this.subjective_answer,
      explanation: this.explanation,
      difficulty: this.difficulty,
      status: this.status,
      quiz_image_url: this.quiz_image_url,
      quiz_video_urls: this.quiz_video_urls,
      quiz_order: this.quiz_order,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

