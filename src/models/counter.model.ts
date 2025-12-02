import mongoose, { Model, Schema } from "mongoose";
import { ICounter } from "../types";

const CounterSchema = new Schema<ICounter>(
  { _id: { type: String, required: true }, seq: { type: Number, default: 0 } },
  { versionKey: false }
);

export const Counter: Model<ICounter> =
  (mongoose.models.Counter as Model<ICounter>) ||
  mongoose.model<ICounter>("Counter", CounterSchema);
