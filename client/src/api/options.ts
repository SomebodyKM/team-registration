import { BASE_URL } from '.';
import { getAuthHeaders } from './auth';

export interface ISchoolOption {
  _id: string;
  schoolName: string;
}

export interface IJobTitle {
  _id: string;
  titleName: string;
}

export interface ISport {
  _id: string;
  sportName: string;
}

// Public get schools route
export const getAllSchools = async (): Promise<ISchoolOption[] | null> => {
  try {
    const res = await fetch(`${BASE_URL}/auth/schools`, {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Fetch Schools error:', err);
    return null;
  }
};

// Protected get job titles and sports routes
export const getJobTitles = async (): Promise<IJobTitle[] | null> => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/options/job-titles`, {
      method: 'GET',
      headers,
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Fetch Job Titles error:', err);
    return null;
  }
};

export const getSports = async (): Promise<ISport[] | null> => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/options/sports`, {
      method: 'GET',
      headers,
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Fetch Sports error:', err);
    return null;
  }
};
