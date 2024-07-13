import * as mongoose from 'mongoose';
import { config } from '../utils/configuration/config';
import { AdminUserRoutes } from '../routes/admin/users/routes';

mongoose
  .connect(config.DB_PATH)
  .then(() => {
    console.log('connected to mongoDB  ', config.DB_PATH);
    AdminUserRoutes.addAdminIfNotFound();
  })
  .catch((err) => {
    console.log('Error connecting to database', err);
  });

export default mongoose;
