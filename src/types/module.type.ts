import { Document } from "mongoose";

export type ModuleFormatType =
  | "chatbot"
  | "quiz"
  | "card_news"
  | "survey"
  | "learning_questions"
  | "workflow"
  | "game";

// Module 인터페이스
export interface IModule extends Document {
  module_idx: number;
  module_name: string;
  description: string | null;
  format_type: ModuleFormatType;
  format_ref_id: number;
  module_order: number;
  game_type: string | null;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}
