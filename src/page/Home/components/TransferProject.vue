<template>
  <el-dialog
    title="转移所选的域名至"
    destroy-on-close
    v-model="transferVisible"
    @close="closeDialog"
  >
    <el-form :model="state.form">
      <el-form-item label="">
        <el-select v-model="currentProjectId" placeholder="请选择" @change="handleSelect">
          <el-option
              v-for="item in projects"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClickCancel">取 消</el-button>
        <el-button type="primary" @click="handleClickTransfer"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { defineProps, reactive, defineEmit } from 'vue';
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { transferProject } from 'api/projects';

const route = useRoute();
const props = defineProps({
  transferVisible: Boolean,
  currentProjectId: Number,
  projects: Array,
  checkTableItems: Array,
  closeDialog: Function,
});
const emit = defineEmit(["closeDialog", "reload"]);
const store = useStore();
const state = reactive({
  form: {
    select: '',
  },
});

const handleSelect = (val) => {
  state.form.select = val;
};

const handleClickTransfer = () => {
  const ids = [];
  props.checkTableItems.forEach((item) => {
    ids.push(item.id.toString());
  });
  const params = {
    domain_ids: ids,
  };
  transferProject(state.form.select, params).then((res) => {
    emit("closeDialog");
    emit("reload");
    console.log(res.data.id, route.params.project_id);
    store.commit('updateProjectItemCount', { id: res.data.id, currentProjectId: route.params.project_id });
  });
};
const handleClickCancel = () => {
  emit("closeDialog");
};
</script>
