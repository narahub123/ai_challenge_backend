import mongoose, { Model, Schema } from "mongoose";
import { IWorkflowStep } from "../types";
import { Counter } from "../models";

const WorkflowStepSchema = new Schema<IWorkflowStep>(
  {
    step_idx: { type: Number, unique: true, sparse: true },
    workflow_idx: { type: Number, required: true, ref: "ProjectWorkflow" },
    step_number: { type: Number, required: true },
    step_name: { type: String, required: true },
    inherit_modules: { type: [Schema.Types.Mixed], default: null },
    reference_step_idx: { type: Number, default: null },
    inherit_content_types: { type: [String], default: null },
    inherit_history_count: { type: Number, default: 5 },
    inherit_mode: {
      type: String,
      enum: ["all", "recent", "summary", "none"],
      default: "none",
    },
    use_chatbot_idx: { type: Number, default: null },
    completion_condition: { type: Schema.Types.Mixed, default: null },
    auto_advance: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
  },
  { versionKey: false, timestamps: { createdAt: "created_at" } }
);

WorkflowStepSchema.pre<IWorkflowStep>("save", async function () {
  const doc = this;
  if (!doc.step_idx) {
    const counter = await Counter.findByIdAndUpdate(
      "workflow_step_idx",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).exec();
    if (!counter) throw new Error("Failed to create counter for step_idx");
    doc.step_idx = counter.seq;
  }
});

export const WorkflowStep: Model<IWorkflowStep> =
  (mongoose.models.WorkflowStep as Model<IWorkflowStep>) ||
  mongoose.model<IWorkflowStep>("WorkflowStep", WorkflowStepSchema);
