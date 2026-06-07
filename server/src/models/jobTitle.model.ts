import mongoose, { Schema, Document } from 'mongoose';

export interface IJobTitle extends Document {
  titleName: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobTitleSchema: Schema = new Schema<IJobTitle>(
  {
    titleName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const JobTitle = mongoose.model<IJobTitle>('JobTitle', JobTitleSchema);
