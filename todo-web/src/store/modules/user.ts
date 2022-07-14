import { defineStore } from 'pinia';
import User from '/@/models/User';
import { store } from '/@/store';
import AuthCookie from '/@/utils/AuthCookie';
import request from '/@/utils/request';

interface UserState {
  user: User | null;
}
export const useUserStore = defineStore({
  id: 'app',
  state: (): UserState => ({
    user: null,
  }),
  actions: {
    async login(loginInfo: any) {
      const { account, password } = loginInfo;
      try {
        const res = await request.post(`user`, {
          account,
          password,
        });

        this.user = res.data;
        AuthCookie.setAccount(account);
        AuthCookie.setPassword(password);
        return res.data;
      } catch (res) {
        return;
      }
    },
    logout() {
      AuthCookie.removePassword();
      this.user = null;
    },
  },
});

export function useUserStoreWithOut() {
  return useUserStore(store);
}
