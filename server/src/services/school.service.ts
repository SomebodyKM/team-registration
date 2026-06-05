import { School } from '../models/school.model';

// Find a school by name and explicitly include the password field
const getSchoolByNameWithPassword = async (schoolName: string) => {
  return await School.findOne({ schoolName }).select('+password');
};

// Find a school by its ID
const getSchoolById = async (id: string) => {
  return await School.findById(id);
};

// Update the school's password and set isFirstLogin to false
const updatePassword = async (id: string, hashedPassword: string) => {
  return await School.findByIdAndUpdate(
    id,
    {
      password: hashedPassword,
      isFirstLogin: false,
    },
    { new: true, runValidators: true },
  );
};

export default {
  getSchoolByNameWithPassword,
  getSchoolById,
  updatePassword,
};
