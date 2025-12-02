import { Document } from "mongoose";

// Project 인터페이스
export interface IProject extends Document {
  project_idx: number;
  project_name: string;
  project_code: string | null; // 선생님용 배포 코드
  description: string | null;
  grade: string | null;
  subject: string | null;
  lesson_count: string | null;
  target_students: string | null;
  objective: string | null;
  method: string | null;
  session_names: string[] | null; // JSON 배열
  max_session: number;
  gamebg_images: string[] | null; // JSON 배열
  game_coordinates: any[] | null; // JSON 자유형 배열
  game_types: string[] | null; // JSON 배열
  status: boolean;
  created_at: Date;
  updated_at: Date;
}
