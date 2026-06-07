import { BASE_URL } from '.';
import { getAuthHeaders } from './auth';

export interface ParticipantFormData {
  fullName: string;
  idNumber: string;
  birthday: string; //yyy-mm-dd
  jobTitleId: string;
  sportId: string;
}

export interface IParticipant extends ParticipantFormData {
  _id: string;
  schoolId: string;
  jobTitleId: any;
  sportId: any;
  createdAt: string;
}

export const getMyParticipants = async (): Promise<IParticipant[] | null> => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/participants`, {
      method: 'GET',
      headers,
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Fetch Participants error:', err);
    return null;
  }
};

export const createParticipant = async (
  data: ParticipantFormData,
): Promise<IParticipant | null> => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/participants`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('Create Participant Failed:', err.message);
      return err.message;
    }

    return await res.json();
  } catch (err) {
    console.error('Create Participant network error:', err);
    return null;
  }
};

export const updateParticipant = async (
  id: string,
  data: Partial<ParticipantFormData>,
): Promise<IParticipant | null> => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/participants/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Update Participant network error:', err);
    return null;
  }
};

export const deleteParticipant = async (id: string): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/participants/${id}`, {
      method: 'DDELETE',
      headers,
    });

    return res.ok;
  } catch (err) {
    console.error('Delete Participant network error:', err);
    return false;
  }
};
