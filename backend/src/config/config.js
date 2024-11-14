// src/config/config.js
const logging = process.env.SEQUELIZE_LOGGING === 'true' ? true : false;
const config = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
};

if (logging) {
  config.logQueryParameters = true;
} else {
  config.logging = false;
}
export default config;
