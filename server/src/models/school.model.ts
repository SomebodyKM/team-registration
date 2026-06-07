import mongoose, { Schema, Document } from 'mongoose';

export interface ISchool extends Document {
  schoolName: string;
  password: string;
  isFirstLogin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SchoolSchema: Schema = new Schema<ISchool>(
  {
    schoolName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    isFirstLogin: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const School = mongoose.model<ISchool>('School', SchoolSchema);
