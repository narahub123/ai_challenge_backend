import { Quiz } from "../models";
import { IQuiz } from "../types";
import { QuizEntity } from "../entities";

class QuizRepository {
  // 전체 퀴즈 개수 조회
  async count(): Promise<number> {
    return await Quiz.countDocuments().exec();
  }

  // 모든 퀴즈 조회 (Pagination 지원)
  async findAll(page: number = 1, limit: number = 10): Promise<IQuiz[]> {
    const skip = (page - 1) * limit;
    return await Quiz.find()
      .sort({ quiz_idx: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
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

  // 퀴즈 타입별 조회
  async findByQuizType(quizType: string): Promise<IQuiz[]> {
    return await Quiz.find({ quiz_type: quizType })
      .sort({ quiz_idx: -1 })
      .exec();
  }

  // 난이도별 조회
  async findByDifficulty(difficulty: string): Promise<IQuiz[]> {
    return await Quiz.find({ difficulty })
      .sort({ quiz_idx: -1 })
      .exec();
  }

  // 상태별 조회
  async findByStatus(status: boolean): Promise<IQuiz[]> {
    return await Quiz.find({ status }).sort({ quiz_idx: -1 }).exec();
  }
}

export default new QuizRepository();
