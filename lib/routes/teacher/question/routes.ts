import { validationResult } from 'express-validator';
import { Question, Subject } from '../../../db';
import * as express from 'express';

export class TeacherQuestionRoutes {
  public static addQuestion = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    var creator: any = req.user || null;
    if (creator == null || creator.usertype != 'TEACHER') {
      res.status(401).json({
        success: false,
        message: 'Permissions not granted!',
      });
    }

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        success: false,
        message: 'Invalid inputs',
        errors: errors,
      });
    } else {
      if (req.body.options.includes(req.body.answer) == false) {
        res.json({
          success: false,
          message: 'Invalid inputs',
          error: 'Answer is not in list of options',
        });
      } else {
        // check for valid subject
        Subject.findOne({ _id: req.body.subject, status: true }).then(
          async (subject) => {
            //subject found
            if (subject) {
              var explanation = req.body.explanation || null;

              try {
                const tempdata = new Question({
                  body: req.body.body,
                  explanation: explanation,
                  options: req.body.options,
                  subject: subject._id,
                  marks: req.body.marks,
                  answer: req.body.answer,
                  status: true,
                  createdBy: creator._id,
                });
                const que = await tempdata.save();
                res.json({
                  success: true,
                  message: 'Question created successfully!',
                });
              } catch (err) {
                console.log(err);
                res.status(500).json({
                  success: false,
                  message: 'Unable to add question',
                });
              }
            } else {
              res.json({
                success: false,
                message: 'Subject not found',
              });
            }
          }
        );
      }
    }
  };

  public static searchQuestion = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    var creator: any = req.user || null;
    if (creator == null || creator.usertype != 'TEACHER') {
      res.status(401).json({
        success: false,
        message: 'Permissions not granted!',
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      res.json({
        success: false,
        message: 'Invalid Inputs',
        errors: errors,
      });
    } else {
      Question.find({ body: new RegExp(req.body.query) })
        .limit(20)
        .then((questions) => {
          const result = questions.map((que) => ({
            _id: que._id,
            body: que.body,
            status: que.status,
          }));
          res.json({
            success: true,
            list: result,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            success: false,
            message: 'error',
          });
        });
    }
  };

  public static updateQuestion = (req, res, next) => {
    var creator = req.user || null;
    if (creator == null || req.user.usertype != 'TEACHER') {
      res.status(401).json({
        success: false,
        message: 'Permissions not granted!',
      });
    }

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      res.json({
        success: false,
        message: 'Invalid inputs',
        errors: errors,
      });
      return;
    }
    if (req.body.options.includes(req.body.answer) == false) {
      res.json({
        success: false,
        message: 'Invalid inputs',
        error: 'Answer is not in list of options',
      });
      return;
    }
    var explanation = req.body.explanation || null;
    Question.findByIdAndUpdate(
      { _id: req.body.id },
      {
        body: req.body.body,
        explanation: explanation,
        options: req.body.options,
        subject: req.body.subject,
        marks: req.body.marks,
        answer: req.body.answer,
        createdBy: creator._id,
      }
    )
      .then((result) => {
        if (result) {
          res.json({
            success: true,
            message: 'success',
          });
        } else {
          res.json({
            success: false,
            message: 'not updated',
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          success: false,
          message: 'server error',
        });
      });
  };

  public static getQuestionById = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    var creator: any = req.user || null;
    if (creator == null || creator.usertype != 'TEACHER') {
      res.status(401).json({
        success: false,
        message: 'Permissions not granted!',
      });
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      res.json({
        success: false,
        message: 'Invalid Inputs',
        errors: errors,
      });
    } else {
      Question.findById({ _id: req.body.id })
        .then((result) => {
          if (result) {
            res.json({
              success: true,
              question: result,
            });
          } else {
            res.json({
              success: false,
              message: 'not found',
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            success: false,
            message: 'error',
          });
        });
    }
  };

  public static changeQuestionStatus = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    var creator: any = req.user || null;
    if (creator == null || creator.usertype != 'TEACHER') {
      res.status(401).json({
        success: false,
        message: 'Permissions not granted!',
      });
    }

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      res.json({
        success: false,
        message: 'Invalid inputs',
        errors: errors,
      });
    } else {
      Question.findByIdAndUpdate(
        { _id: req.body.id },
        {
          status: req.body.status,
          createdBy: creator._id,
        }
      )
        .then((result) => {
          if (result) {
            res.json({
              success: true,
              message: 'success',
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            success: false,
            message: 'Internal server error',
          });
        });
    }
  };

  public static getAnsByQuestionId = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    var creator: any = req.user || null;
    if (creator == null || creator.usertype != 'TEACHER') {
      res.status(401).json({
        success: false,
        message: 'Permissions not granted!',
      });
    }

    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      res.json({
        success: false,
        message: 'Invalid Inputs',
        errors: errors,
      });
    } else {
      Question.findById({ _id: req.body.id })
        .then((result) => {
          if (result) {
            res.json({
              success: true,
              answer: result.answer,
            });
          } else {
            res.json({
              success: false,
              message: 'not found',
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            success: false,
            message: 'error',
          });
        });
    }
  };
  public static getQuestionAnswerById = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    var creator: any = req.user || null;
    if (creator == null || creator.usertype != 'TEACHER') {
      res.status(401).json({
        success: false,
        message: 'Permissions not granted!',
      });
    }

    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      res.json({
        success: false,
        message: 'Invalid Inputs',
        errors: errors,
      });
    } else {
      Question.findById({ _id: req.body.id })
        .then((result) => {
          if (result) {
            res.json({
              success: true,
              question: result,
              answer: result.answer,
            });
          } else {
            res.json({
              success: false,
              message: 'not found',
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            success: false,
            message: 'error',
          });
        });
    }
  };
}
