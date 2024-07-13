import * as express from 'express';
import { AdminTeacherRoutes } from './routes';
import { body } from 'express-validator';
const validateTeacherRegister = [
  body('username', 'Invalid name').notEmpty(),
  body('email', 'Invalid Email Address').isEmail().notEmpty(),
  body('password', 'Invalid Password').isLength({ min: 5, max: 20 }),
];
export class AdminTeacherRouter {
  router: express.Router;
  constructor() {
    this.router = express.Router();
    this.router.post(
      '/register',
      validateTeacherRegister,
      AdminTeacherRoutes.teacherRegister
    );
    this.router.get('/getAllTeachers', AdminTeacherRoutes.getAllTeacher);
    this.router.get(
      '/getTeacherStatusCount',
      AdminTeacherRoutes.getTeacherStatusCount
    );
  }
}
