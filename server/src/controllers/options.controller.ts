import { Request, Response } from 'express';
import { JobTitle } from '../models/jobTitle.model';
import { Sport } from '../models/sport.model';

/**
 * Get all Job Titles for frontend dropdowns
 * @route GET /options/job-titles
 */
const getJobTitles = async (req: Request, res: Response) => {
  try {
    const jobTitles = await JobTitle.find().sort({ titleName: 1 });

    res.status(200).json(jobTitles);
  } catch (err) {
    console.error('Get Job Titles Error:', err);
    res.status(500).json({
      message: 'Failed to fetch job titles.',
    });
  }
};

/**
 * Get all Sports for frontend dropdowns
 * @route GET /options/sports
 */
const getSports = async (req: Request, res: Response) => {
  try {
    const sports = await Sport.find().sort({ titleName: 1 });

    res.status(200).json(sports);
  } catch (err) {
    console.error('Get Sports Error:', err);
    res.status(500).json({
      message: 'Failed to fetch sports.',
    });
  }
};

export default {
  getJobTitles,
  getSports,
};
