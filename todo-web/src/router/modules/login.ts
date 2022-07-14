import { RouteRecordRaw } from 'vue-router';

const login: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('/@/views/Login/index.vue'),
    meta: {
      title: '登录',
    },
  },
];

export default login;
