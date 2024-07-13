import * as express from 'express';
import { Subject } from '../../../db';
import { validationResult } from 'express-validator';

export class AdminSubjectRoutes {
  public static addSubject = (req, res, next) => {
    var creator = req.user || null;

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
      var name = req.body.name;
      console.log('name:', name);
      Subject.findOne({ name: name }).then((subject) => {
        // subject already exists
        if (subject) {
          res.json({
            success: false,
            message: 'Subject is already exists!',
          });
        } else {
          //add subject to database
          var newsubject = new Subject({
            name: name,
            status: true,
            createdBy: creator._id,
          });

          newsubject
            .save()
            .then(() => {
              res.json({
                success: true,
                message: 'Subject created successfully!',
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                success: false,
                message: 'Unable to add Subject',
              });
            });
        }
      });
    }
  };

  public static subjectRemove = (req, res, next) => {
    if (req.user == null) {
      res.status(401).json({
        success: false,
        message: 'Permissions not granted!',
      });
    } else {
      Subject.findOneAndUpdate(
        {
          _id: req.body._id,
        },
        {
          status: false,
        }
      )
        .then(() => {
          res.json({
            success: true,
            message: 'Subject has been removed',
          });
        })
        .catch((err) => {
          res.status(500).json({
            success: false,
            message: 'Unable to remove subject',
          });
        });
    }
  };

  public static unblockSubject = (req, res, next) => {
    if (req.user == null) {
      res.status(401).json({
        success: false,
        message: 'Permissions not granted!',
      });
    } else {
      Subject.findOneAndUpdate(
        {
          _id: req.body._id,
        },
        {
          status: true,
        }
      )
        .then(() => {
          res.json({
            success: true,
            message: 'Subject has been unblocked',
          });
        })
        .catch((err) => {
          res.status(500).json({
            success: false,
            message: 'Unable to unblock subject',
          });
        });
    }
  };

  public static getAllSubject = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const subjects = await Subject.find({});
    const subs = [];
    subjects.forEach((subject) => {
      subs.push({
        id: subject._id,
        subject: subject.name,
        status: subject.status,
      });
    });
    res.json({
      success: true,
      subjects: subs,
    });
  };

  public static getStatusCount = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const result = await Subject.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);

      const counts = result.reduce(
        (acc, item) => {
          if (item._id) {
            acc.active = item.count;
          } else {
            acc.blocked = item.count;
          }
          return acc;
        },
        { active: 0, blocked: 0 }
      );

      res.json({
        success: true,
        ...counts,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
}
