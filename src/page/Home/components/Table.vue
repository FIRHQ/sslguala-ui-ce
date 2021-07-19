<template>
  <el-table
    ref="listtable"
    :data="tableData"
    style="width: 100%"
    @sort-change="sortChange"
    @selection-change="handleSelectionChange"
    >
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column label="域名" sortable="custom">
      <template #default="scope">
        <i class="el-icon-link"></i>
        <a
          style="margin-left: 10px"
          target="_blank"
          :href="`https://` + scope.row.domain"
          :class="backgroundClass(scope)"
          >{{ `https://${scope.row.domain}` }}</a
        >
      </template>
    </el-table-column>
    <el-table-column label="剩余天数" sortable="custom">
      <template #default="scope">
        <span v-if="scope.row.remain_days >= 0">
          {{ scope.row.remain_days }} 天
        </span>
        <span v-else> 已过期{{ -scope.row.remain_days }} 天 </span>
      </template>
    </el-table-column>

    <el-table-column label="过期时间" sortable="custom">
      <template #default="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{
          dayjs(scope.row.expire_at).format("YYYY-MM-DD HH:mm:ss")
        }}</span>
      </template>
    </el-table-column>
    <el-table-column label="渠道">
      <template #default="scope">
        <el-tag
          style="margin-right: 5px; margin-bottom: 5px"
          size="medium"
          v-for="item in scope.row.msg_channels"
          :key="item.id"
          >
          <span class='' v-if="item.type == 'MsgChannel::Email'">
            <i class='text-xs iconfont icon-email-filling'></i>
          </span>
          <span v-else-if="item.type== 'MsgChannel::Dingtalk'">
            <i class='text-xs iconfont icon-DING_TALK'></i>
          </span>
          <span v-else-if="item.type== 'MsgChannel::Lark'">
            <i class='text-xs iconfont icon-lark1'></i>
          </span>
          <span v-else-if="item.type== 'MsgChannel::Wecom'">
            <i class='text-xs iconfont icon-weCom'></i>
          </span>

          <span v-else-if="item.type== 'MsgChannel::Webhook'">
            <i class='text-xs iconfont icon-webhook'></i>
          </span>
          <span v-else-if="item.type== 'MsgChannel::Bark'">
            <i class='text-xs iconfont icon-yaling'></i>
          </span>
          {{ item.title }}

        </el-tag>
      </template>
    </el-table-column>
    <!-- <el-table-column label="备注">
      <template #default="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{
          scope.row.expire_at
        }}</span>
      </template>
    </el-table-column> -->
    <el-table-column label="操作" width="400" align="right">
      <template #default="scope">
        <el-button size="mini" @click='handleDetails(scope.$index, scope.row)'>
          详情
        </el-button>
        <el-button size="mini" @click="handleCheck(scope.$index, scope.row.id)"
          >立即检测</el-button
        >
        <el-button
          size="mini"
          type="primary"
          @click="handleEdit(scope.$index, scope.row.id, scope.row)"
          >渠道管理</el-button
        >
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row.id)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    style="margin-top: 15px"
    @current-change="handleCurrentChange"
    :current-page="pagination.currentPage"
    :page-sizes="[10, 20, 30, 50]"
    :page-size="10"
    layout="total, prev, pager, next"
    :total="pagination.total"
  >
  </el-pagination>
  <ChannelEditPanel
    :dialogFormVisible="dialogFormVisible"
    :id="state.domain_id"
    :data="state.msgChannels"
    :able="state.ableChannels"
    v-on:toggle="toggleDialog"
    ></ChannelEditPanel>
  <!-- <EditDialog
    :dialogFormVisible="dialogFormVisible"
    :id="state.domain_id"
    :data="state.msgChannels"
    :able="state.ableChannels"
    v-on:toggle="toggleDialog"
  ></EditDialog> -->
</template>

<script setup>
import { defineProps, defineEmit, ref, reactive, toRef, watch } from "vue";
import { useRouter } from 'vue-router';
import dayjs from "dayjs";
import { ElMessage } from "element-plus";
import { delDomain, refreshCheckDomain } from "api/domain";
import { getChannelList } from "api/message";
import ChannelEditPanel from 'comps/ChannelEditPanel.vue';
// import EditDialog from "./EditDialog.vue";

const router = useRouter();

const props = defineProps({
  tableData: Array,
  pagination: Object,
  checkTableItems: Array,
  selectAll: Boolean,
});

const emit = defineEmit(["delete", "paging", "changeItem", "sortChange", "selectionChange"]);
const listtable = ref(null);
const dialogFormVisible = ref(false);
const state = reactive({
  domain_id: null,
  msgChannels: [],
  ableChannels: [],
  multipleSelection: [],
});

watch(() => props.selectAll, (newVal) => {
  if (!newVal) {
    listtable.value.clearSelection();
  }
  // console.log(1111, listtable.value.toggleAllSelection());
  // listtable.value.toggleAllSelection();
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

const sortChange = ({ column, prop, order }) => {
  emit("sortChange", { column, prop, order });
};

const handleSelectionChange = (val) => {
  emit('selectionChange', val);
};

const handleDetails = (index, row) => {
  const { id } = row;
  const projectId = row.project_id;
  router.push(`/projects/${projectId}/domains/${id}/details`);
};

const handleCheck = (index, id) => {
  refreshCheckDomain(id).then((res) => {
    const { data } = res;
    emit("changeItem", data);
    if (data.id) {
      ElMessage.success({
        message: `已重新检测 ${data.domain}`,
        type: "success",
      });
    }
  });
};

const handleDelete = (index, id) => {
  delDomain(id).then((res) => {
    emit("delete", null, props.pagination.currentPage);
  });
};

const handleEdit = (index, id, data) => {
  const result = [];
  getChannelList().then((res) => {
    res.data.forEach((item) => {
      if (data.msg_channels.every((i) => i.id !== item.id)) {
        result.push(item);
      }
    });
    state.ableChannels = result;
    state.domain_id = id;
    state.msgChannels = data.msg_channels;
    dialogFormVisible.value = true;
  });
};

const toggleDialog = () => {
  state.ableChannels = [];
  dialogFormVisible.value = false;
  emit("delete");
};
</script>
