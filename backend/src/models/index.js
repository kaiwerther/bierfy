// src/models/index.js

import { Sequelize } from 'sequelize';
import config from '../config/config.js';
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const models = {};

async function loadModels() {
  const files = fs
    .readdirSync(__dirname)
    .filter((file) => file !== 'index.js' && file.slice(-3) === '.js');

  for (const file of files) {
    const filePath = path.join(__dirname, file);
    const modelModule = await import(`file://${filePath}`);
    const ModelClass = modelModule.default;

    if (ModelClass && typeof ModelClass.init === 'function') {
      // Initialize the model with Sequelize instance
      ModelClass.init(sequelize);

      // Add the model to the models object
      models[ModelClass.name] = ModelClass;
    }
  }

  // Setup associations
  for (const modelName of Object.keys(models)) {
    if (typeof models[modelName].associate === 'function') {
      models[modelName].associate(models);
    }
  }
}

// Call the async function and export models
await loadModels();

export default { sequelize, Sequelize, ...models };
