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
const jobTitle_model_1 = require("../models/jobTitle.model");
const sport_model_1 = require("../models/sport.model");
/**
 * Get all Job Titles for frontend dropdowns
 * @route GET /options/job-titles
 */
const getJobTitles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobTitles = yield jobTitle_model_1.JobTitle.find().sort({ titleName: 1 });
        res.status(200).json(jobTitles);
    }
    catch (err) {
        console.error('Get Job Titles Error:', err);
        res.status(500).json({
            message: 'Failed to fetch job titles.',
        });
    }
});
/**
 * Get all Sports for frontend dropdowns
 * @route GET /options/sports
 */
const getSports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sports = yield sport_model_1.Sport.find().sort({ titleName: 1 });
        res.status(200).json(sports);
    }
    catch (err) {
        console.error('Get Sports Error:', err);
        res.status(500).json({
            message: 'Failed to fetch sports.',
        });
    }
});
exports.default = {
    getJobTitles,
    getSports,
};
