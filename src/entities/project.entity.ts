/**
 * Project 도메인 엔티티
 * DB 스키마와 독립적인 순수 도메인 객체
 */
export class ProjectEntity {
  project_idx?: number;
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
  status: boolean;
  created_at?: Date;
  updated_at?: Date;

  constructor(data: Partial<ProjectEntity>) {
    this.project_idx = data.project_idx;
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
    // status를 boolean으로 변환 (0/1도 처리)
    this.status = data.status !== undefined ? Boolean(data.status) : true;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Mongoose Document를 Entity로 변환
   */
  static fromDocument(document: any): ProjectEntity {
    return new ProjectEntity({
      project_idx: document.project_idx,
      project_name: document.project_name,
      project_code: document.project_code,
      description: document.description,
      grade: document.grade,
      subject: document.subject,
      lesson_count: document.lesson_count,
      target_students: document.target_students,
      objective: document.objective,
      method: document.method,
      session_names: document.session_names,
      max_session: document.max_session,
      gamebg_images: document.gamebg_images,
      game_coordinates: document.game_coordinates,
      game_types: document.game_types,
      status: document.status,
      created_at: document.created_at,
      updated_at: document.updated_at,
    });
  }

  /**
   * Entity를 일반 객체로 변환
   */
  toPlainObject(): Record<string, any> {
    return {
      project_idx: this.project_idx,
      project_name: this.project_name,
      project_code: this.project_code,
      description: this.description,
      grade: this.grade,
      subject: this.subject,
      lesson_count: this.lesson_count,
      target_students: this.target_students,
      objective: this.objective,
      method: this.method,
      session_names: this.session_names,
      max_session: this.max_session,
      gamebg_images: this.gamebg_images,
      game_coordinates: this.game_coordinates,
      game_types: this.game_types,
      status: this.status,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

