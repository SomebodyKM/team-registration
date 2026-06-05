import { Participant, IParticipant } from '../models/participant.model';

// Fetch all participants for a specific school.
const getAllBySchool = async (schoolId: string) => {
  return await Participant.find({ schoolId })
    .populate('jobTitleId', 'titleName')
    .populate('sportId', 'sportName')
    .sort({ createdAt: -1 });
};

// Get a single participant by their ID
const getById = async (id: string) => {
  return await Participant.findById(id)
    .populate('jobTitleId', 'titleName')
    .populate('sportId', 'sportName');
};

// Create a new participant
const create = async (participantData: Partial<IParticipant>) => {
  const newParticipant = new Participant(participantData);
  return await newParticipant.save();
};

// Update an existing participant
const update = async (id: string, updateData: Partial<IParticipant>) => {
  return await Participant.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
    .populate('jobTitleId', 'titleName')
    .populate('sportId', 'sportName');
};

// Delete a participant
const remove = async (id: string) => {
  return await Participant.findByIdAndDelete(id);
};

export default {
  getAllBySchool,
  getById,
  create,
  update,
  remove,
};
