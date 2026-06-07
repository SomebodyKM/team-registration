import { BASE_URL } from '.';

export interface ISchool {
  _id?: string;
  schoolName: string;
  isFirstLogin: boolean;
}

export interface Login {
  schoolName: string;
  password: string;
}

export interface SetupPassword {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResultType {
  message: string;
  school: ISchool;
  token?: string;
}

export const saveToken = async (token: string) => {
  localStorage.setItem('jwt_token', token);
};

export const getToken = async () => {
  return localStorage.getItem('jwt_token');
};

export const clearToken = async () => {
  localStorage.removeItem('jwt_token');
};

export const getAuthHeaders = async () => {
  const token = await getToken();
  return {
    'content-type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const login = async (loginInfo: Login): Promise<AuthResultType | null> => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(loginInfo),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('Login Failed:', err.message);
      return null;
    }

    const data: AuthResultType = await res.json();
    if (data.token) await saveToken(data.token);

    return data;
  } catch (err) {
    console.error('Login network error:', err);
    return null;
  }
};

export const setupPassword = async (
  passwordInfo: SetupPassword,
): Promise<AuthResultType | null> => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/auth/setup-password`, {
      method: 'POST',
      headers,
      body: JSON.stringify(passwordInfo),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('Setup Password Failed:', err.message);
      return null;
    }

    const data: AuthResultType = await res.json();

    return data;
  } catch (err) {
    console.error('Setup password network error:', err);
    return null;
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders();
    await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers,
    });

    await clearToken();
    return true;
  } catch (err) {
    console.error('Logout error:', err);
    return false;
  }
};
