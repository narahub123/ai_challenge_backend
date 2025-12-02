import { Document } from "mongoose";

// Counter 스키마 (quiz_idx 시퀀스 관리용)
export interface ICounter extends Document<string> {
  _id: string;
  seq: number;
}
