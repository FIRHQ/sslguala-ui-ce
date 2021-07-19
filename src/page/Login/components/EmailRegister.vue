<template>
  <div class='space-y-6'>
    <div v-if="errors.length != 0">
      <ul class='bg-red-400 text-white p-4'>
        <li v-for="(error, index) in errors" :key="index">
          {{error}}
        </li>
      </ul>
    </div>

    <el-input v-model="email" placeholder="email"></el-input>
    <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
    <el-input placeholder="再次输入密码" v-model="password2" show-password></el-input>
    <div class='flex justify-between flex-row-reverse'>
      <el-button @click='register' type="primary" >确认</el-button>
      <slot></slot>
    </div>

  </div>
</template>

<script>
import {ref, reactive, toRefs} from 'vue'
import {postSignUpByEmail } from "api/user";
import { useRouter, useRoute } from "vue-router";
export default {
  setup() {
    const router = useRouter();


    const state = reactive({
      password: '',
      password2: '',
      email: '',
      errors: [],
    })

    const register = async () => {
      try {
        const data = await postSignUpByEmail({user: {email: state.email, password: state.password, password_confirmation: state.password2}})
          console.log(data)
          window.localStorage.setItem("authToken", data.headers.authorization);
          router.push({
            name: "home",
          });
      } catch (error) {
        if(error.response.status == 422){
          state.errors = error.response.data.error
        }
      }

    }

    return {
      ...toRefs(state),
      register
    }
  }

}
</script>

<style>

</style>
