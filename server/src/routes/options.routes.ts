import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import optionsController from '../controllers/options.controller';

const optionsRouter = Router();

optionsRouter.use(protect);

optionsRouter.get('/job-titles', optionsController.getJobTitles);
optionsRouter.get('/sports', optionsController.getSports);

export default optionsRouter;
