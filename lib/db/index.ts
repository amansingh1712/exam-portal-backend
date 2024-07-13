import * as mongoose from 'mongoose';
import { userSchema } from './user';
import { adminSchema } from './admin';
import { answersheetSchema } from './answersheet';
import { questionSchema } from './question';
import { subjectSchema } from './subject';
import { testSchema } from './test';
import { testRegistrationSchema } from './testRegistration';

export const User = mongoose.model('User', userSchema);

export const Admin = mongoose.model('Admin', adminSchema);

export const Answersheet = mongoose.model('Answersheet', answersheetSchema);

export const Question = mongoose.model('Question', questionSchema);

export const Subject = mongoose.model('Subject', subjectSchema);

export const Test = mongoose.model('Test', testSchema);

export const TestRegistration = mongoose.model(
  'TestRegistration',
  testRegistrationSchema
);
