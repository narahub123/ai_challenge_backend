import { Document } from "mongoose";

export interface IProjectWorkflow extends Document {
  workflow_idx: number;
  workflow_name: string;
  description: string | null;
  total_steps: number;
  workflow_config: Record<string, any> | null;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}
