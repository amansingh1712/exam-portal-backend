import * as express from 'express';
import { AdminSubjectRoutes } from './routes';
import { body } from 'express-validator';

const validetAddSubject = [body('name', 'Invalid name').notEmpty()];

export class AdminSubjectRouter {
  router: express.Router;
  constructor() {
    this.router = express.Router();
    this.router.post(
      '/addSubject',
      validetAddSubject,
      AdminSubjectRoutes.addSubject
    );
    this.router.post('/removeSubject', AdminSubjectRoutes.subjectRemove);
    this.router.post('/unblockSubject', AdminSubjectRoutes.unblockSubject);
    this.router.get('/getAllSubjects', AdminSubjectRoutes.getAllSubject);
    this.router.get('/getSubjectCount', AdminSubjectRoutes.getStatusCount);
  }
}
