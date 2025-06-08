import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
    'realestate_db',
    'postgres',
    'kovkat25', {
        host: 'localhost', // localhost або IP
        port: 5432,
        dialect: 'postgres',
        logging: false,
    }
);