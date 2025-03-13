import './moduleAlias';
import 'dotenv/config';
import './core/database';
import './core/casbin';
import bodyParser from 'body-parser';
import express  from "express";
import cors from "cors";
import loggerHelper from '@utils/logger.helper.util'
import CONSTANTS from '@core/constants';
import handleError from '@utils/errorHandler.util';
import routers from './routers';
const logger = loggerHelper.getLogger('server');
const app = express();
app.use(cors());
app.use(bodyParser.json(
  {
    limit: '20mb',
  },
));

const parseLanguage = (req: express.Request<'parta'>, res: express.Response, next: express.NextFunction)=>{
    const language: string = req.acceptsLanguages()[0];
    req.language = CONSTANTS.ACCEPTED_LANGUAGES.includes(language) ? language : 'vi';
    next();
  }

app.get('/', (req, res) => {
    res.send('External sever error!');
});
app.use(parseLanguage);

routers(app);
app.use(handleError);

app.listen(CONSTANTS.PORT, () => {
    logger.info(`App listening on port http://localhost:${CONSTANTS.PORT}\n\n\n`);
  })

  export default app;