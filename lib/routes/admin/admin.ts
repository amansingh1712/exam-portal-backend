import * as express from 'express';
import { AdminSubjectRouter } from './subject';
import { AdminTeacherRouter } from './teacher.ts';

export class AdminRouter {
  router: express.Router;
  constructor() {
    this.router = express.Router();
    this.router.use('/subjects', new AdminSubjectRouter().router);
    this.router.use('/teachers', new AdminTeacherRouter().router);
  }
}
