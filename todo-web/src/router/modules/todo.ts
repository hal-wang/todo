import { RouteRecordRaw } from 'vue-router';

const todo: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Todo',
    component: () => import('/@/views/Todo/index.vue'),
    meta: {
      title: 'todo',
    },
  },
];

export default todo;
