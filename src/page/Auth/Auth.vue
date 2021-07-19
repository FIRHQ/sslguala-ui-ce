<template>
  <div class="wrap">auth</div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

onMounted(() => {
  // console.log(router, route.query);
  if (route.query.server_token) {
    window.localStorage.setItem("authToken", route.query.server_token);
    window.close();
  }
});
</script>

<style scoped>
.wrap {
}
.empty {
  margin-top: 250px;
}
</style>
