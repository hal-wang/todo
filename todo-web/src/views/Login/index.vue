<template>
  <div class="login-container" :style="{ backgroundImage: `url(${background})` }">
    <a-form :model="formData" class="login-form" @finish="handleLogin">
      <div class="title">
        <h1>TODO</h1>
      </div>
      <a-form-item>
        <a-input
          v-model:value="formData.email"
          placeholder="Email"
          :rules="[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]"
        />
      </a-form-item>
      <a-form-item>
        <a-input
          v-model:value="formData.password"
          type="password"
          placeholder="Password"
          :rules="[{ required: true, message: 'Please input your Password!' }]"
        />
      </a-form-item>

      <a-form-item
        :label-col="{
          style: {
            width: 0,
          },
        }"
      >
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loginLoading">
          Login / Signup
        </a-button>
      </a-form-item>
      <div class="btns"> </div>
      <div class="tips">
        <span>
          A demo of
          <a href="https://halsp.org" target="_blank"> Halsp </a>
          ,
        </span>
        <span>data persistence is not guaranteed!</span>
      </div>
    </a-form>

    <div class="bing">from bing</div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, ref } from 'vue';
  import request from '/@/utils/request';
  import { useUserStore } from '/@/store/modules/user';
  import { router } from '/@/router';

  const userStore = useUserStore();

  const formData = reactive({
    email: '',
    password: '',
  });
  const background = ref('');
  const loginLoading = ref(false);

  const user = computed(() => userStore.user);

  onMounted(async () => {
    if (user.value) {
      router.replace({
        path: '/',
      });
      return;
    }

    const res = await request.get(`bing`);
    const img = res.data;

    const bingUrl = 'https://www.bing.com';
    background.value = ''.startsWith(bingUrl) ? img.url : `${bingUrl}${img.url}`;
    console.log('bg', background.value);
  });

  async function handleLogin() {
    loginLoading.value = true;
    try {
      const user = await userStore.login({
        account: formData.email,
        password: formData.password,
      });

      if (user) {
        router.replace({
          path: '/',
        });
      }
    } finally {
      loginLoading.value = false;
    }
  }
</script>

<style lang="less" scoped>
  .login-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-position: center;
    position: relative;

    .login-form {
      width: 400px;
      background-color: white;
      padding: 20px 40px;
      border-radius: 4px;

      .title {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        font-weight: bold;
        font-size: 20px;
      }

      .tips {
        display: flex;
        flex-direction: column;
        margin-top: 6px;
        font-size: 14px;
        font-weight: 300;
      }
    }

    .bing {
      position: absolute;
      right: 8px;
      bottom: 10px;
      background: #fff9;
      padding: 4px 10px;
      font-size: 14px;
      line-height: 14px;
    }

    @media only screen and (max-width: 600px) {
      .login-form {
        width: 100%;
        padding: 20px;
        min-width: 300px;
        border-radius: 0;
      }
    }
  }
</style>
