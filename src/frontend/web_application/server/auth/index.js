import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import getRouter from './router';
import { checkCookieMiddleware, decodeCookieMiddleware, checkTokenMiddleware, catchLoginErrorsMiddleware } from './middlewares';
import { getConfig } from '../config';

export default (app) => {
  const { cookie: { secret } } = getConfig();
  app.use(cookieParser(secret));
  app.use('/auth', bodyParser.json());
  app.use('/auth', bodyParser.urlencoded({ extended: false }));
  app.use('/auth', getRouter());

  app.use(
    checkCookieMiddleware,
    decodeCookieMiddleware,
    checkTokenMiddleware,
    catchLoginErrorsMiddleware
  );
};
