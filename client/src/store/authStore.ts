import { create } from "zustand";
import { tabManager } from "../utils/tabManager";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  tabId: string;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  initializeFromStorage: () => void;
};

export const useAuthStore: any = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  tabId: tabManager.getTabId(),

  login: (user, token) => {
    // Store auth data in tab-specific storage
    tabManager.setTabData('user', user);
    tabManager.setTabData('token', token);
    tabManager.setTabData('isAuthenticated', true);
    
    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    // Clear tab-specific auth data
    tabManager.clearTabData();
    
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  setUser: (user) => {
    tabManager.setTabData('user', user);
    set((state) => ({
      ...state,
      user,
    }));
  },

  initializeFromStorage: () => {
    const tabData = tabManager.getTabData();
    const user = tabData.user || null;
    const token = tabData.token || null;
    const isAuthenticated = tabData.isAuthenticated || false;

    set({
      user,
      token,
      isAuthenticated,
    });
  },
}));
