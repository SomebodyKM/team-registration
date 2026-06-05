import { Request, Response } from 'express';
import participantService from '../services/participant.service';

/**
 * Add a Participant to the School's Roster
 * @route POST /participants
 */
const addParticipant = async (req: Request, res: Response) => {
  try {
    const schoolId = (req as any).schoolId;
    const { fullName, idNumber, birthday, jobTitleId, sportId } = req.body;

    // Basic validation
    if (!fullName || !idNumber || !birthday || !jobTitleId || !sportId) {
      return res.status(400).json({
        message: 'All form fields (Name, ID, Birthday, Job Title, Sport) are required.',
      });
    }

    const newParticipant = await participantService.create({
      schoolId,
      fullName,
      idNumber,
      birthday,
      jobTitleId,
      sportId,
    });

    res.status(201).json(newParticipant);
  } catch (err: any) {
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
};

/**
 * Get My School's Participants
 * @route GET /participants
 */
const getMyParticipants = async (req: Request, res: Response) => {
  try {
    const schoolId = (req as any).school._id;
    const participants = await participantService.getAllBySchool(schoolId);

    res.status(200).json(participants);
  } catch (err) {
    console.error('Get participants error:', err);
    res.status(500).json({
      message: 'Error fetching your participants.',
    });
  }
};

/**
 * Get Single Participant
 * @route GET /participants/:id
 */
const getParticipantById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const participant = await participantService.getById(id);

    if (!participant) {
      return res.status(404).json({
        message: 'Participant not found.',
      });
    }

    res.status(200).json(participant);
  } catch (err) {
    console.error('Get participant by ID error:', err);
    res.status(500).json({
      message: 'Error fetching participant details.',
    });
  }
};

/**
 * Update Participant Details
 * @route PUT /participants/:id
 */
const updateParticipant = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedParticipant = await participantService.update(id, updates);

    res.status(200).json(updatedParticipant);
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'ID number is already in use.',
      });
    }

    res.status(400).json({
      message: err.message || 'Error updating participant.',
    });
  }
};

/**
 * Remove Participant
 * @route DELETE /participants/:id
 */
const deleteParticipant = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    await participantService.remove(id);

    res.status(200).json({
      message: 'Participant removed successfully.',
    });
  } catch (err: any) {
    res.status(400).json({
      message: err.message || 'Error removing participant.',
    });
  }
};

export default {
  addParticipant,
  getMyParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
};
