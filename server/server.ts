

import express,{Response,Request} from 'express';
import db from '../sequelize/index';

export default async function runServer(){

    const app = express();
    const port = 3000;

    // Connession al db
    await db();

    console.log("DB : ",process.env.DATABASE_URL);
    app.get('/', (req:Request, res:Response) => {
      res.send('Hello World!')
    })


    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })

}