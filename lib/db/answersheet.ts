import * as mongoose from 'mongoose';
import { ObjectId } from '../utils/types/types';

export const answersheetSchema = new mongoose.Schema(
  {
    test: {
      type: ObjectId,
      ref: 'testModel',
      required: true,
    },
    student: {
      type: ObjectId,
      ref: 'userModel',
      required: true,
    },
    score: {
      type: Number,
      default: 0,
      required: true,
    },
    answers: [
      {
        type: String,
      },
    ],
    startTime: {
      type: Date,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
