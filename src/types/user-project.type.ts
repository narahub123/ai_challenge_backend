import { Document } from "mongoose";

export interface IUserProject extends Document {
  user_project_idx: number; // AUTO_INCREMENT ID
  user_idx: number; // 사용자 ID
  project_idx: number; // 프로젝트 ID
  progress_percent: number; // 진행도 (%)
  session_progress: number[] | null; // 차시별 진행률 (%)
  session_status: string[] | null; // 차시별 상태
  current_session: number; // 현재 차시
  assigned_at: Date; // 배정 시각
  completed_at: Date | null; // 완료 시각
}
