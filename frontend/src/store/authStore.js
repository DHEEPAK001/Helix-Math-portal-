import { create } from 'zustand';

const getInitialUser = () => {
  const stored = localStorage.getItem('user');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      if (user && user.role && user.role.startsWith('ROLE_')) {
        user.role = user.role.replace('ROLE_', '');
        localStorage.setItem('user', JSON.stringify(user));
      }
      return user;
    } catch (e) {
      return null;
    }
  }
  return null;
};

const useAuthStore = create((set) => ({
  user: getInitialUser(),
  token: localStorage.getItem('token') || null,
  isGuest: localStorage.getItem('isGuest') === 'true',

  login: (userData, token) => {
    if (userData && userData.role && userData.role.startsWith('ROLE_')) {
      userData.role = userData.role.replace('ROLE_', '');
    }
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    localStorage.removeItem('isGuest');
    set({ user: userData, token, isGuest: false });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isGuest');
    set({ user: null, token: null, isGuest: false });
  },

  setGuestMode: () => {
    localStorage.setItem('isGuest', 'true');
    set({ user: null, token: null, isGuest: true });
  }
}));

export default useAuthStore;
