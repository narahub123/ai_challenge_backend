import { Document } from "mongoose";

export type WorkflowStatus = "active" | "completed" | "paused" | "cancelled";

export interface IUserWorkflowAnswer extends Document {
  log_idx: number;
  user_idx: number;
  project_idx: number;
  workflow_idx: number;
  current_step_number: number;
  total_steps: number;
  workflow_status: WorkflowStatus;
  completion_percentage: number;
  step_chat_logs: Record<string, number[]> | null;
  step_media_logs: Record<string, number[]> | null;
  step_contexts: Record<string, string> | null;
  step_module_logs: Record<string, Record<string, number[]>> | null;
  step_module_data: Record<string, Record<string, any>> | null;
  step_module_summaries: Record<string, Record<string, string>> | null;
  started_at: Date;
  last_activity_at: Date;
  completed_at: Date | null;
}
