import { Document } from "mongoose";

export type GenderType = "남" | "여" | "기타" | null;

export interface IUser extends Document {
  user_idx: number; // AUTO_INCREMENT ID
  user_id: string; // 로그인용 사용자 ID
  original_user_id: string | null; // 원본 사용자 ID (team 제외)
  uuid: string; // UUID 고유 식별자
  team: string | null; // 팀 고유 ID
  nickname: string | null; // 닉네임 (한글/특수문자 포함 가능)
  school: string | null; // 학교명
  grade: number | null; // 학년
  class_number: number | null; // 반 정보
  gender: GenderType;
  created_at: Date;
  updated_at: Date;
}
