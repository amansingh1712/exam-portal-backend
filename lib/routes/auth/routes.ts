import passport from '../../services/passportconf';
import * as jwt from 'jsonwebtoken';
import { config } from '../../utils/configuration/config';
import { hashPassword } from '../../utils/helper.ts/tool';
import { User } from '../../db';
import { body, validationResult } from 'express-validator';
import * as express from 'express';

export class AuthRoutes {
  public static adminLogin = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        success: false,
        message: 'Invalid inputs',
        errors: errors,
      });
    } else {
      passport.authenticate(
        'admin-login',
        { session: false },
        (err, admin, info) => {
          if (err || !admin) {
            res.json(info);
          } else {
            req.login({ _id: admin._id }, { session: false }, (err) => {
              if (err) {
                res.json({
                  success: false,
                  message: 'server error',
                });
              }

              var token = jwt.sign({ _id: admin._id }, config.JWT_SECRET, {
                expiresIn: '1d',
              });
              res.json({
                success: true,
                message: 'login successful',
                admin: {
                  username: admin.username,
                  _id: admin._id,
                },
                token: token,
              });
            });
          }
        }
      )(req, res, next);
    }
  };

  public static userLogin = (req, res, next) => {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        success: false,
        message: 'Invalid inputs',
        errors: errors,
      });
    } else {
      passport.authenticate('login', { session: false }, (err, user, info) => {
        if (err || !user) {
          res.json(info);
        } else {
          req.login({ _id: user._id }, { session: false }, (err) => {
            if (err) {
              res.json({
                success: false,
                message: 'server error',
              });
            }

            var token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
              expiresIn: '1d',
            });
            res.json({
              success: true,
              message: 'login successful',
              user: {
                username: user.username,
                type: user.usertype,
                _id: user._id,
                email: user.email,
              },
              token: token,
            });
          });
        }
      })(req, res, next);
    }
  };

  public static studentRegister = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    var errors = validationResult(req);
    console.log('errors:', errors);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Invalid inputs',
        errors: errors,
      });
    } else {
      var username = req.body.username;
      var password = req.body.password;
      var email = req.body.email;

      User.findOne({ email: email })
        .then((user) => {
          console.log('user:', user);
          //user already exists
          if (user) {
            res.status(400).json({
              success: false,
              message: 'This email is already exists!',
            });
          } else {
            //add user to database

            hashPassword(password)
              .then((hash) => {
                var tempdata = new User({
                  username: username,
                  password: hash,
                  email: email,
                  usertype: 'STUDENT',
                });
                tempdata
                  .save()
                  .then(() => {
                    res.json({
                      success: true,
                      message: 'Profile created successfully!',
                    });
                  })
                  .catch((err) => {
                    res.status(500).json({
                      success: false,
                      message: 'Unable to register Profile',
                    });
                  });
              })
              .catch((err) => {
                res.status(500).json({
                  success: false,
                  message: 'Unable to register Profile',
                });
              });
          }
        })
        .catch((err) => {
          res.status(500).json({
            success: false,
            message: 'Unable to register profile',
          });
        });
    }
  };
}
