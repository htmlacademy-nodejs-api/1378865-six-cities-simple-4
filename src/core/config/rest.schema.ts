import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

const DEFAULT_PORT = 5000;
const DEFAULT_DB_HOST = '127.0.0.1';
const DEFAULT_DB_PORT = '27017';
const DEFAULT_DB_NAME = 'buy-and-sell';
const DEFAULT_HOST = 'localhost';
const DEFAULT_STATIC_DIRECTORY_PATH = 'static';

export type RestSchema = {
  PORT: number;
  SALT: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: string;
  DB_NAME: string;
  UPLOAD_DIRECTORY: string;
  JWT_SECRET: string;
  HOST: string;
  STATIC_DIRECTORY_PATH: string;
};

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: DEFAULT_PORT,
  },
  SALT: {
    doc: 'Salt for password hash',
    format: String,
    env: 'SALT',
    default: null,
  },
  DB_HOST: {
    doc: 'IP dress of the database server (MongoDB)',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: DEFAULT_DB_HOST,
  },
  DB_USER: {
    doc: 'Username to connect to the database',
    format: String,
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: 'Password to connect to the database',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  DB_PORT: {
    doc: 'Port to connect to the database (MongoDB)',
    format: 'port',
    env: 'DB_PORT',
    default: DEFAULT_DB_PORT,
  },
  DB_NAME: {
    doc: 'Database name (MongoDB)',
    format: String,
    env: 'DB_NAME',
    default: DEFAULT_DB_NAME,
  },
  UPLOAD_DIRECTORY: {
    doc: 'Directory for upload files',
    format: String,
    env: 'UPLOAD_DIRECTORY',
    default: null,
  },
  JWT_SECRET: {
    doc: 'Secret for sign JWT',
    format: String,
    env: 'JWT_SECRET',
    default: null,
  },
  HOST: {
    doc: 'Host where started service',
    format: String,
    env: 'HOST',
    default: DEFAULT_HOST
  },
  STATIC_DIRECTORY_PATH: {
    doc: 'Path to directory with static resources',
    format: String,
    env: 'STATIC_DIRECTORY_PATH',
    default: DEFAULT_STATIC_DIRECTORY_PATH
  },
});
