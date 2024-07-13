import * as express from 'express';
import { AuthRoutes } from './routes';
import { body } from 'express-validator';

const validateAdminLogin = [
  body('username', 'Invalid username').notEmpty(),
  body('password', 'Invalid password').isLength({ min: 4, max: 20 }),
];

const validateStudentRegister = [
  body('username', 'Invalid name').notEmpty(),
  body('email', 'Invalid Email Address').isEmail().notEmpty(),
  body('password', 'Invalid Password').isLength({ min: 5, max: 20 }),
];

const validateUserLogin = [
  body('email', 'Invalid email address').isEmail().notEmpty(),
  body('password', 'Invalid password').isLength({ min: 4, max: 20 }),
];

export class AuthRouter {
  router: express.Router;

  constructor() {
    this.router = express.Router();
    this.router.post('/admin/login', validateAdminLogin, AuthRoutes.adminLogin);
    this.router.post('/login', validateUserLogin, AuthRoutes.userLogin);
    this.router.post(
      '/register',
      validateStudentRegister,
      AuthRoutes.studentRegister
    );
  }
}
