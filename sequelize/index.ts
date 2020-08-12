import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { logger } from '../common/logger';

export default async function syncDb(): Promise<Sequelize | null> {

  const connectionOptions: SequelizeOptions = {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    models: [__dirname + '/*.model.ts'],
    modelMatch: (filename: string, member: string) =>
      filename.substring(0, filename.indexOf('.model')) === member.toLowerCase(),
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    logging: (sqlString: string) => logger.warn(sqlString),
  };
  const sequelizeconnection = new Sequelize(process.env.DATABASE_URL!, connectionOptions);

  let connection = null;
  try{
   connection = await sequelizeconnection.sync({
     force: Boolean(process.env.FORCE || false)
   });
   logger.info("Db connected.");
  }catch(error){
    logger.error("Database connection error!");
  }
  return connection;
}
