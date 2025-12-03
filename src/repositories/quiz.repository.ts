import { Quiz } from "../models";
import { IQuiz } from "../types";
import { QuizEntity } from "../entities";

class QuizRepository {
  // 전체 퀴즈 개수 조회 (필터 포함)
  async count(filters?: {
    search?: string;
    quiz_type?: string;
    difficulty?: string;
    status?: boolean;
  }): Promise<number> {
    const query = this.buildQuery(filters);
    return await Quiz.countDocuments(query).exec();
  }

  // 모든 퀴즈 조회 (Pagination 및 필터링 지원)
  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
      quiz_type?: string;
      difficulty?: string;
      status?: boolean;
    }
  ): Promise<IQuiz[]> {
    const skip = (page - 1) * limit;
    const query = this.buildQuery(filters);
    
    return await Quiz.find(query)
      .sort({ quiz_idx: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  // 필터 쿼리 빌드
  private buildQuery(filters?: {
    search?: string;
    quiz_type?: string;
    difficulty?: string;
    status?: boolean;
  }): any {
    const query: any = {};

    if (filters) {
      // 검색: quiz_name, question에서 검색
      if (filters.search) {
        query.$or = [
          { quiz_name: { $regex: filters.search, $options: "i" } },
          { question: { $regex: filters.search, $options: "i" } },
        ];
      }

      // 퀴즈 타입 필터
      if (filters.quiz_type) {
        query.quiz_type = filters.quiz_type;
      }

      // 난이도 필터
      if (filters.difficulty) {
        query.difficulty = filters.difficulty;
      }

      // 상태 필터
      if (filters.status !== undefined) {
        query.status = filters.status;
      }
    }

    return query;
  }

  // ID로 퀴즈 조회
  async findById(quizIdx: number): Promise<IQuiz | null> {
    return await Quiz.findOne({ quiz_idx: quizIdx }).exec();
  }

  // 퀴즈 생성 (Entity 받아서 처리)
  async create(entity: QuizEntity): Promise<IQuiz> {
    const quiz = new Quiz(entity.toPlainObject());
    return await quiz.save();
  }

  // 퀴즈 업데이트 (Entity 받아서 처리)
  async update(quizIdx: number, entity: Partial<QuizEntity>): Promise<IQuiz | null> {
    const updateData =
      entity instanceof QuizEntity ? entity.toPlainObject() : entity;

    return await Quiz.findOneAndUpdate(
      { quiz_idx: quizIdx },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  // 퀴즈 삭제
  async delete(quizIdx: number): Promise<boolean> {
    const result = await Quiz.findOneAndDelete({ quiz_idx: quizIdx }).exec();
    return !!result;
  }

}

export default new QuizRepository();
