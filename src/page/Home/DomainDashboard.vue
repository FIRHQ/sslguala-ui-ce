<template>
  <div class="table-list">
    <div class="table-list-card">
      <!-- <div class="table-list-card-top">{{ data.selectProjectName }}</div> -->
      <template v-if="data.editBatchActionVisible">
        <el-button type="text" @click="handleClickCancelTransfer"
          >取消</el-button
        >
        <el-button type="primary" size="mini" @click="handleClickTransfer"
          >转移分组</el-button
        >
      </template>
      <template v-else>
        <CreateDomain
          v-on:reload="reload"
          :projects="projects"
          :currentProjectId="parseInt(route.params.project_id) || '默认分组'"
        ></CreateDomain>
      </template>
      <div v-if="data.tableData.length">
        <Table
          :selectAll="data.editBatchActionVisible"
          :tableData="data.tableData"
          :pagination="data.pagination"
          v-on:delete="reload"
          v-on:paging="paging"
          v-on:changeItem="changeItem"
          v-on:sortChange="sortChange"
          v-on:selectionChange="selectionChange"
          :checkTableItems="data.checkTableItems"
        ></Table>
      </div>
      <div class="empty" v-else>
        <el-empty description="空空如也"></el-empty>
      </div>
    </div>
    <TransferProject
      :transferVisible="data.transferVisible"
      :projects="projects"
      :currentProjectId="parseInt(route.params.project_id)"
      :checkTableItems="data.checkTableItems"
      v-on:closeDialog="closeDialog"
      v-on:reload="reload"
    >
    </TransferProject>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, toRefs, watch, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import CreateDomain from "comps/CreateDomain.vue";
import Table from "./components/Table.vue";
import TransferProject from "./components/TransferProject.vue";
import { getDomainList } from "api/domain";

const store = useStore();
const route = useRoute();
const router = useRouter();
const projects = computed(() => store.state.projectList);
const data = reactive({
  tableData: [],
  pagination: {
    total: 0,
    currentPage: 1,
  },
  checkTableItems: [],
  sortName: "created_at",
  sortType: "asc",
  transferVisible: false,
  editBatchActionVisible: false,
  selectAll: false,
});

const fetchList = (params) => {
  params["project_id_eq"] ||= route.params.project_id;
  getDomainList(params).then((res) => {
    const pagination = {
      total: parseInt(res.headers["total-count"], 10),
      currentPage: parseInt(res.headers["current-page"], 10),
    };
    data.tableData = res.data;
    data.pagination = pagination;
  });
  store.dispatch("updateProjectList");
};

watch(
  () => route.params.project_id,
  () => {
    fetchList({ page: 1 });
  }
);

watch(
  [() => data.sortName, () => data.sortType],
  ([newVal1, newVal2], [oldVal1, oldVal2]) => {
    fetchList({
      order_name: data.sortName,
      order_desc: data.sortType === "desc",
    });
  }
);

watch(
  () => data.checkTableItems,
  (newValue) => {
    if (newValue.length > 0) {
      data.editBatchActionVisible = true;
    }
  }
);

const handleClickTransfer = () => {
  data.transferVisible = true;
};
const handleClickCancelTransfer = () => {
  data.editBatchActionVisible = false;
};
const closeDialog = () => {
  data.transferVisible = false;
};

const selectionChange = (val) => {
  data.checkTableItems = val;
};

const sortChange = ({ column, prop, order }) => {
  // console.log("####", column, prop, order);
  if (column === null) {
    data.sortName = "created_at";
    data.sortType = "asc";
    return;
  } else if (column.label === "域名") {
    data.sortName = "domain";
  } else if (column.label === "过期时间" || column.label === "剩余天数") {
    data.sortName = "expire_at";
  }
  if (order === "ascending") {
    //  sortType
    data.sortType = "asc";
  } else {
    data.sortType = "desc";
  }
};

const reload = (val, page) => {
  console.log('回传', val, page)
  if (val) { 
    fetchList({ page: 1, domain_cont: val });
  } else {
    fetchList({ page: page });
  }
};

const paging = (val) => {
  fetchList({ page: val });
};

const changeItem = (item) => {
  const index = data.tableData.findIndex((i) => i.id === item.id);
  data.tableData[index] = item;
};

onMounted(() => {
  fetchList({ page: 1 });
});
// export default {
//   setup(props) {
//     const store = useStore();
//     const route = useRoute();
//     const router = useRouter();
//     const currentProjectId = computed(() => store.state.currentProjectId);
//     const projects = computed(() => store.state.projectList);

//     const data = reactive({
//       tableData: [],
//       pagination: {
//         total: 0,
//         currentPage: 1,
//       },
//     });

//     const fetchList = (params) => {
//       params["project_id_eq"] ||= route.params.project_id;
//       getDomainList(params).then((res) => {
//         const pagination = {
//           total: parseInt(res.headers["total-count"], 10),
//           currentPage: parseInt(res.headers["current-page"], 10),
//         };
//         console.log('列表数组', res)
//         data.tableData = res.data;
//         data.pagination = pagination;
//       });
//     };

//     onMounted(() => {
//       fetchList({page: 1});
//     });

//     return {
//       ...toRefs(data),
//       projects,
//       currentProjectId,
//     };
//   },
// };
</script>
<style lang="scss" scoped>
.table-list {
  flex: 1;
  height: 100%;
  overflow: hidden;
  .table-list-card {
    margin: 16px;
    padding: 24px;
    background: #fff;
    height: calc(100% - 32px);
    overflow-y: auto;
    .table-list-card-top {
      margin-bottom: 10px;
    }
  }
}
.empty {
  margin-top: 250px;
}
</style>
