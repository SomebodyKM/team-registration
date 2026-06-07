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
const bcrypt_1 = __importDefault(require("bcrypt"));
const zxcvbn_1 = __importDefault(require("zxcvbn"));
const school_service_1 = __importDefault(require("../services/school.service"));
const auth_utils_1 = require("../utils/auth.utils");
/**
 * Login School
 * @route POST /auth/login
 */
const loginSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { schoolName, password } = req.body;
        if (!schoolName || !password) {
            return res.status(400).json({
                message: 'School name and password are required.',
            });
        }
        const school = yield school_service_1.default.getSchoolByNameWithPassword(schoolName);
        if (!school) {
            return res.status(401).json({
                message: 'Invalid credentials.',
            });
        }
        const isMatch = yield bcrypt_1.default.compare(password, school.password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials.',
            });
        }
        // Generate JWT
        const token = (0, auth_utils_1.generateToken)(school._id.toString());
        res.status(200).json({
            message: 'Login successfully',
            token,
            school: {
                _id: school._id,
                schoolName: school.schoolName,
                isFirstLogin: school.isFirstLogin,
            },
        });
    }
    catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({
            message: 'Server error during login.',
        });
    }
});
/**
 * Setup New Password (First Time Login)
 * @route POST /auth/setup-password
 */
const setupNewPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const school = yield school_service_1.default.getSchoolByNameWithPassword(req.school.schoolName);
        if (!school) {
            return res.status(404).json({
                message: 'School not found.',
            });
        }
        const isMatch = yield bcrypt_1.default.compare(currentPassword, school.password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Current password is incorrect.',
            });
        }
        // Check new password strength
        const strength = (0, zxcvbn_1.default)(newPassword);
        if (strength.score < 3) {
            return res.status(400).json({
                message: 'Password is too weak.',
                suggestions: strength.feedback.suggestions,
                warning: strength.feedback.warning,
            });
        }
        // Hash the new password and update to the database
        const hashedNewPassword = yield bcrypt_1.default.hash(newPassword, 12);
        const updatedSchool = yield school_service_1.default.updatePassword(schoolId, hashedNewPassword);
        res.status(200).json({
            message: 'Password updated successfully. You may now access the system',
            school: {
                _id: school._id,
                schoolName: updatedSchool === null || updatedSchool === void 0 ? void 0 : updatedSchool.schoolName,
                isFirstLogin: updatedSchool === null || updatedSchool === void 0 ? void 0 : updatedSchool.isFirstLogin,
            },
        });
    }
    catch (err) {
        console.error('Setup Password Error:', err);
        res.status(500).json({
            message: 'Server error setting new password.',
        });
    }
});
/**
 * Logout School
 * @route POST /auth/logout
 */
const logoutSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        message: 'Logged out successfully.',
    });
});
/**
 * Get All Schools (For Login Dropdown)
 * @route GET /auth/schools
 */
const getAllSchools = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schools = yield school_service_1.default.getAllSchools();
        const formattedSchools = schools.map((school) => ({
            _id: school._id,
            schoolName: school.schoolName,
        }));
        res.status(200).json(formattedSchools);
    }
    catch (err) {
        console.error('Get All Schools Error:', err);
        res.status(500).json({
            message: 'Server error fetching school list.',
        });
    }
});
exports.default = {
    loginSchool,
    setupNewPassword,
    logoutSchool,
    getAllSchools,
};
