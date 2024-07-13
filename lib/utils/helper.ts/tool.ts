import * as bcrypt from 'bcrypt';
const saltRounds = 10;

export const hashPassword = (pass) => {
  return new Promise((resolve, reject) => {
    bcrypt
      .hash(pass, saltRounds)
      .then((hash) => {
        resolve(hash);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
