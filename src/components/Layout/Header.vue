<template>
  <header class="header">
    <div class="container">
      <div class="logo flex items-center cursor-pointer" @click="router.push('/')">
        <img
          @click="router.push('/')"
          class="logo-img cursor-pointer mr-3"
          src="../../assets/logo.png"
          alt=""
        />
        SSL挂啦?
      </div>
      <div v-if="!isLogin" v-on:click="goLogin">登录</div>
      <div v-else>
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="text-white">
            个人中心 {{ state.userInfo.first_name || state.userInfo.email
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="channels">渠道列表</el-dropdown-item>
              <el-dropdown-item command="token">api token</el-dropdown-item>
              <el-dropdown-item command="signout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- <el-menu
          style="color: #fff"
          mode="horizontal"
          background-color="#409eff"
          text-color="#ffffff"
          @select="menuSelect"
        >
          <el-submenu index="1">
            <template #title
              >个人中心
              {{ state.userInfo.first_name || state.userInfo.email }}</template
            >
            <el-menu-item index="2-2">渠道列表</el-menu-item>
            <el-menu-item index="2-4">api文档</el-menu-item>
            <el-menu-item index="2-3">api token</el-menu-item>
            <el-menu-item index="2-1">退出登录</el-menu-item>
          </el-submenu>
        </el-menu> -->
      </div>
    </div>
    <ApiTokenDialog
      :dialogVisible="state.dialogVisible"
      :token="state.userInfo.api_token"
      v-on:resetapitoken="resetApitoken"
      v-on:closeDialog="closeDialog"
    ></ApiTokenDialog>
  </header>
</template>

<script setup>
import { defineProps, reactive, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getUserInfo } from "api/user";
import ApiTokenDialog from "comps/ApiTokenDialog.vue";

const router = useRouter();

const isLogin = ref(false);

const state = reactive({
  userInfo: {},
  dialogVisible: false,
});
// watch(
//   () => state.channel_form,
//   (newValue, oldValue) => {
//     console.log(newValue);
//   },
// );
// watchEffect(() => {
//   console.log(state.channel_form);
// });

onMounted(() => {
  const code = window.localStorage.getItem("authToken");
  if (code) {
    isLogin.value = true;

    getUserInfo().then((res) => {
      state.userInfo = res.data;
    });
  }
});

const menuSelect = (index) => {
  if (index === "2-1") {
    localStorage.removeItem("authToken");
    router.push("/login");
  }
  if (index === "2-2") {
    router.push("/msg_channels");
  }
  if (index === "2-4") {
    router.push("/api/description");
  }
  if (index === "2-3") {
    state.dialogVisible = true;
  }
};

const resetApitoken = (val) => {
  state.userInfo.api_token = val;
};

const handleCommand = (command) => {
  switch (command) {
  case "channels":
    router.push("/msg_channels");
    break;
  case "token":
    state.dialogVisible = true;
    break;
  case "signout":
    localStorage.removeItem("authToken");
    router.push("/login");
    break;
  default:
    break;
  }
};

const closeDialog = () => {
  state.dialogVisible = false;
};

const goLogin = () => {
  // console.log(router);
  router.push({
    name: "login",
  });
};
</script>

<style lang="scss" scoped>
.header {
  // position: fixed;
  // top: 0;
  // z-index: 9;
  width: 100%;
  height: 65px;
  background: #409eff;
  color: #fff;
}
.container {
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
}
.logo {
  font-size: 24px;
  font-weight: bold;
  .logo-img {
    width: 50px;
    height: 50px;
    // &:hover {
    //   cursor: pointer;
    // }
  }
}
.content {
  width: 600px;
  margin: 0 auto;
  padding-top: 20px;
}
.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
// @media (min-width: 767px) {
//   .container {
//     width: 767px;
//   }
// }
// @media (min-width: 992px) {
//   .container {
//     width: 990px;
//   }
// }
// @media (min-width: 1200px) {
//   .container {
//     width: 1100px;
//   }
// }
.el-menu.el-menu--horizontal {
  border: none;
}
.el-dropdown-menu__item {
  padding: 0 40px;
}
</style>
<style lang="scss">
.el-popper__arrow {
  // display: none !important;
  top: 2px !important;
}
</style>
