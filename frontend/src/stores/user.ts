import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '@/api/user';
import type { User, LoginParams, RegisterParams } from '@/types';

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<User | null>(null);

  const isLoggedIn = computed(() => !!token.value && !!user.value);

  async function login(params: LoginParams) {
    const response = await authApi.login(params);
    token.value = response.accessToken;
    user.value = response.user;
    localStorage.setItem('token', response.accessToken);
    return response;
  }

  async function register(params: RegisterParams) {
    const response = await authApi.register(params);
    token.value = response.accessToken;
    user.value = response.user;
    localStorage.setItem('token', response.accessToken);
    return response;
  }

  async function fetchCurrentUser() {
    if (!token.value) return;
    try {
      user.value = await authApi.getCurrentUser();
    } catch (error) {
      logout();
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
  }

  function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  }

  return {
    token,
    user,
    isLoggedIn,
    login,
    register,
    fetchCurrentUser,
    logout,
    setToken,
  };
});
