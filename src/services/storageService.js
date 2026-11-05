import { INITIAL_ASSIGNMENTS, SEED_USERS } from '../data/seedData';

export const STORAGE_KEYS = {
  ASSIGNMENTS: 'joineazy_v1_assignments',
  CURRENT_USER: 'joineazy_v1_currentUser',
  THEME: 'joineazy_v1_theme',
};

export function safeGetItem(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (error) {
    return defaultValue;
  }
}

export function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

export function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}

export function loadAssignments() {
  const stored = safeGetItem(STORAGE_KEYS.ASSIGNMENTS, null);
  if (Array.isArray(stored) && stored.length > 0) {
    return stored;
  }
  safeSetItem(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
  return INITIAL_ASSIGNMENTS;
}

export function saveAssignments(assignments) {
  return safeSetItem(STORAGE_KEYS.ASSIGNMENTS, assignments);
}

export function loadCurrentUser() {
  const storedUser = safeGetItem(STORAGE_KEYS.CURRENT_USER, null);
  if (storedUser && storedUser.id) {
    const found = SEED_USERS.find((user) => user.id === storedUser.id);
    if (found) return found;
  }
  return null;
}

export function saveCurrentUser(user) {
  return safeSetItem(STORAGE_KEYS.CURRENT_USER, user);
}

export function loadTheme() {
  const stored = safeGetItem(STORAGE_KEYS.THEME, null);
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function saveTheme(theme) {
  return safeSetItem(STORAGE_KEYS.THEME, theme);
}

export function resetStorageToDefaults() {
  safeSetItem(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
  safeSetItem(STORAGE_KEYS.CURRENT_USER, SEED_USERS[0]);
  return {
    assignments: INITIAL_ASSIGNMENTS,
    user: SEED_USERS[0],
  };
}
