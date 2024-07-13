import * as express from 'express';
import { TeacherQuestionRouter } from './question';
import { TeacherTestRouter } from './test';

export class TeacherRouter {
  router: express.Router;

  constructor() {
    this.router = express.Router();
    this.router.use('/question', new TeacherQuestionRouter().router);
    this.router.use('/test', new TeacherTestRouter().router);
  }
}
