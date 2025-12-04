import { Document } from "mongoose";

// ProjectModuleLink 인터페이스
export interface IProjectModuleLink extends Document {
  project_idx: number; // 프로젝트 ID
  module_idx: number; // 모듈 ID
  session_number: number; // 적용 차시
  module_order: number; // 차시 내 순서
}

