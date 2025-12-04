import { ModuleFormatType } from "../../types";

/**
 * 프로젝트-모듈 링크 항목 응답 DTO
 * Module 정보 + project-module-link 정보
 */
export class ProjectModuleLinkItemDto {
  // project-module-link 정보
  session_number: number;
  module_order: number;

  // Module 정보
  module_idx: number;
  module_name: string;
  description: string | null;
  format_type: ModuleFormatType;
  format_ref_id: number;
  game_type: string | null;
  status: 0 | 1;
  created_at: string;
  updated_at: string;

  constructor(data: ProjectModuleLinkItemDto) {
    this.session_number = data.session_number;
    this.module_order = data.module_order;
    this.module_idx = data.module_idx;
    this.module_name = data.module_name;
    this.description = data.description;
    this.format_type = data.format_type;
    this.format_ref_id = data.format_ref_id;
    this.game_type = data.game_type;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}

/**
 * 프로젝트 + 모듈 링크 정보 응답 DTO
 */
export class ProjectWithModulesResponseDto {
  // Project의 모든 필드
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

  // 차시별 모듈 링크 정보
  sessions: { [sessionNumber: number]: ProjectModuleLinkItemDto[] };

  constructor(data: ProjectWithModulesResponseDto) {
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
    this.sessions = data.sessions;
  }
}

