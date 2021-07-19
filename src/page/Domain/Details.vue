<template>
  <div class="table-list">
    <div class="table-list-card" v-if="state.domain != null">
      <h1 class="my-6 text-xl font-semibold">{{ state.domain.domain }}</h1>

      <div class="space-y-4">
        <p>
          <span class="inline-block w-32 font-bold">过期时间</span
          ><span>{{
            dayjs(state.domain.expire_at).format("YYYY-MM-DD HH:mm:ss")
          }}</span>
          <span class="text-sm">
            ({{ dayjs().to(dayjs(state.domain.expire_at)) }})</span
          >
        </p>
        <p>
          <span class="inline-block w-32 font-bold">分组名</span
          ><span>{{ projectName }}</span>
        </p>
        <p>
          <span class="inline-block w-32 font-bold">上次检查时间</span
          ><span>{{
            dayjs(state.domain.check_expire_time_at).format(
              "YYYY-MM-DD HH:mm:ss"
            )
          }}</span>
          <span class="text-sm">
            ({{ dayjs().to(dayjs(state.domain.check_expire_time_at)) }})</span
          >
          <span class="ml-4">
            <el-button type="button" @click="handleCheck">立即检查</el-button>
          </span>
        </p>
        <div class="flex items-center">
          <span class="inline-block w-32 font-bold">备注信息</span>
          <template v-if="state.editMarkup">
            <div>
              <el-input
                class="w-56"
                v-model="markup"
                type="textarea"
                size="small"
                placeholder="请输入内容"
                @change="handleChangeInput"
              ></el-input>
              <div class="flex mt-3">
                <el-button size="small" @click="state.editMarkup = false"
                  >取消</el-button
                >
                <el-button
                  type="primary"
                  size="small"
                  @click="handleSubmitMarkup"
                  >提交</el-button
                >
              </div>
            </div>
          </template>
          <template v-else>
            <div v-if="state.domain.markup == ''">
              <span class="text-red-400"
                >很遗憾, 您没有写任何备注, 建议您补充下负责人,
                以及域名对应的业务</span
              >
            </div>
            <div style="white-space: pre-wrap" v-else>
              {{ state.domain.markup }}
            </div>
            <el-button
              class="ml-3"
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="handleEditRemark(state.domain.markup)"
              circle
            ></el-button>
          </template>
        </div>
        <div class="flex">
          <span class="inline-block w-32 font-bold">警报渠道</span>
          <ul class="flex">
            <li>
              <el-tag
                style="margin-right: 5px; margin-bottom: 5px"
                size="medium"
                v-for="item in state.domain.msg_channels"
                :key="item.id"
              >
                <span class="" v-if="item.type == 'MsgChannel::Email'">
                  <i class="text-xs iconfont icon-email-filling"></i>
                </span>
                <span v-else-if="item.type == 'MsgChannel::Dingtalk'">
                  <i class="text-xs iconfont icon-DING_TALK"></i>
                </span>
                <span v-else-if="item.type == 'MsgChannel::Lark'">
                  <i class="text-xs iconfont icon-lark1"></i>
                </span>
                <span v-else-if="item.type == 'MsgChannel::Wecom'">
                  <i class="text-xs iconfont icon-weCom"></i>
                </span>
                {{ item.title }}
              </el-tag>
            </li>
          </ul>
          <el-button size="mini" type="primary" class="ml-2" @click="handleEdit"
            >渠道管理</el-button
          >
        </div>
      </div>
    </div>
    <div v-else>
      <el-skeleton />
    </div>
    <ChannelEditPanel
      :dialogFormVisible="state.dialogFormVisible"
      :id="props.id"
      :data="state.msgChannels"
      :able="state.ableChannels"
      v-on:toggle="toggleDialog"
    ></ChannelEditPanel>
  </div>
</template>

<script>
import { onMounted, reactive, computed, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ElMessage } from "element-plus";
import ChannelEditPanel from "comps/ChannelEditPanel.vue";
import { getChannelList } from "api/message";
import {
  getDomainDetails,
  refreshCheckDomain,
  updateDomainInfo,
} from "api/domain";
import { saveCookie } from "utils/cookie";

dayjs.extend(relativeTime);

export default {
  components: {
    ChannelEditPanel,
  },
  props: {
    project_id: {
      type: Number,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const projects = computed(() => store.state.projectList);

    const route = useRoute();
    const markup = ref("");
    const state = reactive({
      domain_id: null,
      domain: null,
      projectName: null,
      dialogFormVisible: false,
      msgChannels: [],
      ableChannels: [],
      editMarkup: false,
    });
    const projectName = computed(() => {
      try {
        const tmp = store.state.projectList.filter(
          (project) => project.id == props.project_id
        );
        if (tmp.length > 0) return tmp[0].name;
        else {
          return "";
        }
      } catch {
        return "";
      }
    });

    const fetchDomainDetail = async () => {
      try {
        const data = await getDomainDetails({ id: props.id });
        state.domain = data.data;
        state.msgChannels = data.data.msg_channels;
      } catch (error) {
        if (error.response.status === 401) {
          saveCookie("goback", route.path, 1);
        }
      }
    };

    onMounted(() => {
      fetchDomainDetail();
    });

    const handleChangeInput = (val) => {
      markup.value = val;
    };

    const handleSubmitMarkup = () => {
      const params = {
        markup: markup.value,
      };
      updateDomainInfo(props.id, params).then((res) => {
        ElMessage.success({
          message: `提交成功`,
          type: "success",
        });
        state.domain.markup = res.data.markup;
        state.editMarkup = false;
      });
    };

    const handleCheck = () => {
      refreshCheckDomain(props.id).then((res) => {
        const { data } = res;
        if (data.id) {
          ElMessage.success({
            message: `已重新检测 ${data.domain}`,
            type: "success",
          });
        }
        state.domain = res.data;
      });
    };

    const handleEdit = (index) => {
      const result = [];
      getChannelList().then((res) => {
        res.data.forEach((item) => {
          if (state.domain.msg_channels.every((i) => i.id !== item.id)) {
            result.push(item);
          }
        });
        state.ableChannels = result;
        // state.domain_id = id;
        // state.msgChannels = data.msg_channels;
        state.dialogFormVisible = true;
      });
    };

    const toggleDialog = () => {
      state.ableChannels = [];
      state.dialogFormVisible = false;
      fetchDomainDetail();
    };

    const handleEditRemark = (val) => {
      markup.value = val;
      state.editMarkup = true;
    };
    return {
      state,
      props,
      projectName,
      dayjs,
      markup,
      handleCheck,
      handleEdit,
      handleChangeInput,
      handleSubmitMarkup,
      handleEditRemark,
      toggleDialog,
    };
  },
};
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
</style>
