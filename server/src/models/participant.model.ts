import mongoose, { Schema, Document } from 'mongoose';

export interface IParticipant extends Document {
  schoolId: mongoose.Types.ObjectId;
  fullName: string;
  idNumber: string;
  birthday: Date;
  jobTitleId: mongoose.Types.ObjectId;
  sportId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ParticipantSchema: Schema = new Schema<IParticipant>(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    idNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    birthday: {
      type: Date,
      required: true,
    },
    jobTitleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobTitle',
      required: true,
    },
    sportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sport',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Participant = mongoose.model<IParticipant>('Participant', ParticipantSchema);
