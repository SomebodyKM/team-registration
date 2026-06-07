import { Router } from 'express';
import schoolController from '../controllers/school.controller';
import { protect } from '../middleware/auth.middleware';

const schoolRouter = Router();

schoolRouter.post('/login', schoolController.loginSchool);
schoolRouter.get('/schools', schoolController.getAllSchools);
schoolRouter.post('/setup-password', protect, schoolController.setupNewPassword);
schoolRouter.post('/logout', protect, schoolController.logoutSchool);

export default schoolRouter;
