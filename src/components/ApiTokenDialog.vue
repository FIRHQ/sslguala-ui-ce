<template>
  <el-dialog title="Api token" v-model="dialogVisible" width="30%" @close="closeDialog">
    <input
      id="input"
      value="这是幕后黑手"
      style="opacity: 0; position: absolute"
    />
    <span id="copyText">{{ token }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="copyText">复制</el-button>
        <el-button type="primary" @click="handleClickResetToken"
          >更新</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineProps, defineEmit } from "vue";
import { resetApiToken } from "api/user";
import { ElMessage } from "element-plus";

const props = defineProps({
  dialogVisible: Boolean,
  token: String,
});

const emit = defineEmit(["resetapitoken", "closeDialog"]);

const handleClickResetToken = () => {
  resetApiToken().then((res) => {
    emit("resetapitoken", res.data.api_token);
  });
};

const copyText = () => {
  const text = document.getElementById("copyText").innerText; // 复制文本
  const input = document.getElementById("input");
  input.value = text; // 修改文本框的内容
  input.select(); // 选中文本
  document.execCommand("copy"); // 执行浏览器复制命令
  ElMessage.success({
    message: `已复制`,
    type: "success",
  });
};

const closeDialog = () => {
  emit('closeDialog');
};
</script>
