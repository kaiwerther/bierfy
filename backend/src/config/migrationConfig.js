// config/migrationConfig.js
import 'dotenv/config';

// this uses public host + port of database because railway doesnt support private connections on build time
// as this is only used for migrations, it should be fine performance wise
// also we need to load dotenv variables here as well

const logging = process.env.SEQUELIZE_LOGGING === 'true' ? true : false;
const config = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_PUBLIC_HOST,
  port: process.env.DB_PUBLIC_PORT,
  dialect: process.env.DB_DIALECT,
};

if (logging) {
  config.logQueryParameters = true;
} else {
  config.logging = false;
}
export default config;
