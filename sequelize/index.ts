import { Sequelize, SequelizeOptions } from 'sequelize-typescript';

export default async function syncDb(): Promise<Sequelize> {

  const connectionOptions: SequelizeOptions = {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // <<<<<<< YOU NEED THIS
      }
    },
    models: [__dirname + '/*.model.ts'],
    modelMatch: (filename: string, member: string) =>
      filename.substring(0, filename.indexOf('.model')) === member.toLowerCase(),
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  };
  console.log("DB : ",process.env.DATABASE_URL);
  const sequelizeconnection = new Sequelize(process.env.DATABASE_URL!, connectionOptions);

  const connection = await sequelizeconnection.sync();
  // const syncDb = Options ? await sequelizeconnection.authenticate(Options) : await sequelizeconnection.authenticate();
  return connection;
}
