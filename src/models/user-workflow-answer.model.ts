import mongoose, { Model, Schema } from "mongoose";
import { IUserWorkflowAnswer } from "../types";
import { Counter } from "../models";

const UserWorkflowAnswerSchema = new Schema<IUserWorkflowAnswer>(
  {
    log_idx: { type: Number, unique: true, sparse: true },
    user_idx: { type: Number, required: true, ref: "User" },
    project_idx: { type: Number, required: true, ref: "Project" },
    workflow_idx: { type: Number, required: true, ref: "ProjectWorkflow" },
    current_step_number: { type: Number, required: true },
    total_steps: { type: Number, required: true },
    workflow_status: {
      type: String,
      enum: ["active", "completed", "paused", "cancelled"],
      default: "active",
    },
    completion_percentage: { type: Number, default: 0 },
    step_chat_logs: { type: Schema.Types.Mixed, default: null },
    step_media_logs: { type: Schema.Types.Mixed, default: null },
    step_contexts: { type: Schema.Types.Mixed, default: null },
    step_module_logs: { type: Schema.Types.Mixed, default: null },
    step_module_data: { type: Schema.Types.Mixed, default: null },
    step_module_summaries: { type: Schema.Types.Mixed, default: null },
    started_at: { type: Date, default: Date.now },
    last_activity_at: { type: Date, default: Date.now },
    completed_at: { type: Date, default: null },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "started_at", updatedAt: "last_activity_at" },
  }
);

UserWorkflowAnswerSchema.pre<IUserWorkflowAnswer>("save", async function () {
  const doc = this;
  if (!doc.log_idx) {
    const counter = await Counter.findByIdAndUpdate(
      "user_workflow_answer_idx",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).exec();
    if (!counter) throw new Error("Failed to create counter for log_idx");
    doc.log_idx = counter.seq;
  }
});

export const UserWorkflowAnswer: Model<IUserWorkflowAnswer> =
  (mongoose.models.UserWorkflowAnswer as Model<IUserWorkflowAnswer>) ||
  mongoose.model<IUserWorkflowAnswer>(
    "UserWorkflowAnswer",
    UserWorkflowAnswerSchema
  );
