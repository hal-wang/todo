<template>
  <div class="header">
    <div class="logo">TODO</div>

    <a-space size="large">
      <a-button type="primary" shape="circle" size="large" @click="handleAddTodo">
        <template #icon><PlusOutlined /></template>
      </a-button>

      <a-popover :title="user._id" trigger="click">
        <template #content>
          <a-button type="danger" block @click.stop="handleLogout"> Logout </a-button>
        </template>
        <a-button type="primary" shape="circle" size="large" @click.stop="">
          <template #icon><UserOutlined /></template>
        </a-button>
      </a-popover>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import User from '/@/models/User';
  import { router } from '/@/router';
  import { useUserStore } from '/@/store/modules/user';
  import { PlusOutlined, UserOutlined } from '@ant-design/icons-vue';

  const userStore = useUserStore();
  const user = computed(() => userStore.user as User);

  const emit = defineEmits(['add']);

  function handleAddTodo() {
    emit('add');
  }

  function handleLogout() {
    userStore.logout();
    router.replace({
      path: '/login',
    });
  }
</script>

<style lang="less" scoped>
  .logo {
    color: white;
    font-weight: 300;
    letter-spacing: 8px;
    font-size: 22px;
  }

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  @media only screen and (max-width: 600px) {
    .ant-layout-header {
      padding: 0 10px;
    }
  }
</style>
