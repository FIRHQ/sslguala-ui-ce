<template>
  <el-dialog
    title="渠道管理"
    destroy-on-close
    v-model="dialogFormVisible"
    @close="closeDialog"
  >
    <el-form :model="state.form">
      <el-form-item label="已绑定渠道" :label-width="state.formLabelWidth">
        <el-checkbox-group v-model="state.uncheckList">
          <el-checkbox
            :label="item.id"
            :key="index"
            checked
            @change="(checked) => onunbind(checked, item.id)"
            v-for="(item, index) in data"
            >{{ item.title }}
            <el-button
              type="primary"
              size="mini"
              round
              @click="() => trySendMessge(item.id)"
              >尝试发送</el-button
            >
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="可选渠道" :label-width="state.formLabelWidth">
        <el-checkbox-group v-model="state.checkList">
          <el-checkbox
            :label="item.id"
            :key="item.id"
            @change="(checked) => onbind(checked, item.id)"
            v-for="item in able"
            >{{ item.title }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <el-button type="primary" icon="el-icon-plus" @click="editVisible = true"
      >新增</el-button
    >
    <template v-if="editVisible">
      <ChannelTypeForm
       :Channelform="state.channel_form"
       v-on:cancel="cancelAdd"
       v-on:add="onSureAdd"
      >
    </ChannelTypeForm>
    </template>
    <el-divider></el-divider>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, defineProps, reactive, defineEmit, ref } from "vue";
import {
  unbindChannelDomain,
  bindChannelDomain,
  postChannel,
  trySendChannelMessage,
} from "api/message";
import ChannelTypeForm from "comps/CreateDomain/ChannelTypeForm.vue";

const props = defineProps({
  dialogFormVisible: Boolean,
  id: Number,
  data: Array,
  able: Array,
});

const emit = defineEmit(["toggle"]);

const state = reactive({
  form: {
    name: "",
    region: "",
  },
  channel_form: {
    title: "",
    url: "",
    type: "",
    markup: "",
    is_common: true,
    config_secret: "",
    config_custom_string: "",
    domain_id: "",
    config_email: "",
  },
  formLabelWidth: "120px",
  checkList: [],
  uncheckList: [],
});

const editVisible = ref(false);

const closeDialog = () => {
  state.checkList = [];
  emit("toggle");
};

const cancelAdd = () => {
  editVisible.value = false;
};

const onunbind = (checked, id) => {
  unbindChannelDomain(id, props.id).then((res) => {});
};

const onbind = (checked, id) => {
  bindChannelDomain(id, props.id).then((res) => {});
};

const trySendMessge = (id) => {
  trySendChannelMessage(id, props.id).then((res) => {
    console.log("res", res);
  });
};

const onSureAdd = () => {
  const params = {
    ...state.channel_form,
    domain_id: props.id,
  };
  postChannel(params).then((res) => {
    const currentCheckList = props.data;
    currentCheckList.push(res.data);
    props.data = currentCheckList;
    editVisible.value = false;
  });
};
</script>

<style lang="scss" scoped>
.icon {
  display: inline-block;
}
</style>
