import * as express from 'express';
import { config } from './utils/configuration/config';
import passport from './services/passportconf';
import session from 'express-session';

import './services/connection';
import { api } from './routes/api';
const startServer = () => {
  try {
    const app = express.default();
    app.use(session({ secret: 'express-session secret' }));
    app.use(express.json());
    //passport
    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/api', api);
    const port = config.PORT || 8080;
    app.set('port', port);
    app.listen(port, () => console.info(`API running on localhost:${port}`));
  } catch (error) {
    console.log('error:', error);
    process.exit(1);
  }
};

startServer();
