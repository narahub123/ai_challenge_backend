/**
 * 프로젝트 응답 DTO
 * 클라이언트로 반환할 데이터 구조
 */
export class ProjectResponseDto {
  project_idx: number;
  project_name: string;
  project_code: string | null;
  description: string | null;
  grade: string | null;
  subject: string | null;
  lesson_count: string | null;
  target_students: string | null;
  objective: string | null;
  method: string | null;
  session_names: string[] | null;
  max_session: number;
  gamebg_images: string[] | null;
  game_coordinates: any[] | null;
  game_types: string[] | null;
  status: 0 | 1;
  created_at: string;
  updated_at: string;

  constructor(data: ProjectResponseDto) {
    this.project_idx = data.project_idx;
    this.project_name = data.project_name;
    this.project_code = data.project_code;
    this.description = data.description;
    this.grade = data.grade;
    this.subject = data.subject;
    this.lesson_count = data.lesson_count;
    this.target_students = data.target_students;
    this.objective = data.objective;
    this.method = data.method;
    this.session_names = data.session_names;
    this.max_session = data.max_session;
    this.gamebg_images = data.gamebg_images;
    this.game_coordinates = data.game_coordinates;
    this.game_types = data.game_types;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Entity나 Document를 Response DTO로 변환
   */
  static fromEntity(entity: any): ProjectResponseDto {
    // Date를 ISO string으로 변환
    const formatDate = (date: Date | undefined | null): string => {
      if (!date) return new Date().toISOString();
      return date instanceof Date ? date.toISOString() : new Date(date).toISOString();
    };

    // boolean을 0 | 1로 변환
    const booleanToNumber = (value: boolean | undefined | null): 0 | 1 => {
      return value ? 1 : 0;
    };

    return new ProjectResponseDto({
      project_idx: entity.project_idx || 0,
      project_name: entity.project_name || "",
      project_code: entity.project_code ?? null,
      description: entity.description ?? null,
      grade: entity.grade ?? null,
      subject: entity.subject ?? null,
      lesson_count: entity.lesson_count ?? null,
      target_students: entity.target_students ?? null,
      objective: entity.objective ?? null,
      method: entity.method ?? null,
      session_names: entity.session_names ?? null,
      max_session: entity.max_session ?? 1,
      gamebg_images: entity.gamebg_images ?? null,
      game_coordinates: entity.game_coordinates ?? null,
      game_types: entity.game_types ?? null,
      status: booleanToNumber(entity.status),
      created_at: formatDate(entity.created_at),
      updated_at: formatDate(entity.updated_at),
    });
  }
}

