

import express,{Response,Request} from 'express';
import dbConnection from '../sequelize/index';
import { logger } from '../common/logger';
import chalk from 'chalk';
import { loggerMiddleware } from './middleware/middleware';
import helmet from 'helmet';
import { json, urlencoded } from 'body-parser';
import * as http from "http";
import * as stream from "stream";

import userController from './controller/user.controller';


let connections:stream.Duplex[] = [];
export default async function runServer():Promise<http.Server>{

    const app = express();
    app
      .use(helmet({ dnsPrefetchControl: { allow: true } }))
      .use(json())
      .use(urlencoded({ extended: false }));

    const port = process.env.PORT || 3000;

    // Connession al db
    await dbConnection();
    // middleware
    app.use(loggerMiddleware);

    // Routes
    app.get('/', (req:Request, res:Response) => {
      res.send('Hello World!')
    })
    app.use('/user', userController);

    const server = app.listen(port, () => {
      logger.info(chalk.bgGreenBright(`Example app listening at http://localhost:${port}`));
    })

    server.on('connection', connection => {
      connections.push(connection);
      connection.on('close', () => connections = connections.filter(curr => curr !== connection));
    });

    return server;
}

export function shutDown(server:http.Server) {
  setTimeout(() => {
      process.exit(1);
  }, 1000);

  connections.forEach(curr => curr.end());
  setTimeout(() => connections.forEach(curr => curr.destroy()), 5);
}