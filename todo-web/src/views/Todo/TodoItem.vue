<template>
  <div class="todo-item-container">
    <div class="content">
      {{ todo.content }}
    </div>

    <div class="flex flex-row justify-between">
      <div class="flex flex-row items-center space-x-2">
        <EditOutlined />
        <span>{{ updateAt }}</span>
      </div>
      <div class="flex flex-row items-center space-x-2">
        <ClockCircleOutlined />
        <span>{{ schedule }}</span>
      </div>
    </div>

    <a-popconfirm
      title="Are you sure delete this todo?"
      ok-text="Yes"
      cancel-text="No"
      @confirm="ondeleteConfirm"
    >
      <a-button :loading="deleteLoading" type="link" class="delete-btn" @click.stop="">
        <template #icon><DeleteOutlined /></template>
      </a-button>
    </a-popconfirm>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import moment from 'moment';
  import request from '/@/utils/request';
  import { DeleteOutlined, EditOutlined, ClockCircleOutlined } from '@ant-design/icons-vue';

  const props = defineProps({
    todo: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmits(['delete']);

  const deleteLoading = ref(false);
  const updateAt = computed(() => moment(props.todo.update_at).format('YYYY-MM-DD HH:mm:ss'));
  const schedule = computed(() => moment(props.todo.schedule).format('YYYY-MM-DD HH:mm:ss'));

  async function ondeleteConfirm() {
    deleteLoading.value = true;
    try {
      await request.delete(`todo/${props.todo._id}`);
      emit('delete');
    } finally {
      deleteLoading.value = false;
    }
  }
</script>

<style lang="less" scoped>
  .todo-item-container {
    background-color: white;
    width: 600px;
    min-width: 340px;
    padding: 10px;
    font-weight: 300;
    position: relative;
    margin-bottom: 1px;
    cursor: pointer;

    .content {
      font-size: 16px;
      line-height: 20px;
      letter-spacing: 1px;
      font-weight: 400;
      word-wrap: break-word;
      margin-bottom: 14px;
      margin-right: 16px;
    }

    .delete-btn {
      position: absolute;
      right: 1px;
      top: 1px;
      color: red;
    }
  }

  @media only screen and (max-width: 600px) {
    .todo-item-container {
      width: 100%;
    }
  }
</style>
