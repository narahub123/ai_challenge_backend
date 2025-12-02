import { Document } from "mongoose";

export interface IDialogueUser extends Document {
  dialogue_user_idx: number; // Dialogue 내 유니크 ID
  name: string; // 화면 표시 이름
  avatar_url: string | null; // 아바타 URL
  created_at: Date;
  updated_at: Date;
}
