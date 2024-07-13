import * as mongoose from 'mongoose';
import { ObjectId } from '../utils/types/types';
export const testRegistrationSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'userModel',
    },
    test: {
      type: ObjectId,
      ref: 'testModel',
    },
  },
  {
    timestamps: true,
  }
);
