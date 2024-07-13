import { Admin } from '../../../db';
import { hashPassword } from '../../../utils/helper.ts/tool';

export class AdminUserRoutes {
  public static addAdminIfNotFound = () => {
    Admin.findOne({ username: 'sysadmin' }).then((admin) => {
      if (admin) {
        console.log('Admin user found');
      } else {
        hashPassword('systemadmin').then((hash) => {
          var tempAdmin = new Admin({
            username: 'sysadmin',
            password: hash,
          });
          tempAdmin.save().then(() => {
            console.log('Admin added successfully !!');
          });
        });
      }
    });
  };
}
