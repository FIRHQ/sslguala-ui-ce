<template>
  <div class="space-y-6">
    <div v-if="error === true" class="p-4 bg-red-400 text-white">
      账号密码错误或账号不存在
    </div>
    <el-input v-model="email" placeholder="email"></el-input>
    <el-input
      placeholder="请输入密码"
      v-model="password"
      show-password
    ></el-input>
    <div class="flex justify-between flex-row-reverse">
      <el-button @click="login" type="primary">确认</el-button>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { ref, reactive, toRefs } from "vue";
import { useRouter, useRoute } from "vue-router";
import { postSignInByEmail } from "api/user";
import { getCookie, saveCookie } from "utils/cookie";

export default {
  setup() {
    const router = useRouter();
    const state = reactive({
      password: "",
      password2: "",
      email: "",
      error: false,
    });
    const login = async () => {
      try {
        const data = await postSignInByEmail({
          user: { login: state.email, password: state.password },
        });
        window.localStorage.setItem("authToken", data.headers.authorization);
        const gobackPath = getCookie("goback");
        if (gobackPath) {
          router.push(gobackPath);
          saveCookie("goback", "", -1);
        } else {
          router.push("/");
        }
      } catch (e) {
        console.log(e);
      }
    };

    return {
      ...toRefs(state),
      login,
    };
  },
};
</script>

<style></style>
