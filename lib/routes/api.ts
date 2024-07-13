import * as express from 'express';
import { AdminRouter } from './admin/admin';
import { AuthRouter } from './auth';
import passport from '../services/passportconf';
import { UserRouter } from './user';
import { TeacherRouter } from './teacher';

export const api = express.Router();

const authenticateAdmin = (req, res, next) => {
  passport.authenticate(
    'admin-token',
    { session: false },
    (err, user, info) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: 'Server error' });
      }
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: info.message || 'Unauthorized' });
      }

      // If the user is authenticated, proceed to the route
      req.user = user;
      next();
    }
  )(req, res, next);
};

api.use('/admin', authenticateAdmin, new AdminRouter().router);

api.use('/auth', new AuthRouter().router);

api.use(
  '/user',
  passport.authenticate('user-token', { session: false }),
  new UserRouter().router
);

api.use(
  '/teacher',
  passport.authenticate('user-token', { session: false }),
  new TeacherRouter().router
);
