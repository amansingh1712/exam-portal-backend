import * as mongoose from 'mongoose';
import { ObjectId } from '../utils/types/types';

export const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    createdBy: {
      type: ObjectId,
      ref: 'adminModel',
    },
  },
  {
    timestamps: true,
  }
);
