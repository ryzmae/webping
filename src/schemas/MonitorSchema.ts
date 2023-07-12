import e from "express";
import mongoose from "mongoose";

export interface Monitor extends mongoose.Document {
  url: string;
  interval: number;
}

export const monitorSchema = new mongoose.Schema<Monitor>({
  url: {
    type: String,
    required: true,
    unique: true,
  },
  interval: {
    type: Number,
    required: true,
    min: 1,
    max: 30,
  },
});

export const MonitorModel = mongoose.model<Monitor>("Monitor", monitorSchema);

export const findIdByUrl = async (url: string): Promise<string | null> => {
  const urlobject = await MonitorModel.findOne({ url }).select("_id").exec();
  return urlobject?._id.toString() || null;
};
