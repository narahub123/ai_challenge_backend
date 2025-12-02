import mongoose, { Model, Schema } from "mongoose";
import { IProjectWorkflow } from "../types";
import { Counter } from "../models";

const ProjectWorkflowSchema = new Schema<IProjectWorkflow>(
  {
    workflow_idx: { type: Number, unique: true, sparse: true },
    workflow_name: { type: String, required: true },
    description: { type: String, default: null },
    total_steps: { type: Number, default: 1 },
    workflow_config: { type: Schema.Types.Mixed, default: null },
    status: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

ProjectWorkflowSchema.pre<IProjectWorkflow>("save", async function () {
  const doc = this;
  if (!doc.workflow_idx) {
    const counter = await Counter.findByIdAndUpdate(
      "workflow_idx",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).exec();
    if (!counter) throw new Error("Failed to create counter for workflow_idx");
    doc.workflow_idx = counter.seq;
  }
});

export const ProjectWorkflow: Model<IProjectWorkflow> =
  (mongoose.models.ProjectWorkflow as Model<IProjectWorkflow>) ||
  mongoose.model<IProjectWorkflow>("ProjectWorkflow", ProjectWorkflowSchema);
