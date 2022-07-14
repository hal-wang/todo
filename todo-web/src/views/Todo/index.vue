<template>
  <a-layout v-if="user" class="layout todo-container">
    <a-layout-header>
      <Header @add="handleAddTodo" />
    </a-layout-header>
    <a-layout-content>
      <div>
        <div class="todo-items">
          <TodoItem
            v-for="todo in list"
            :key="todo._id"
            :todo="todo"
            @delete="onDelete(todo)"
            @click.stop="handleEditTodo(todo)"
          />
        </div>
        <div class="pagination">
          <a-pagination
            :loading="true"
            show-size-changer
            show-quick-jumper
            :default-current="page"
            :total="total"
            :pageSize="limit"
            @change="onPageChange"
          />
        </div>
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center"> TODO ©2022 Created by Hal Wang </a-layout-footer>

    <TodoEditDialog ref="todoEditDialog" @add="onTodoAdd" @edit="onTodoEdit" />
  </a-layout>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref, unref } from 'vue';
  import request from '/@/utils/request';
  import Todo from '/@/models/Todo';

  import TodoItem from './TodoItem.vue';
  import TodoEditDialog from './TodoEditDialog.vue';
  import Header from './Header.vue';
  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();

  const list = ref<Todo[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(10);

  const user = computed(() => userStore.user);

  const todoEditDialog = ref<typeof TodoEditDialog>(null as any);

  onMounted(() => {
    getData();
  });

  async function getData() {
    if (!user.value) return;

    const res = await request({
      url: `todo`,
      method: 'GET',
      params: {
        page: page.value,
        limit: limit.value,
      },
    });

    list.value = res.data.list;
    total.value = res.data.total;
  }

  function onPageChange(p: number, l: number) {
    page.value = p;
    limit.value = l;
    getData();
  }

  function onDelete(item: Todo) {
    list.value.splice(list.value.indexOf(item), 1);
    total.value--;
    if (!list.value.length) {
      getData();
    }
  }

  function handleAddTodo() {
    todoEditDialog.value.$init();
  }

  function handleEditTodo(todo: Todo) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    todoEditDialog.value.$init(todo);
  }

  function onTodoAdd(todo: Todo) {
    list.value.splice(0, 0, todo);
    total.value++;
  }

  function onTodoEdit(todo: Todo, oldTodo: Todo) {
    const lst = unref(list);
    lst.splice(lst.indexOf(oldTodo), 1);
    lst.splice(0, 0, todo);
  }
</script>

<style lang="less" scoped>
  .todo-items {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
  }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
