import * as mongoose from 'mongoose';
import { ObjectId } from '../utils/types/types';

export const questionSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
    },
    options: [
      {
        type: String,
        required: true,
      },
    ],
    subject: {
      type: ObjectId,
      ref: 'subjectModel',
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    marks: {
      type: Number,
      requried: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    createdBy: {
      type: ObjectId,
      ref: 'userModel',
    },
  },
  {
    timestamps: {},
  }
);
