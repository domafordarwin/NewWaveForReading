export type StoredUserType = 'student' | 'teacher' | 'parent' | 'admin';

export interface StoredUser {
  userId: number;
  name: string;
  email: string;
  userType: StoredUserType;
  isActive?: boolean;
}

const STORAGE_KEY = 'currentUser';

export const setCurrentUser = (user: StoredUser) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): StoredUser | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
};

export const clearCurrentUser = () => {
  localStorage.removeItem(STORAGE_KEY);
};
