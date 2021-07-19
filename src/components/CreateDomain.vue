<template>
  <el-row>
    <el-col class="flex items-center mb-3">
      <div>
        {{ route.params.project_id ? projectName : "全部分组" }}
        <span class="text-xs text-blue-400"
          >共
          {{
            route.params.project_id ? projectDomainCount : domainsCount
          }}
          个域名</span
        >
      </div>
      <el-button class="ml-3" size="small" @click="handleClickBatchAction"
        >批量创建</el-button
      >
    </el-col>
  </el-row>
  <el-row style="margin-bottom: 10px">
    <el-col :span="22">
      <el-input
        placeholder="sslguala.com"
        v-model.trim="domain"
        clearable
        @input="onInput"
        @change="onChange"
        @keyup.enter.native="handleClickAddDomain"
      >
      </el-input>
    </el-col>
    <el-col :span="2" style="text-align: right">
      <el-button type="primary" @click="handleClickAddDomain"
      :loading="state.loading" >新建域名</el-button
      >
    </el-col>
  </el-row>
  <el-dialog
    destroy-on-close
    title="创建流程"
    v-model="dialogStepVisible"
    @close="closeDialog"
  >
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps>
    <div v-if="active === 0" class="content">
      <el-form :model="state.form" label-position="top">
        <el-form-item label="域名">
          <el-input
            v-if="!state.isBatch"
            v-model="domain"
            placeholder="请输入合法的域名"
            autocomplete="off"
          ></el-input>
          <BatchCreateDomains v-on:passon="passon" v-else></BatchCreateDomains>
        </el-form-item>
        <el-form-item label="分组">
          <el-select
            v-model="currentProjectId"
            placeholder="请选择分组"
            @change="handleSelect"
          >
            <el-option
              v-for="item in projects"
              :label="item.name"
              :value="item.id"
            ></el-option>
            <!-- <el-option label="分组二" value="beijing"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            v-model="state.form.markup"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button style="margin-top: 12px" @click="nextChannel"
        >下一步</el-button
      >
    </div>
    <div v-else-if="active === 1" class="content">
      <div class="title">常用渠道:</div>
      <el-checkbox-group v-model="state.checkList">
        <el-checkbox
          :label="item.id"
          :key="index"
          v-for="(item, index) in state.isCommonChannels"
          >{{ item.title }}</el-checkbox
        >
      </el-checkbox-group>
      <el-divider></el-divider>
      <el-button
        style="margin-bottom: 10px"
        type="primary"
        icon="el-icon-plus"
        @click="add"
        >新建</el-button
      >
      <template v-if="editVisible">
        <ChannelTypeForm :Channelform="state.channel_form"></ChannelTypeForm>
      </template>
      <el-divider></el-divider>
      <div>
        <el-button style="margin-top: 12px" @click="skip">稍后设置</el-button>
        <el-button type="primary" style="margin-top: 12px" @click="nextSure()"
          >下一步</el-button
        >
      </div>
    </div>
    <div v-else class="content">
      <el-result icon="success" title="创建成功" subTitle="成功创建的域名:">
        <template #extra>
          <div>
            <el-tag
              style="margin-right: 5px; margin-bottom: 5px"
              size="medium"
              v-for="(item, index) in state.successDomains"
              :key="index"
              >{{
                item.domain
              }}</el-tag
            >
          </div>
          <!-- <div>
            <el-tag
              style="margin-right: 5px; margin-bottom: 5px"
              size="medium"
              v-for="(item, index) in state.checkList"
              :key="index"
              >{{
                state.isCommonChannels.find((i) => i.id == item).title
              }}</el-tag
            >
          </div> -->
          <el-button style="margin-top: 12px" @click="pre"
            >继续添加渠道</el-button
          >
          <el-button type="primary" style="margin-top: 12px" @click="end"
            >完成</el-button
          >
        </template>
      </el-result>
    </div>
  </el-dialog>
