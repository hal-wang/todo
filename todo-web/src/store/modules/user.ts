import { defineStore } from 'pinia';
import User from '/@/models/User';
import { store } from '/@/store';
import AuthCookie from '/@/utils/auth-cookie';
import request from '/@/utils/request';

interface UserState {
  user: User | null;
  token: string | null;
}
export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    user: null,
    token: AuthCookie.getToken() ?? null,
  }),
  actions: {
    async login(loginInfo: any) {
      const { account, password } = loginInfo;
      try {
        const res = await request.post<{ token: string }>(`auth`, {
          account,
          password,
        });

        this.token = res.data.token;
        AuthCookie.setToken(res.data.token);
        return res.data;
      } catch (res) {
        return;
      }
    },
    async getUserInfo() {
      try {
        const res = await request.get<User>(`user`);
        this.user = res.data;
        return this.user;
      } catch {
        return;
      }
    },
    async logout() {
      AuthCookie.removeToken();
      this.user = null;
      this.token = null;
    },
  },
});

export function useUserStoreWithOut() {
  return useUserStore(store);
}
