import { Sequelize, DataTypes } from 'sequelize';

// Switch to use a real database for production
export const DBClient = new Sequelize('sqlite::memory:');
