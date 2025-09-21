import { useApp } from '../contexts/AppContext';

export function useAuth() {
  const { state, login, logout, register } = useApp();

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    logout,
    register,
  };
}