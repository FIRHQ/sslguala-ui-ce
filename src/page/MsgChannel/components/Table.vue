<template>
  <el-table :data="tableData" style="width: 100%" @sort-change="sortChange">    
    <el-table-column label="名称">
      <template #default="scope">
        <span>{{scope.row.title}}  ({{scope.row.type}})</span>
      </template>
    </el-table-column>
    <el-table-column label="链接地址">
      <template #default="scope">
        <i class="el-icon-link"></i>
        <span>{{
          scope.row.url
        }}</span>
      </template>
    </el-table-column>
    <el-table-column label="备注">
      <template #default="scope">        
        <span>{{
          scope.row.markup
        }}</span>
      </template>
    </el-table-column>
    <el-table-column label="其他内容">
      <template #default="scope">
        <span>{{
          scope.row.config_email || scope.row.config_secret
        }}</span>
      </template>
    </el-table-column>    
    
    <el-table-column label="操作" width="300" align="right">
      <template #default="scope">
        <el-button size="mini" @click="trySendMessage(scope.$index, scope.row.id)"
          >尝试发送</el-button
        >
        <!-- <el-button
          size="mini"
          type="primary"
          @click="handleEdit(scope.$index, scope.row.id, scope.row)"
          >编辑(N)</el-button
        > -->
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row.id)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <!-- <EditDialog
    :dialogFormVisible="dialogFormVisible"
    :id="state.domain_id"
    :data="state.msgChannels"
    v-on:toggle="toggleDialog"
    :able="state.ableChannels"
  ></EditDialog> -->
</template>

<script setup>
import { defineProps, defineEmit, ref, reactive, toRef } from "vue";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";
import { delDomain, refreshCheckDomain } from "api/domain";
import { getChannelList, deleteChannel, trySendChannelMessage } from "api/message";
// import EditDialog from "../Home/components/EditDialog.vue";

const props = defineProps({
  tableData: Array,
  pagination: Object,
});

const emit = defineEmit(["delete", "paging", "changeItem", 'sortChange']);

const dialogFormVisible = ref(false);
const state = reactive({
  domain_id: null,
  msgChannels: [],
  ableChannels: [],
});

const backgroundClass = (scope) => {
  const days = scope.row.remain_days;
  if (days < 0) {
    return "bg-red-400 text-white px-2";
  } else if (days < 15) {
    return "bg-yellow-500 text-white px-2";
  }
};
const handleCurrentChange = (page) => {
  emit("paging", page);
};

const sortChange = ({column, prop, order}) => {
  emit("sortChange", {column, prop, order})
}

const trySendMessage = (index, id) => {
  trySendChannelMessage(id).then((res) => {
    console.log('res', res)
  })  
};
const handleDelete = (index, id) => {
  deleteChannel(id).then((res) => {
    emit("delete");
  });
};
const toggleDialog = () => {
  dialogFormVisible.value = false;
  emit("delete");
};
</script>
