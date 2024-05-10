import { Sequelize, DataTypes } from 'sequelize';

/** Database Client using sqlite */
export const DBClient = new Sequelize('sqlite::memory:');
