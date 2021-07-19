<template>
  <div class="wrap">
    <Header></Header>
    <div class="main">
      <ProjectMenu></ProjectMenu>
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, watch, computed } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import Header from "comps/Layout/Header.vue";
import ProjectMenu from "./components/ProjectMenu.vue";

const route = useRoute();
const router = useRouter();
const store = useStore();

onMounted(() => {
  store.dispatch("updateProjectList");
});

// const updateProject = () => {
//   getProjectList().then((res) => {
//     data.projects = res.data;
//   });
// };

// const selectCallBack = (name, id) => {
//   data.selectProjectName = name;
//   if (name == null) {
//     router.push("/");
//   } else {
//     router.push({
//       name: "projects",
//       params: {
//         project_id: id,
//       },
//     });
//   }
// };
</script>

<style lang="scss" scoped>
.wrap {
}
.main {
  display: flex;
  height: calc(100vh - 60px);
}
</style>
