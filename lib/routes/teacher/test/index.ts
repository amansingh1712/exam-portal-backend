import * as express from 'express';
import { TeacherTestRoutes } from './routes';
import { body } from 'express-validator';

const validateCreateTest = [
  body('title', 'Empty Title').notEmpty(),
  body('subjects', 'Invalid length of list of subjects').isArray({ min: 1 }),
  body('subjects.*', 'Invalid Null Subject').notEmpty(),
  body('maxmarks', 'Invalid max marks').notEmpty(),
  body('queTypes', 'Invalid length of list of queTypes').isArray({ min: 1 }),
  body('queTypes.*', 'Invalid queType').notEmpty(),
  body('startTime', 'Invalid Start Time').notEmpty(),
  body('endTime', 'Invalid End Time').notEmpty(),
  body('duration', 'Invalid duration').notEmpty(),
  body('regStartTime', 'Invalid registration start time').notEmpty(),
  body('regEndTime', 'Invalid registration end time').notEmpty(),
  body('resultTime', 'Invalid result time').notEmpty(),
];

export class TeacherTestRouter {
  router: express.Router;
  constructor() {
    this.router = express.Router();
    this.router.post(
      '/createTest',
      validateCreateTest,
      TeacherTestRoutes.createTest
    );
  }
}
