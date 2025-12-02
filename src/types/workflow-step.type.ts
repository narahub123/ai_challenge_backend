import { Document } from "mongoose";

export type WorkflowInheritMode = "all" | "recent" | "summary" | "none";

export interface IWorkflowStep extends Document {
  step_idx: number;
  workflow_idx: number;
  step_number: number;
  step_name: string;
  inherit_modules: Record<string, any>[] | null;
  reference_step_idx: number | null;
  inherit_content_types: string[] | null;
  inherit_history_count: number;
  inherit_mode: WorkflowInheritMode;
  use_chatbot_idx: number | null;
  completion_condition: Record<string, any> | null;
  auto_advance: boolean;
  status: boolean;
  created_at: Date;
}
