import { defineStore } from 'pinia';
import User from '/@/models/User';
import { store } from '/@/store';
import request from '/@/utils/request';

interface UserState {
  user: User | null;
}
export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    user: null,
  }),
  actions: {
    async login(loginInfo: any) {
      const { account, password } = loginInfo;
      await request.post(`auth`, {
        account,
        password,
      });
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
    async logout(req = true) {
      if (req) {
        await request.delete<User>(`auth`);
      }
      this.user = null;
    },
  },
});

export function useUserStoreWithOut() {
  return useUserStore(store);
}
