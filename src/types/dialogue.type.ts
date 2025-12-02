import { Document, Types } from "mongoose";

export interface IDialogue extends Document {
  dialogue_idx: number;
  title: string | null;
  description: string | null;
  participants: number[]; // DialogueUser 참조
  status: boolean;
  created_at: Date;
  updated_at: Date;
}
