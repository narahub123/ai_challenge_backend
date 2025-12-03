import { QuizType, QuizDifficult } from "../../types";

/**
 * 퀴즈 응답 DTO
 * 클라이언트로 반환할 데이터 구조
 */
export class QuizResponseDto {
  quiz_idx: number;
  quiz_name: string;
  quiz_type: QuizType;
  question: string;
  objective_answer: number | null;
  subjective_answer: string | null;
  explanation: string | null;
  difficulty: QuizDifficult;
  status: 0 | 1;
  quiz_image_url: string | null;
  quiz_video_urls: string[] | null;
  quiz_order: number;
  created_at: string;
  updated_at: string;

  constructor(data: QuizResponseDto) {
    this.quiz_idx = data.quiz_idx;
    this.quiz_name = data.quiz_name;
    this.quiz_type = data.quiz_type;
    this.question = data.question;
    this.objective_answer = data.objective_answer;
    this.subjective_answer = data.subjective_answer;
    this.explanation = data.explanation;
    this.difficulty = data.difficulty;
    this.status = data.status;
    this.quiz_image_url = data.quiz_image_url;
    this.quiz_video_urls = data.quiz_video_urls;
    this.quiz_order = data.quiz_order;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Entity나 Document를 Response DTO로 변환
   */
  static fromEntity(entity: any): QuizResponseDto {
    // Date를 ISO string으로 변환
    const formatDate = (date: Date | undefined | null): string => {
      if (!date) return new Date().toISOString();
      return date instanceof Date ? date.toISOString() : new Date(date).toISOString();
    };

    // boolean을 0 | 1로 변환
    const booleanToNumber = (value: boolean | undefined | null): 0 | 1 => {
      return value ? 1 : 0;
    };

    return new QuizResponseDto({
      quiz_idx: entity.quiz_idx || 0,
      quiz_name: entity.quiz_name || "",
      quiz_type: entity.quiz_type || "OX",
      question: entity.question || "",
      objective_answer: entity.objective_answer ?? null,
      subjective_answer: entity.subjective_answer ?? null,
      explanation: entity.explanation ?? null,
      difficulty: entity.difficulty || "중급",
      status: booleanToNumber(entity.status),
      quiz_image_url: entity.quiz_image_url ?? null,
      quiz_video_urls: entity.quiz_video_urls || null,
      quiz_order: entity.quiz_order || 1,
      created_at: formatDate(entity.created_at),
      updated_at: formatDate(entity.updated_at),
    });
  }
}