</template>
<script setup>
import {
  defineProps,
  reactive,
  ref,
  onMounted,
  watch,
  defineEmit,
  watchEffect,
  computed,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import URI from "urijs";
import {
  getDomainList,
  postDomain,
  validCheckDomain,
  batchCreateDomains,
} from "api/domain";
import {
  postChannel,
  getChannelList,
  bindChannelDomain,
  batchBindChannel,
} from "api/message";
import BatchCreateDomains from "comps/BatchCreateDomains.vue";
import ChannelTypeForm from "./CreateDomain/ChannelTypeForm.vue";

const props = defineProps({
  projects: Array,
  currentProjectId: Number,
});

const route = useRoute();
const router = useRouter();
const store = useStore();
const emit = defineEmit(["reload"]);
const state = reactive({
  form: {
    domain: "",
    markup: "",
    project_id: "",
  },
  channel_form: {
    title: "",
    url: "",
    type: "",
    markup: "",
    is_common: true,
    config_secret: "",
    // config_custom_string: "",
    domain_id: "",
    config_email: "",
  },
  isCommonChannels: [],
  checkList: [],
  rules: {
    title: [{ required: true, message: "请输入标识名称", trigger: "blur" }],
    url: [{ required: true, message: "请输入通知地址", trigger: "blur" }],
  },
  domains: [],
  isBatch: false,
  successDomains: [],
  loading: false,
});
const domain = ref("");
const active = ref(0);
const domainId = ref("");
const editVisible = ref(false);
const dialogStepVisible = ref(false);

const projectName = computed(() => {
  if (props.projects.length > 0) {
    return props.projects.filter((item) => item.id == props.currentProjectId)[0]
      .name;
  }
});
const projectDomainCount = computed(() => {
  if (props.projects.length > 0) {
    return props.projects.filter((item) => item.id == props.currentProjectId)[0]
      .check_domains_count;
  }
});
const domainsCount = computed(() => {
  if (props.projects.length > 0) {
    return props.projects.reduce(
      (total, currentValue, currentIndex, arr) =>
        total + currentValue.check_domains_count,
      0
    );
  }
});

onMounted(() => {
  getChannelList({ is_common: true }).then((res) => {
    state.isCommonChannels = res.data;
  });
});

const handleSelect = (val) => {
  state.form.project_id = val;
};
const onInput = (val) => {
  domain.value = val;
};
const searchOrCreateDomain = (domainVal) => {
  const params = {
    domain_cont: domainVal,
  };
  // params["project_id_eq"] ||= route.params.project_id;
  getDomainList(params).then((resp) => {
    if (resp.data.length > 0) {
      ElMessage.warning({
        message: "已生成过该域名",
        duration: 5 * 1000,
      });
      state.loading = false;
      // router.push(`projects/${route.params.project_id}/domains/${resp.data[0].id}/details`);
      emit("reload", domainVal);
    } else {
      validCheckDomain(domainVal)
        .then((res) => {
          if (res) {
            state.loading = false;
            dialogStepVisible.value = true;
            // alert(props.currentProjectId);
            if (props.currentProjectId) {
              state.form.project_id = props.currentProjectId;
            }
          }
        }).catch((err) => {
          state.loading = false;
        });
    }
  });
};
const handleClickAddDomain = () => {
  state.isBatch = false;
  state.loading = true;
  let domainVal;
  if (domain.value.indexOf("http") > -1) {
    domainVal = URI(domain.value).hostname();
  } else {
    domainVal = domain.value;
  }
  domain.value = domainVal;
  if (domainVal) {
    searchOrCreateDomain(domainVal);
  }
};
const handleClickBatchAction = () => {
  dialogStepVisible.value = true;
  state.isBatch = true;
};
const passon = (domains) => {
  state.domains = domains;
};
const onChange = () => {
  // dialogStepVisible.value = true;
};
const next = () => {
  active.value += 1;
};
const pre = () => {
  active.value -= 1;
};
const skip = () => {
  dialogStepVisible.value = false;
  emit("reload");
};
const add = () => {
  editVisible.value = true;
};
const end = () => {
  next();
  active.value = 0;
  dialogStepVisible.value = false;
  emit("reload");
};
const closeDialog = () => {
  active.value = 0;
};
const submitDomains = (params) => {
  batchCreateDomains(params).then((res) => {
    state.successDomains = res.data.new_domains;
    next();
  });
};
const submitDomain = (params) => {
  postDomain(params)
    .then((res) => {
      next();
      state.successDomains = [res.data];
      domainId.value = res.data.id;
      domain.value = "";
      state.form.markup = '';
    })
    .catch((err) => {
      ElMessage.error({
        message: err.response.data.domain[0] || "Error",
        duration: 5 * 1000,
      });
    });
};
const nextChannel = () => {
  const params = {
    project_id: state.form.project_id,
    markup: state.form.markup,
  };
  if (state.isBatch) {
    params.domains = state.domains;
    submitDomains(params);
  } else {
    params.domain = domain.value;
    submitDomain(params);
  }
};
const nextSure = (formName) => {
  if (state.checkList.length) {
    if (state.isBatch) {
      const ids = [];
      state.successDomains.forEach((item) => {
        ids.push(item.id);
      });
      const params = {
        domain_ids: ids,
      };
      state.checkList.forEach((item) => {
        batchBindChannel(item, params).then((res) => {
          state.checkList = [];
          state.successDomains = [];
        });
      });
    } else {
      state.checkList.forEach((item) => {
        bindChannelDomain(item, domainId.value).then((res) => {
          state.checkList = [];
        });
      });
    }
    next();
  } else if (state.channel_form.title !== "" && state.channel_form.url !== "") {
    const params = {
      ...state.channel_form,
      domain_id: domainId.value,
    };
    postChannel(params).then((res) => {
      next();
    });
  } else {
    ElMessage.error("请选择常用渠道或者新建一个渠道");
  }
};
</script>
<style scoped>
.icon {
  display: inline-block;
}
</style>
