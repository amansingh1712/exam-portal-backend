import { validationResult } from 'express-validator';
import { Question, Test } from '../../../db';

export class TeacherTestRoutes {
  public static createTest = async (req, res, next) => {
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

    var genQue = await generateTestpaper(
      req.body.subjects,
      req.body.maxmarks,
      req.body.queTypes
    );
    if (genQue.quelist.length < 1) {
      res.json({
        success: false,
        message: 'Not enough questions for selected subject',
      });
      return;
    }

    try {
      const tempdata = new Test({
        title: req.body.title,
        subjects: req.body.subjects,
        maxmarks: req.body.maxmarks,
        queTypes: req.body.queTypes,
        questions: genQue.quelist,
        answers: genQue.anslist,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        duration: req.body.duration,
        regStartTime: req.body.regStartTime,
        regEndTime: req.body.regEndTime,
        resultTime: req.body.resultTime,
        createdBy: creator._id,
      });
      const test = await tempdata.save();
      res.json({
        success: true,
        message: 'Test created successfully!',
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: 'Unable to create test',
      });
    }
  };
}

const generateTestpaper = async (subjects, maxmarks, queTypes) => {
  console.log('queTypes:', queTypes);
  console.log('maxmarks:', maxmarks);
  console.log('subjects:', subjects);
  const templist = [];
  const quelist = [];
  const anslist = [];
  let totalMarks = 0;
  try {
    const allQuestions = await Question.find({
      status: true,
      subject: { $in: subjects },
      marks: { $in: queTypes },
    });
    console.log('allQuestions:', allQuestions);
    for (var x in allQuestions) {
      totalMarks += allQuestions[x].marks;
    }
    if (totalMarks < maxmarks) {
      console.log('not enough question for subjects');
    } else {
      var remaining = maxmarks;
      var qIndexSet = new Set();
      while (remaining > 0) {
        var i = Math.floor(Math.random() * allQuestions.length);
        if (qIndexSet.has(i) || allQuestions[i].marks > remaining) {
          continue;
        } else {
          qIndexSet.add(i);
          quelist.push(allQuestions[i]._id);
          anslist.push(allQuestions[i].answer);
          remaining -= allQuestions[i].marks;
        }
      }
    }
    return { quelist, anslist };
  } catch (err) {
    console.log(err);
    return { quelist, anslist };
  }
};
