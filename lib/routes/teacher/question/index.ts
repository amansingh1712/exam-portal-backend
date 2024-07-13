import * as express from 'express';
import { TeacherQuestionRoutes } from './routes';
import { body, check } from 'express-validator';

const validateAddQuestion = [
  body('body', 'Empty Question').notEmpty(),
  body('marks', 'Invalid marks').isInt({
    min: 1,
    max: 4,
  }),
  body('options', 'Invalid length of list of options').isArray({
    min: 1,
    max: 4,
  }),
  body('options.*', 'Invalid Null option').isLength({ min: 1, max: 256 }),
  body('subject', 'Invalid Subject').notEmpty(),
  body('answer', 'Invalid Answer').notEmpty(),
];
const validateUpdateQuestion = [
  ...validateAddQuestion,
  body('id', 'Id not found').notEmpty(),
];

const validateSearchQuestion = [check('query', 'Empty Query').notEmpty()];

export class TeacherQuestionRouter {
  router: express.Router;
  constructor() {
    this.router = express.Router();
    this.router.post(
      '/addQuestion',
      validateAddQuestion,
      TeacherQuestionRoutes.addQuestion
    );
    this.router.post(
      '/searchQuestion',
      validateSearchQuestion,
      TeacherQuestionRoutes.searchQuestion
    );
    this.router.post(
      '/updateQuestion',
      validateUpdateQuestion,
      TeacherQuestionRoutes.updateQuestion
    );
    this.router.post(
      '/getQuestion',
      [body('id', 'ID not found').notEmpty()],
      TeacherQuestionRoutes.getQuestionById
    );
    this.router.post(
      '/changeQuestionStatus',
      [
        body('id', 'Id not found').notEmpty(),
        body('status', 'Status not found').isBoolean(),
      ],
      TeacherQuestionRoutes.changeQuestionStatus
    );
    this.router.post(
      '/getAnswer',
      [body('id', 'ID not found').notEmpty()],
      TeacherQuestionRoutes.getAnsByQuestionId
    );
    this.router.post(
      '/getQuestionAnswer',
      [body('id', 'ID not found').notEmpty()],
      TeacherQuestionRoutes.getQuestionAnswerById
    );
  }
}
