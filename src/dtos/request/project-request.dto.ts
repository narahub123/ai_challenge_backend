/**
 * 프로젝트 생성 요청 DTO
 */
export class CreateProjectDto {
  project_name: string;
  project_code?: string | null;
  description?: string | null;
  grade?: string | null;
  subject?: string | null;
  lesson_count?: string | null;
  target_students?: string | null;
  objective?: string | null;
  method?: string | null;
  session_names?: string[] | null;
  max_session?: number;
  gamebg_images?: string[] | null; // File 또는 string 배열
  game_coordinates?: any[] | null;
  game_types?: string[] | null;
  status?: boolean | 0 | 1;

  constructor(data: Partial<CreateProjectDto>) {
    this.project_name = data.project_name || "";
    this.project_code = data.project_code ?? null;
    this.description = data.description ?? null;
    this.grade = data.grade ?? null;
    this.subject = data.subject ?? null;
    this.lesson_count = data.lesson_count ?? null;
    this.target_students = data.target_students ?? null;
    this.objective = data.objective ?? null;
    this.method = data.method ?? null;
    this.session_names = data.session_names ?? null;
    this.max_session = data.max_session ?? 1;
    this.gamebg_images = data.gamebg_images ?? null;
    this.game_coordinates = data.game_coordinates ?? null;
    this.game_types = data.game_types ?? null;
    this.status = data.status !== undefined ? Boolean(data.status) : true;
  }
}

/**
 * 프로젝트 업데이트 요청 DTO
 * 모든 필드가 선택적 (Partial Update)
 */
export class UpdateProjectDto {
  project_name?: string;
  project_code?: string | null;
  description?: string | null;
  grade?: string | null;
  subject?: string | null;
  lesson_count?: string | null;
  target_students?: string | null;
  objective?: string | null;
  method?: string | null;
  session_names?: string[] | null;
  max_session?: number;
  gamebg_images?: string[] | null; // File 또는 string 배열
  game_coordinates?: any[] | null;
  game_types?: string[] | null;
  status?: boolean | 0 | 1;

  constructor(data: Partial<UpdateProjectDto>) {
    if (data.project_name !== undefined) {
      this.project_name = data.project_name;
    }
    if (data.project_code !== undefined) {
      this.project_code = data.project_code;
    }
    if (data.description !== undefined) {
      this.description = data.description;
    }
    if (data.grade !== undefined) {
      this.grade = data.grade;
    }
    if (data.subject !== undefined) {
      this.subject = data.subject;
    }
    if (data.lesson_count !== undefined) {
      this.lesson_count = data.lesson_count;
    }
    if (data.target_students !== undefined) {
      this.target_students = data.target_students;
    }
    if (data.objective !== undefined) {
      this.objective = data.objective;
    }
    if (data.method !== undefined) {
      this.method = data.method;
    }
    if (data.session_names !== undefined) {
      this.session_names = data.session_names;
    }
    if (data.max_session !== undefined) {
      this.max_session = data.max_session;
    }
    if (data.gamebg_images !== undefined) {
      this.gamebg_images = data.gamebg_images;
    }
    if (data.game_coordinates !== undefined) {
      this.game_coordinates = data.game_coordinates;
    }
    if (data.game_types !== undefined) {
      this.game_types = data.game_types;
    }
    if (data.status !== undefined) {
      this.status = Boolean(data.status);
    }
  }
}

