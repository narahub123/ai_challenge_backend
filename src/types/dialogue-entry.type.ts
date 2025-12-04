import { Document } from "mongoose";

export type DialogueUserType = "self" | "opponent";

export type DialogueContentType = "text" | "cardnews" | "quiz" ;

export interface IDialogueEntry extends Document {
  entry_idx: number;
  dialogue_idx: number;
  sender_dialogue_user_idx: number;
  user_type: DialogueUserType;
  content_type: DialogueContentType;
  content: string | Record<string, any>;
  image_urls: string[] | null;
  video_urls: string[] | null;
  created_at: Date;
  updated_at: Date;
}
