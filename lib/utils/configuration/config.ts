import * as dotenv from 'dotenv';

dotenv.config();
class Config {
  DB_PATH: string;
  PORT: string;
  JWT_SECRET: string;
  NODE_ENV: string;

  constructor() {
    this.DB_PATH = process.env.DB_PATH;
    this.PORT = process.env.PORT;
    this.JWT_SECRET = process.env.JWT_SECRET;
    this.NODE_ENV = process.env.NODE_ENV;
  }
}

export const config = new Config();
