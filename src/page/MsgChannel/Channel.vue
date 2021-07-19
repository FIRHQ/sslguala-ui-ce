<template>
  <div class="wrap">
    <Header></Header>
    <div class="main">
      <!-- <ProjectMenu
        :projects="data.projects"
        :selectId="data.selectId"
        v-on:select="selectCallBack"
      ></ProjectMenu> -->
      <div class="table-list">
        <div class="table-list-card">
          <el-button
          class="mb-4"
          icon="el-icon-back"
          @click="router.back()"
          circle
        ></el-button>
          <div class="table-list-card-top">渠道列表</div>
          <div v-if="data.tableData.length">
            <Table
              :tableData="data.tableData"
              :pagination="data.pagination"
              v-on:delete="reload"
              v-on:paging="paging"
              v-on:changeItem="changeItem"
              v-on:sortChange="sortChange"
            ></Table>
          </div>
          <div class="empty" v-else>
            <el-empty description="空空如也"></el-empty>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import Header from "comps/Layout/Header.vue";
import { getDomainList } from "api/domain";
import { getChannelList } from "api/message";
import { getProjectList } from "api/projects";
import CreateDomain from "comps/CreateDomain.vue";
import Table from "./components/Table.vue";
import ProjectMenu from "../Home/components/ProjectMenu.vue";
const router = useRouter();
const data = reactive({
  selectId: 2,
  selectProjectName: "默认分组",
  tableData: [],
  sortName: "created_at",
  sortType: "asc",
  projects: [],
  pagination: {
    total: 0,
    currentPage: 1,
  },
});

const fetchList = (params) => {
  getChannelList(params).then((res) => {
    const pagination = {
      total: parseInt(res.headers["total-count"], 10),
      currentPage: parseInt(res.headers["current-page"], 10),
    };
    data.tableData = res.data;
    data.pagination = pagination;
  });
};

watch(
  [() => data.sortName, () => data.sortType],
  ([newVal1, newVal2], [oldVal1, oldVal2]) => {
    console.log("1111", data.sortName);
    fetchList({
      order_name: data.sortName,
      order_desc: data.sortType === "desc",
    });
  }
);

onMounted(() => {
  fetchList({ page: 1 });
  getProjectList().then((res) => {
    data.projects = res.data;
  });
});

const sortChange = ({ column, prop, order }) => {
  // console.log("####", column, prop, order);
  if (column === null) {
    data.sortName = "created_at";
    data.sortType = "asc";
    return;
  } else if (column.label === "域名") {
    data.sortName = "domain";
  } else if (column.label === "过期时间") {
    data.sortName = "expire_at";
  }
  if (order === "ascending") {
    //  sortType
    data.sortType = "asc";
  } else {
    data.sortType = "desc";
  }
};

const reload = () => {
  fetchList({ page: 1 });
};
const paging = (val) => {
  fetchList({ page: val });
};
const changeItem = (item) => {
  const index = data.tableData.findIndex((i) => i.id === item.id);
  data.tableData[index] = item;
};
const selectCallBack = (name, id) => {
  data.selectId = id;
  data.selectProjectName = name;
  fetchList({ page: 1, project_id_eq: id });
};
</script>

<style lang="scss" scoped>
.wrap {
}
.main {
  display: flex;
  height: calc(100vh - 60px);
}
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

<!-- <el-row :gutter="10">
      <el-col :xs="24" :sm="6" :md="4" :lg="3" :xl="11"
        ><div class="grid-content bg-purple">
          <el-input @input="onChange" v-model="input" placeholder="请输入内容"></el-input></div
      ></el-col>
      <el-col :xs="24" :sm="6" :md="8" :lg="9" :xl="1"
        ><div class="grid-content bg-purple-light">2</div
      ></el-col>
      <el-col :xs="24" :sm="6" :md="8" :lg="9" :xl="11"
        ><div class="grid-content bg-purple">3</div
      ></el-col>
      <el-col :xs="24" :sm="6" :md="4" :lg="3" :xl="1"
        ><div class="grid-content bg-purple-light">4</div
      ></el-col>
    </el-row> -->
