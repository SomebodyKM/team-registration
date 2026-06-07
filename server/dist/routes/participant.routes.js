"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const participant_controller_1 = __importDefault(require("../controllers/participant.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const participantRouter = (0, express_1.Router)();
participantRouter.use(auth_middleware_1.protect);
participantRouter.post('/', participant_controller_1.default.addParticipant);
participantRouter.get('/', participant_controller_1.default.getMyParticipants);
participantRouter.get('/:id', participant_controller_1.default.getParticipantById);
participantRouter.put('/:id', participant_controller_1.default.updateParticipant);
participantRouter.delete('/:id', participant_controller_1.default.deleteParticipant);
exports.default = participantRouter;
