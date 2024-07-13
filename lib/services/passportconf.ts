import passport from 'passport';
import passportLocal, {
  IStrategyOptionsWithRequest,
  VerifyFunctionWithRequest,
} from 'passport-local';
import passportJwt, {
  StrategyOptionsWithoutRequest,
  VerifyCallback,
} from 'passport-jwt';
import bcrypt from 'bcrypt';
import { Admin, User } from '../db';
import { config } from '../utils/configuration/config';
import mongoose from 'mongoose';

const localStrategyOption: IStrategyOptionsWithRequest = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
};

const localStrategyVerify: VerifyFunctionWithRequest = async (
  req,
  email,
  password,
  done
): Promise<void> => {
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return done(null, false, {
        message: 'email is not registered',
      });
    }

    if (user.status == false) {
      return done(null, false, {
        message: 'your account is blocked',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return done(null, user, {
        message: 'Logged in successfully',
      });
    } else {
      return done(null, false, {
        message: 'Invalid password',
      });
    }
  } catch (err) {
    if (err instanceof mongoose.Error) {
      // Handle specific Mongoose errors
      if (err.name === 'ValidationError') {
        return done(null, false, { message: 'Validation error' });
      } else if (err.name === 'CastError') {
        return done(null, false, { message: 'Invalid ID format' });
      } else if (err.name === 'MongoError') {
        return done(null, false, { message: 'MongoDB error' });
      } else {
        return done(null, false, { message: 'Mongoose error' });
      }
    } else {
      // Handle other types of errors
      return done(err, false, { message: 'Server error' });
    }
  }
};

const localStrategy = new passportLocal.Strategy(
  localStrategyOption,
  localStrategyVerify
);

passport.use('login', localStrategy);

const jwt_options: StrategyOptionsWithoutRequest = {
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET,
};
const jwtStrategyVerify: VerifyCallback = async (
  jwt_payload,
  done
): Promise<void> => {
  try {
    const user = await User.findById(jwt_payload._id);
    if (user) {
      return done(null, user, {
        success: true,
        message: 'Successful',
      });
    } else {
      return done(null, false, {
        success: false,
        message: 'Authorization Failed',
      });
    }
  } catch (err) {
    return done(err, false, {
      success: false,
      message: 'Server error',
    });
  }
};

var jwtStrategy = new passportJwt.Strategy(jwt_options, jwtStrategyVerify);

passport.use('user-token', jwtStrategy);

const localStrategyOptionAdmin: IStrategyOptionsWithRequest = {
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true,
};

const localStrategyVerifyAdmin: VerifyFunctionWithRequest = async (
  req,
  username,
  password,
  done
): Promise<void> => {
  try {
    const admin = await Admin.findOne({ username: username });

    if (!admin) {
      return done(null, false, {
        message: 'User not found',
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (isMatch) {
      return done(null, admin, {
        message: 'Logged in successfully',
      });
    } else {
      return done(null, false, {
        message: 'Invalid password',
      });
    }
  } catch (err) {
    if (err instanceof mongoose.Error) {
      // Handle specific Mongoose errors
      if (err.name === 'ValidationError') {
        return done(null, false, { message: 'Validation error' });
      } else if (err.name === 'CastError') {
        return done(null, false, { message: 'Invalid ID format' });
      } else if (err.name === 'MongoError') {
        return done(null, false, { message: 'MongoDB error' });
      } else {
        return done(null, false, { message: 'Mongoose error' });
      }
    } else {
      // Handle other types of errors
      return done(err, false, { message: 'Server error' });
    }
  }
};

var localStrategyAdmin = new passportLocal.Strategy(
  localStrategyOptionAdmin,
  localStrategyVerifyAdmin
);

passport.use('admin-login', localStrategyAdmin);

const jwtStrategyVerifyAdmin: VerifyCallback = async (jwt_payload, done) => {
  console.log('jwt_payload:', jwt_payload);
  try {
    const admin = await Admin.findById(jwt_payload._id);
    console.log('admin:', admin);
    if (admin) {
      return done(null, admin, {
        success: true,
        message: 'successful',
      });
    } else {
      console.log('aman');
      return done(null, false, {
        success: false,
        message: 'Authorization failed',
      });
    }
  } catch (err) {
    if (err instanceof mongoose.Error) {
      // Handle specific Mongoose errors
      if (err.name === 'ValidationError') {
        return done(null, false, { message: 'Validation error' });
      } else if (err.name === 'CastError') {
        return done(null, false, { message: 'Invalid ID format' });
      } else if (err.name === 'MongoError') {
        return done(null, false, { message: 'MongoDB error' });
      } else {
        return done(null, false, { message: 'Mongoose error' });
      }
    } else {
      // Handle other types of errors
      return done(err, false, { message: 'Server error' });
    }
  }
};

var jwtStrategyAdmin = new passportJwt.Strategy(
  jwt_options,
  jwtStrategyVerifyAdmin
);

passport.use('admin-token', jwtStrategyAdmin);

export default passport;
