import { isDevMode } from "../../common/debug";
import { Request, Response, NextFunction } from 'express';
import { logger } from "../../common/logger";

export const loggerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (isDevMode()) {
        logger.info(`------------------------------`);
        logger.info(` -> ${req.method} : ${req.originalUrl} `);
        logger.info(`   |   Query : ${JSON.stringify(req.query)} `);
        logger.info(`   |   Body : ${JSON.stringify(req.body)} `);
        logger.info(`------------------------------`);
    }
    next();
}

export const asyncMiddleware = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
