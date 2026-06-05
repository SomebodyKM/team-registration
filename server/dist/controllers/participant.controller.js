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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const participant_service_1 = __importDefault(require("../services/participant.service"));
/**
 * Add a Participant to the School's Roster
 * @route POST /participants
 */
const addParticipant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schoolId = req.schoolId;
        const { fullName, idNumber, birthday, jobTitleId, sportId } = req.body;
        // Basic validation
        if (!fullName || !idNumber || !birthday || !jobTitleId || !sportId) {
            return res.status(400).json({
                message: 'All form fields (Name, ID, Birthday, Job Title, Sport) are required.',
            });
        }
        const newParticipant = yield participant_service_1.default.create({
            schoolId,
            fullName,
            idNumber,
            birthday,
            jobTitleId,
            sportId,
        });
        res.status(201).json(newParticipant);
    }
    catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: 'A participant with this ID number is already registered.',
            });
        }
        console.error('Add participant error:', err);
        res.status(500).json({
            message: 'Server error registering participant.',
        });
    }
});
/**
 * Get My School's Participants
 * @route GET /participants
 */
const getMyParticipants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schoolId = req.school._id;
        const participants = yield participant_service_1.default.getAllBySchool(schoolId);
        res.status(200).json(participants);
    }
    catch (err) {
        console.error('Get participants error:', err);
        res.status(500).json({
            message: 'Error fetching your participants.',
        });
    }
});
/**
 * Get Single Participant
 * @route GET /participants/:id
 */
const getParticipantById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const participant = yield participant_service_1.default.getById(id);
        if (!participant) {
            return res.status(404).json({
                message: 'Participant not found.',
            });
        }
        res.status(200).json(participant);
    }
    catch (err) {
        console.error('Get participant by ID error:', err);
        res.status(500).json({
            message: 'Error fetching participant details.',
        });
    }
});
/**
 * Update Participant Details
 * @route PUT /participants/:id
 */
const updateParticipant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedParticipant = yield participant_service_1.default.update(id, updates);
        res.status(200).json(updatedParticipant);
    }
    catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: 'ID number is already in use.',
            });
        }
        res.status(400).json({
            message: err.message || 'Error updating participant.',
        });
    }
});
/**
 * Remove Participant
 * @route DELETE /participants/:id
 */
const deleteParticipant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield participant_service_1.default.remove(id);
        res.status(200).json({
            message: 'Participant removed successfully.',
        });
    }
    catch (err) {
        res.status(400).json({
            message: err.message || 'Error removing participant.',
        });
    }
});
exports.default = {
    addParticipant,
    getMyParticipants,
    getParticipantById,
    updateParticipant,
    deleteParticipant,
};
