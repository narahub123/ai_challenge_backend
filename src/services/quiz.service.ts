import quizRepository from "../repositories/quiz.repository";
import { QuizEntity } from "../entities";
import { CreateQuizDto, UpdateQuizDto } from "../dtos/request";
import { QuizResponseDto, PaginationDto } from "../dtos/response";
import { AppError } from "../middleware";
import { uploadFile } from "../utils/fileUpload.util";

interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationDto;
}

class QuizService {
  // 모든 퀴즈 조회 (Pagination 지원)
  async getAllQuizzes(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<QuizResponseDto>> {
    // 페이지와 limit 유효성 검증
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit)); // 최대 100개로 제한

    // 전체 개수와 데이터 조회
    const [total, documents] = await Promise.all([
      quizRepository.count(),
      quizRepository.findAll(validPage, validLimit),
    ]);

    const data = documents.map((doc) => QuizResponseDto.fromEntity(doc));
    const pagination = new PaginationDto(total, validPage, validLimit);

    return {
      data,
      pagination,
    };
  }

  // 퀴즈 상세 조회
  async getQuizById(quizIdx: number): Promise<QuizResponseDto> {
    const document = await quizRepository.findById(quizIdx);

    if (!document) {
      throw new AppError("퀴즈를 찾을 수 없습니다.", 404);
    }

    return QuizResponseDto.fromEntity(document);
  }

  // 퀴즈 생성 (File 처리 포함)
  async createQuiz(
    dto: CreateQuizDto,
    files?: {
      quiz_image_url?: Express.Multer.File[];
      quiz_video_urls?: Express.Multer.File[];
    }
  ): Promise<QuizResponseDto> {
    // 필수 필드 검증
    if (!dto.quiz_name) {
      throw new AppError("퀴즈 이름은 필수입니다.", 400);
    }

    if (!dto.question) {
      throw new AppError("질문은 필수입니다.", 400);
    }

    if (!dto.quiz_type) {
      throw new AppError("퀴즈 타입은 필수입니다.", 400);
    }

    // File 처리: quiz_image_url
    if (files?.quiz_image_url && files.quiz_image_url.length > 0) {
      // multer로 받은 File을 업로드하여 URL로 변환
      const imageUrl = await uploadFile(files.quiz_image_url[0]);
      dto.quiz_image_url = imageUrl;
    } else if (dto.quiz_image_url && typeof dto.quiz_image_url === "string") {
      // string인 경우 그대로 사용
      dto.quiz_image_url = dto.quiz_image_url;
    }

    // File 처리: quiz_video_urls
    if (files?.quiz_video_urls && files.quiz_video_urls.length > 0) {
      // multer로 받은 File 배열을 업로드하여 URL 배열로 변환
      const videoUrls = await Promise.all(
        files.quiz_video_urls.map(async (file) => {
          return await uploadFile(file);
        })
      );
      dto.quiz_video_urls = videoUrls;
    } else if (dto.quiz_video_urls && Array.isArray(dto.quiz_video_urls)) {
      dto.quiz_video_urls = dto.quiz_video_urls as string[];
    }

    // DTO → Entity 변환 (status를 boolean으로 명시적 변환)
    const entityData = {
      ...dto,
      status: dto.status !== undefined ? Boolean(dto.status) : true,
    };
    const entity = new QuizEntity(entityData);

    // Repository에 Entity 전달하여 생성
    const document = await quizRepository.create(entity);

    // Document → Response DTO 변환
    return QuizResponseDto.fromEntity(document);
  }

  // 퀴즈 업데이트 (File 처리 포함)
  async updateQuiz(
    quizIdx: number,
    dto: UpdateQuizDto,
    files?: {
      quiz_image_url?: Express.Multer.File[];
      quiz_video_urls?: Express.Multer.File[];
    }
  ): Promise<QuizResponseDto> {
    // 존재 여부 확인
    const existingQuiz = await quizRepository.findById(quizIdx);
    if (!existingQuiz) {
      throw new AppError("퀴즈를 찾을 수 없습니다.", 404);
    }

    // File 처리: quiz_image_url
    if (files?.quiz_image_url && files.quiz_image_url.length > 0) {
      // multer로 받은 File을 업로드하여 URL로 변환
      const imageUrl = await uploadFile(files.quiz_image_url[0]);
      dto.quiz_image_url = imageUrl;
    } else if (dto.quiz_image_url && typeof dto.quiz_image_url === "string") {
      dto.quiz_image_url = dto.quiz_image_url;
    }

    // File 처리: quiz_video_urls
    if (files?.quiz_video_urls && files.quiz_video_urls.length > 0) {
      // multer로 받은 File 배열을 업로드하여 URL 배열로 변환
      const videoUrls = await Promise.all(
        files.quiz_video_urls.map(async (file) => {
          return await uploadFile(file);
        })
      );
      dto.quiz_video_urls = videoUrls;
    } else if (dto.quiz_video_urls && Array.isArray(dto.quiz_video_urls)) {
      dto.quiz_video_urls = dto.quiz_video_urls as string[];
    }

    // DTO → Partial Entity 변환 (status를 boolean으로 명시적 변환)
    const updateData = {
      ...dto,
      status: dto.status !== undefined ? Boolean(dto.status) : undefined,
    };

    // Repository에 전달하여 업데이트
    const updatedDocument = await quizRepository.update(quizIdx, updateData);

    if (!updatedDocument) {
      throw new AppError("퀴즈 업데이트에 실패했습니다.", 500);
    }

    // Document → Response DTO 변환
    return QuizResponseDto.fromEntity(updatedDocument);
  }

  // 퀴즈 삭제
  async deleteQuiz(quizIdx: number): Promise<void> {
    const existingQuiz = await quizRepository.findById(quizIdx);
    if (!existingQuiz) {
      throw new AppError("퀴즈를 찾을 수 없습니다.", 404);
    }

    const deleted = await quizRepository.delete(quizIdx);
    if (!deleted) {
      throw new AppError("퀴즈 삭제에 실패했습니다.", 500);
    }
  }

  // 퀴즈 타입별 조회
  async getQuizzesByQuizType(quizType: string): Promise<QuizResponseDto[]> {
    const documents = await quizRepository.findByQuizType(quizType);
    return documents.map((doc) => QuizResponseDto.fromEntity(doc));
  }

  // 난이도별 조회
  async getQuizzesByDifficulty(difficulty: string): Promise<QuizResponseDto[]> {
    const documents = await quizRepository.findByDifficulty(difficulty);
    return documents.map((doc) => QuizResponseDto.fromEntity(doc));
  }

  // 상태별 조회
  async getQuizzesByStatus(status: boolean): Promise<QuizResponseDto[]> {
    const documents = await quizRepository.findByStatus(status);
    return documents.map((doc) => QuizResponseDto.fromEntity(doc));
  }
}

export default new QuizService();
