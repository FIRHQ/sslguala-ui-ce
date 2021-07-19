<template>
  <div class="container">
    <div class="top-box">
      <div>
        分组管理
        <span style="font-size: 12px; color: #7b7f93">{{
          projects.length
        }}</span>
      </div>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-plus"
        plain
        @click="dialogVisible = true"
      ></el-button>
    </div>
    <div class="list-box">
      <div
        class="list-box-item"
        :class="route.params.project_id === null ? 'select-item' : null"
        @click="selectItem(null, null)"
      >
        <div class="item-label">全部分组</div>
        <div class="item-num"></div>
      </div>
      <div
        class="list-box-item"
        :class="route.params.project_id == item.id ? 'select-item' : null"
        @click="selectItem(item.name, item.id)"
        v-for="item in projects"
        :key="item.id"
      >
        <div class="item-label">
          <el-popover
            placement="bottom"
            title="删除分组"
            :width="150"
            trigger="hover"
          >
            <div style="text-align: right; margin: 0">
              <!-- <el-button size="mini" type="text" @click="visible = false"
                >取消</el-button
              > -->
              <el-button type="danger" size="mini" @click="delProject(item.id)"
                >确定</el-button
              >
            </div>
            <template #reference>
              <i class="el-icon-delete icon-hover" style="margin-right: 5px">
              </i>
            </template>
          </el-popover>
          {{ item.name }}
        </div>
        <div class="item-num">{{ item.check_domains_count || 0 }}</div>
      </div>
    </div>
  </div>
  <el-dialog
    title="添加分组"
    v-model="dialogVisible"
    width="30%"
  >
    <el-form :model="state.form" label-position="top">
      <el-form-item label="分组名称" :label-width="formLabelWidth">
        <el-input v-model="state.form.name" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProject">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, defineProps, defineEmit, computed } from "vue";
import { useStore } from "vuex";
import { addProjecctItem, delProjectItem } from "api/projects";
import { useRouter, useRoute } from "vue-router";

// defineProps({
//   projects: Array,
//   selectId: Number,
// });
const emit = defineEmit(["select", "updateProject"]);
const router = useRouter();
const route = useRoute();
const store = useStore();
// const currentProjectId = computed(() => store.state.currentProjectId);
const projects = computed(() => store.state.projectList);
const dialogVisible = ref(false);
const state = reactive({
  form: {
    name: "",
  },
});
const addProject = () => {
  const params = {
    name: state.form.name,
  };
  addProjecctItem(params).then((res) => {
    dialogVisible.value = false;
    // emit("updateProject");
    store.commit("addProjectItem", { data: res.data });
  });
};
const delProject = (id) => {
  delProjectItem(id).then((res) => {
    // emit("updateProject");
    store.commit("delProjectItem", { id });
  });
};
const selectItem = (name, id) => {
  if (name == null) {
    router.push("/projects");
  } else {
    router.push(`/projects/${id}`);
  }
  // emit("select", name, id);
  // store.commit("updateCurrentProjectId", { currentProjectId: id });
};
</script>
<style lang="scss" scoped>
.container {
  width: 200px;
  height: 100%;
  background-color: #fff;
  border-right: 1px solid #ebecf3;
}
.top-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 20px;
}
.list-box {
  margin-top: 10px;
  color: #495a7c;
  .list-box-item {
    height: 50px;
    padding: 0 16px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .item-label {
    }
    .item-num {
      color: #409eff;
    }
    &:hover {
      background: rgba(217, 232, 255, 0.3);
    }
  }
  .select-item {
    font-weight: 500;
    background: #d9e8ff;
    &:hover {
      background: #d9e8ff;
    }
  }
}
.icon-hover:hover {
  color: #409eff;
}
</style>
