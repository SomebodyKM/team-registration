import { Router } from 'express';
import participantController from '../controllers/participant.controller';
import { protect } from '../middleware/auth.middleware';

const participantRouter = Router();

participantRouter.use(protect);

participantRouter.post('/', participantController.addParticipant);
participantRouter.get('/', participantController.getMyParticipants);
participantRouter.get('/:id', participantController.getParticipantById);
participantRouter.put('/:id', participantController.updateParticipant);
participantRouter.delete('/:id', participantController.deleteParticipant);

export default participantRouter;
