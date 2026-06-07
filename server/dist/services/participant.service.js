"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const participant_model_1 = require("../models/participant.model");
// Fetch all participants for a specific school.
const getAllBySchool = (schoolId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield participant_model_1.Participant.find({ schoolId })
        .populate('jobTitleId', 'titleName')
        .populate('sportId', 'sportName')
        .sort({ createdAt: -1 });
});
// Get a single participant by their ID
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield participant_model_1.Participant.findById(id)
        .populate('jobTitleId', 'titleName')
        .populate('sportId', 'sportName');
});
// Create a new participant
const create = (participantData) => __awaiter(void 0, void 0, void 0, function* () {
    const newParticipant = new participant_model_1.Participant(participantData);
    return yield newParticipant.save();
});
// Update an existing participant
const update = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield participant_model_1.Participant.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
        .populate('jobTitleId', 'titleName')
        .populate('sportId', 'sportName');
});
// Delete a participant
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield participant_model_1.Participant.findByIdAndDelete(id);
});
exports.default = {
    getAllBySchool,
    getById,
    create,
    update,
    remove,
};
