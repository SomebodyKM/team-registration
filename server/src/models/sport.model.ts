import mongoose, { Schema, Document } from 'mongoose';

export interface ISport extends Document {
  sportName: string;
  createdAt: Date;
  updatedAt: Date;
}

const SportSchema: Schema = new Schema<ISport>(
  {
    sportName: {
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

export const Sport = mongoose.model<ISport>('Sport', SportSchema);
