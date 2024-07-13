import * as mongoose from 'mongoose';
import { ObjectId } from '../utils/types/types';
export const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    usertype: {
      type: String,
      enum: ['TEACHER', 'STUDENT'],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
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
