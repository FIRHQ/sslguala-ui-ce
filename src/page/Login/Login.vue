<template>
  <div class="flex mx-auto max-w-7xl">
    <div class="flex flex-col items-center justify-center flex-1 bg-red-500">
      <img class="w-32 h-32" src="../../assets/logo.png" />
      <p class="mt-10 text-3xl text-white">SSL挂啦?</p>
      <p class="mt-5 text-gray-50">帮您自动检测https 过期时间, 提前发出过期预警至通知渠道</p>
      <ul class="mt-4 space-y-3 text-white">
        <li>
          <i class="mr-2 text-xs iconfont icon-DING_TALK"></i>
          钉钉
        </li>
        <li>
          <i class="mr-2 text-xs iconfont icon-lark1"></i>
          飞书
        </li>
        <li>
          <i class="mr-2 text-xs iconfont icon-weCom"></i>
          企业微信
        </li>
        <li>
          <i class="mr-2 text-xs iconfont icon-email-filling"></i>
          邮箱
        </li>
        <li><i class="mr-2 text-xs text-white iconfont icon-yaling"></i>bark</li>
        <li><i class="mr-2 text-xs text-white iconfont icon-webhook"></i>webhook</li>
      </ul>
    </div>
    <div class="flex-1 wrap">
      <div class="login card">
        <el-tabs stretch v-model="activeName">
          <el-tab-pane label="微信登录" name="first">
            <div class="oauth-wx" @click="onClickWxLogin">
              <img title="微信" alt="微信" src="../../assets/WX.svg" class="oauth-btn" />
            </div>
            <el-button style="margin-top: 20px" @click="onClickWxLogin">点击登录</el-button>
            <!-- <a rel="nofollow" data-method="post" href="http://sslguala.ce04.com/users/auth/wechat">Sign in with Wechat</a> -->
            <!-- <div class="tit">
            <p>微信扫码登录</p>
            <p>首次扫码将自动完成注册</p>
          </div> -->
            <!-- <div id="qrcode" class="qrcode-wrapper"></div> -->
            <!-- <p class="desc">关注"SSLguala"服务号完成注册</p> -->
            <!-- <label class="checkbox ivu-checkbox-wrapper ivu-checkbox-small"
            ><span class="ivu-checkbox"
              ><span class="ivu-checkbox-inner"></span>
              <input type="checkbox" class="ivu-checkbox-input"
            /></span>
            扫码注册后代表您阅读并同意
            <a target="_blank" href="">《用户协议》</a></label
          > -->
          </el-tab-pane>
          <el-tab-pane label="邮箱登录" name="second">
            <EmailLogin>
              <el-button @click="activeName = 'third'" type="second">去注册</el-button>
            </EmailLogin>
          </el-tab-pane>
          <el-tab-pane label="邮箱注册" name="third">
            <EmailRegister>
              <el-button @click="activeName = 'second'" type="second">去登录</el-button>
            </EmailRegister>
          </el-tab-pane>

          <!-- <el-form
            label-position="top"
            label-width="80px"
            v-model="state.formLabelAlign"
          >
            <el-form-item
              style="text-align: left; font-weight: bold"
              label="名称"
            >
              <el-input v-model="state.formLabelAlign.name"></el-input>
            </el-form-item>
            <el-form-item
              style="text-align: left; font-weight: bold"
              label="活动区域"
            >
              <el-input v-model="state.formLabelAlign.region"></el-input>
            </el-form-item>
            <el-form-item
              style="text-align: left; font-weight: bold"
              label="活动形式"
            >
              <el-input v-model="state.formLabelAlign.type"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submitForm('dynamicValidateForm')"
                >登录</el-button
              >
            </el-form-item>
          </el-form> -->
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import QRCode from 'qrcode';
import { postSignUp } from 'api/user';
import { getCookie, saveCookie } from 'utils/cookie';
import EmailLogin from './components/EmailLogin.vue';
import EmailRegister from './components/EmailRegister.vue';

const router = useRouter();
const activeName = ref('first');
const state = reactive({
  formLabelAlign: {
    name: '',
    region: '',
    type: '',
  },
  emailPanel: {
    isLogin: true,
  },
});
const switchPath = () => {
  const gobackPath = getCookie('goback');
  if (gobackPath) {
    router.push(gobackPath);
    saveCookie('goback', '', -1);
  } else {
    router.push('/');
  }
};
onMounted(() => {
  const interval = setInterval(() => {
    const code = localStorage.getItem('authToken');
    if (code) {
      clearInterval(interval);
      switchPath();
    }
  }, 2000);
  // QRCode.toCanvas(
  //     "111",
  //     { errorCorrectionLevel: "H", width: 200 },
  //     (err, canvas) => {
  //       if (err) throw err;
  //       const container = document.getElementById("qrcode");
  //       container.appendChild(canvas);
  //     },
  //   );
  // postSignUp().then((res) => {
  //   console.log('微信登录', res);
  // });
});
const getAuthCode = () => {
  const code = localStorage.getItem('authToken');
  // localStorage.removeItem("authToken");
  // 移除localStorage监听
  window.removeEventListener('storage', getAuthCode);
  if (code) {
    // switchPath();
  }
};
const onClickWxLogin = () => {
  window.open(
    'http://sslguala.ce04.com/users/auth/wechat',
    '_blank',
    'left=0,top=0,width=800,height=599',
  );
  window.addEventListener('storage', getAuthCode);
};

const submitForm = (val) => {
  console.log(val, state.formLabelAlign);
};
</script>

<style lang="scss" scoped>
.wrap {
  background: #f2f5fa;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login {
  width: 460px;
  padding: 50px;
  text-align: center;
  min-height: 610px;
  background: #fff;
  .logo {
    font-size: 24px;
    font-weight: bold;
    img {
      width: 100px;
      height: 100px;
      margin: 0 auto 10px auto;
    }
  }
  .tit {
    font-size: 14px;
    font-weight: 700;
    margin: 24px 0;
  }
  .qrcode-wrapper {
    position: relative;
    width: 200px;
    height: 200px;
    margin: auto;
  }
  .desc {
    margin: 16px 0;
  }
}
.oauth-wx {
  // width: 45px;
  // height: 45px;
  // border-radius: 50%;
  // background-color: #f4f8fb;
  margin-top: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: auto;
    height: 4.9rem;
    vertical-align: bottom;
    cursor: pointer;
  }
}
</style>
