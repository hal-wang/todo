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
    user: AuthCookie.getLoginInfo(),
  }),
  actions: {
    async login(loginInfo: any) {
      const { account, password } = loginInfo;
      try {
        const res = await request.post<User>(`user`, {
          account,
          password,
        });

        this.user = res.data;
        AuthCookie.setLoginInfo(res.data);
        return res.data;
      } catch (res) {
        return;
      }
    },
    logout() {
      AuthCookie.removeLoginInfo();
      this.user = null;
    },
  },
});

export function useUserStoreWithOut() {
  return useUserStore(store);
}
