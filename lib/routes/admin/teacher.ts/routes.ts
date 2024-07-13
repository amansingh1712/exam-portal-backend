import { validationResult } from 'express-validator';
import { User } from '../../../db';
import { hashPassword } from '../../../utils/helper.ts/tool';
import * as express from 'express';

export class AdminTeacherRoutes {
  public static teacherRegister = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    var creator: any = req.user || null;

    var errors = validationResult(req);
    if (creator == null) {
      res.status(401).json({
        success: false,
        message: 'Permissions not granted!',
      });
    } else if (!errors.isEmpty()) {
      res.json({
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
          //user already exists
          if (user) {
            res.json({
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
                  usertype: 'TEACHER',
                  createdBy: creator._id,
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
                    console.log(err);
                    res.status(500).json({
                      success: false,
                      message: 'Unable to register Profile',
                    });
                  });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  success: false,
                  message: 'Unable to register Profile',
                });
              });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            success: false,
            message: 'Unable to register profile',
          });
        });
    }
  };

  public static getAllTeacher = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const users = await User.find({ usertype: 'TEACHER' });
    var teachers = [];
    users.forEach((teacher) => {
      teachers.push({
        id: teacher._id,
        name: teacher.username,
        status: teacher.status,
      });
    });
    res.json({
      success: true,
      teachers,
    });
  };

  public static getTeacherStatusCount = (req, res, next) => {
    User.aggregate([
      { $match: { usertype: 'TEACHER' } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])
      .then((result) => {
        var trueCount = 0;
        var falseCount = 0;
        result.forEach((x) => {
          if (x._id == true) {
            trueCount = x.count;
          }
          if (x._id == false) {
            falseCount = x.count;
          }
        });
        res.json({
          success: true,
          active: trueCount,
          blocked: falseCount,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      });
  };
}
