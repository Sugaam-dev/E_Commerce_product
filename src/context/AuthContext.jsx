import { createContext, useContext, useState, useCallback } from 'react';
import { admins, superAdminUser } from '../data/mockData';

// ─── Context ──────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Helpers ──────────────────────────────────────────────────
const STORAGE_KEY = 'pmrg_current_user';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(user) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// ─── Provider ────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => loadFromStorage());

  /**
   * login — accepts either an adminId string (e.g. 'ADM-001')
   * or the special string 'superadmin'.
   */
  const login = useCallback((userId) => {
    if (userId === 'superadmin') {
      const user = { ...superAdminUser };
      saveToStorage(user);
      setCurrentUser(user);
      return { success: true };
    }

    const admin = admins.find(a => a.id === userId);
    if (!admin) return { success: false, error: 'Admin not found.' };
    if (admin.status === 'Suspended') {
      return {
        success: false,
        error: 'Your account has been suspended. Please contact the Super Admin.',
      };
    }

    const user = {
      id: admin.id,
      name: admin.name,
      businessName: admin.businessName,
      email: admin.email,
      role: 'admin',
      avatarInitials: admin.avatarInitials,
      status: admin.status,
    };
    saveToStorage(user);
    setCurrentUser(user);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    saveToStorage(null);
    setCurrentUser(null);
  }, []);

  const value = {
    currentUser,
    isAdmin: currentUser?.role === 'admin',
    isSuperAdmin: currentUser?.role === 'superadmin',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
