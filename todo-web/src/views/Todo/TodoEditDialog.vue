<template>
  <div>
    <a-modal
      v-model:visible="visible"
      :title="todo ? 'Edit TODO' : 'Add TODO'"
      okText="Submit"
      :confirm-loading="submitLoading"
      @ok="handleSubmit"
    >
      <div>
        <a-form>
          <a-form-item>
            <a-textarea
              v-model:value="formData.content"
              placeholder="Content"
              :auto-size="{ minRows: 3, maxRows: 8 }"
            />
          </a-form-item>

          <a-form-item>
            <a-space>
              <ClockCircleOutlined />
              <a-date-picker v-model:value="formData.date" />
              <a-time-picker v-model:value="formData.time" />
            </a-space>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import Todo from '/@/models/Todo';
  import { computed, reactive, ref } from 'vue';
  import moment from 'moment';
  import request from '/@/utils/request';
  import { Nullable } from '@antfu/utils';
  import { message } from 'ant-design-vue';
  import { ClockCircleOutlined } from '@ant-design/icons-vue';

  const emit = defineEmits(['edit', 'add']);

  const formData = reactive({
    content: '',
    date: moment(),
    time: moment(),
  });
  const visible = ref(false);
  const submitLoading = ref(false);
  const todo = ref<Nullable<Todo>>(null);

  const schedule = computed({
    get: (): number => {
      return moment(
        formData.date.format('YYYY-MM-DD') + ' ' + formData.time.format('HH:mm:ss'),
      ).valueOf();
    },
    set: (val: number): void => {
      formData.date = moment(moment(val).format('YYYY-MM-DD'));
      formData.time = moment(
        moment(val).valueOf() -
          formData.date.valueOf() +
          moment(moment().format('YYYY-MM-DD')).valueOf(),
      );
    },
  });

  function $init(value: Todo | null): void {
    todo.value = value;

    formData.content = todo.value ? todo.value.content : '';
    schedule.value = todo.value ? todo.value.schedule : moment().valueOf();

    visible.value = true;
  }

  async function handleSubmit() {
    if (!formData.content) {
      message.warning('Please input content!');
      return;
    }
    if (!formData.date) {
      message.warning('Please select date!');
      return;
    }
    if (!formData.time) {
      message.warning('Please select time!');
      return;
    }

    const formObj = {
      schedule: schedule.value,
      content: formData.content,
    };
    submitLoading.value = true;
    try {
      if (todo.value) {
        const res = await request.patch(`todo/${todo.value._id}`, formObj);
        emit('edit', res.data, todo.value);
      } else {
        const res = await request.post(`todo`, formObj);
        emit('add', res.data);
      }
    } finally {
      submitLoading.value = false;
    }

    visible.value = false;
  }

  defineExpose({
    $init,
  });
</script>
