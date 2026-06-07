import { create } from 'zustand';
import { clearToken, type ISchool } from '../api/auth';

interface AuthState {
  school: ISchool | null;
  isAuthenticated: boolean;
  setAuth: (schoolData: ISchool) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const savedSchool = localStorage.getItem('school_data');
  const hasToken = !!localStorage.getItem('jwt_token');

  return {
    school: savedSchool ? JSON.parse(savedSchool) : null,
    isAuthenticated: hasToken && !!savedSchool,

    setAuth: (schoolData) => {
      localStorage.setItem('school_data', JSON.stringify(schoolData));
      set({
        school: schoolData,
        isAuthenticated: true,
      });
    },

    logout: () => {
      localStorage.removeItem('school_data');
      clearToken();
      set({
        school: null,
        isAuthenticated: false,
      });
    },
  };
});
