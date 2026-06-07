import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import zxcvbn from 'zxcvbn';
import schoolService from '../services/school.service';
import { generateToken } from '../utils/auth.utils';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Login School
 * @route POST /auth/login
 */
const loginSchool = async (req: Request, res: Response) => {
  try {
    const { schoolName, password } = req.body;

    if (!schoolName || !password) {
      return res.status(400).json({
        message: 'School name and password are required.',
      });
    }

    const school = await schoolService.getSchoolByNameWithPassword(schoolName);

    if (!school) {
      return res.status(401).json({
        message: 'Invalid credentials.',
      });
    }

    const isMatch = await bcrypt.compare(password, school.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials.',
      });
    }

    // Generate JWT
    const token = generateToken(school._id.toString());

    res.status(200).json({
      message: 'Login successfully',
      token,
      school: {
        _id: school._id,
        schoolName: school.schoolName,
        isFirstLogin: school.isFirstLogin,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({
      message: 'Server error during login.',
    });
  }
};

/**
 * Setup New Password (First Time Login)
 * @route POST /auth/setup-password
 */
const setupNewPassword = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.schoolId;
    const { currentPassword, newPassword } = req.body;

    if (!schoolId) {
      return res.status(401).json({
        message: 'Unauthorized.',
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Both current and new password are required.',
      });
    }

    const school = await schoolService.getSchoolByNameWithPassword(req.school.schoolName);

    if (!school) {
      return res.status(404).json({
        message: 'School not found.',
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, school.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Current password is incorrect.',
      });
    }

    // Check new password strength
    const strength = zxcvbn(newPassword);

    if (strength.score < 3) {
      return res.status(400).json({
        message: 'Password is too weak.',
        suggestions: strength.feedback.suggestions,
        warning: strength.feedback.warning,
      });
    }

    // Hash the new password and update to the database
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    const updatedSchool = await schoolService.updatePassword(schoolId, hashedNewPassword);

    res.status(200).json({
      message: 'Password updated successfully. You may now access the system',
      school: {
        _id: school._id,
        schoolName: updatedSchool?.schoolName,
        isFirstLogin: updatedSchool?.isFirstLogin,
      },
    });
  } catch (err) {
    console.error('Setup Password Error:', err);
    res.status(500).json({
      message: 'Server error setting new password.',
    });
  }
};

/**
 * Logout School
 * @route POST /auth/logout
 */
const logoutSchool = async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Logged out successfully.',
  });
};

/**
 * Get All Schools (For Login Dropdown)
 * @route GET /auth/schools
 */
const getAllSchools = async (req: Request, res: Response) => {
  try {
    const schools = await schoolService.getAllSchools();

    const formattedSchools = schools.map((school) => ({
      _id: school._id,
      schoolName: school.schoolName,
    }));

    res.status(200).json(formattedSchools);
  } catch (err) {
    console.error('Get All Schools Error:', err);
    res.status(500).json({
      message: 'Server error fetching school list.',
    });
  }
};

export default {
  loginSchool,
  setupNewPassword,
  logoutSchool,
  getAllSchools,
};
