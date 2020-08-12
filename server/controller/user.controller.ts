import { Router, Request, Response, NextFunction } from 'express';
import { asyncMiddleware } from '../middleware/middleware';
import { logger } from '../../common/logger';
import User from '../../sequelize/user.model';
import { Op, WhereOptions } from 'sequelize';

const router = Router();

type UserParams = {
    name?:string,
    surname?:string,
    email?:string,
    id?:string,
}
router.put(
    '/', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {name,surname,email,id}  = req.body as UserParams;

            if((!name && !surname && !email )|| !id ){
                return missignParamsReponse(res);
            }
            let user = await User.findOne({where:{id}});
            if(!user){
                return  res.status(400).json({
                    code : 400,
                    message:'User not found'
                });
            }

            user = await user.update({name,surname,email});
            return res.status(200).json({
                code:200,
                id:user.id,
                date:user.updatedAt
            });
        } catch (err) {
            logger.error('/user -> error: ', err);
            return exceptionResonse(res,err);
          }
        })
  );

  router.get(
    '/', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.query as UserParams;
            if(!id){
                return missignParamsReponse(res);
            }
            let user = await User.findOne({where:{id}});
            if(!user){
                return  res.status(400).json({
                    code : 400,
                    message:'User not found'
                });
            }
            return  res.status(200).json({
                code : 200,
                user
            });
        } catch (err) {
            logger.error('/user -> error: ', err);
            return exceptionResonse(res,err);
        }
        })
  );


// Create
router.post(
    '/', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name,surname,email } = req.body as UserParams;
            if(!name || !surname || !email ){
                return missignParamsReponse(res);
            }

            let user = await User.findOne({
                where:{
                    [Op.or] : [
                        {[Op.and]:{name,surname}},
                        {email}
                    ]
                }
            });
            if(user){
                return  res.status(400).json({
                    code : 400,
                    message:'User already exists'
                });
            }
            user = await User.create({name,surname,email});
            return res.status(200).json({
                code:200,
                id:user.id,
                date:user.createdAt
            });


        } catch (err) {
          logger.error('/user -> error: ', err);
          return exceptionResonse(res,err);
        }
      })
);

//
router.delete(
    '/', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id, email } = req.query as UserParams;

            if(!id && !email ){
                return missignParamsReponse(res);
            }
            const where:WhereOptions = id ? {id:id!} : {email:email!};
            const user = await User.findOne({where});
            if(!user){
                return  res.status(400).json({
                    code : 400,
                    message:'User not found'
                });
            }

            const rowAffected = await User.destroy({where});
            return res.status(200).json({
                code : 200,
                message:`Row Deleted : ${rowAffected}`
            });
        } catch (err) {
            logger.error('/user -> error: ', err);
            return res.sendStatus(300);
          }
        })
  );


const missignParamsReponse = (res:Response) => res.status(400).json({
    code : 400,
    message:'Missing parameters'
});

const exceptionResonse = (res:Response,err:any) => res.status(400).json({
    code : 500,
    message:'Server Error.'
});
export default router;
