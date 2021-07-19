<template>
  <slot> </slot>

  <el-form-item label="title" prop="title">
    <el-input
      v-model="Channelform.title"
      placeholder="用来显示渠道名称"
      autocomplete="off"
    ></el-input>
  </el-form-item>
  <el-form-item label="url" prop="url">
    <el-input v-model="Channelform.url" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="备注">
    <el-input
      type="textarea"
      placeholder="可填写域名负责人, 服务器信息等"
      v-model="Channelform.markup"
      autocomplete="off"
    ></el-input>
  </el-form-item>
  <el-form-item label="">
    <el-checkbox v-model="Channelform.is_common">设为常用渠道</el-checkbox>
    <el-checkbox v-model="Channelform.is_common"
      >设为常用渠道 <span>设为常用渠道后, 新建其他监控时, 可以快捷勾选此渠道</span></el-checkbox
    >
  </el-form-item>
  <el-form-item label="签名校验（加签）" v-if="NeedSecurityCode">
    <el-input v-model="Channelform.config_secret" autocomplete="off" placeholder="如果您机器人选择了加签校验, 请在此处填写加签字符串"></el-input>
  </el-form-item>
</template>
<script>
export default {
  props: {
    Channelform: {
      type: Object,
      required: true,
    },
    NeedSecurityCode: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  setup(props) {},
};
</script>
