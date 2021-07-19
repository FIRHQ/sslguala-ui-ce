<template>
  <el-form-item label="title" prop="title">
    <el-input
      v-model="Channelform.title"
      placeholder="用来显示渠道名称"
      autocomplete="off"
    ></el-input>
  </el-form-item>

  <el-form-item label="email" prop="config_email">
    <el-input
      v-model="Channelform.config_email"
      autocomplete="off"
      placeholder="邮箱地址"
    ></el-input>
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
    <el-checkbox v-model="Channelform.is_common"
      >设为常用渠道 <span class='text-xs'>(设为常用渠道后, 新建其他监控时, 可以快捷勾选此渠道)</span></el-checkbox
    >
  </el-form-item>
  <el-form-item label="签名校验（加签）" v-if="Channelform.type !== 'MsgChannel::Email'">
    <el-input v-model="Channelform.config_secret" autocomplete="off"></el-input>
  </el-form-item>
</template>
<script>
export default {
  props: {
    Channelform: {
      type: Object,
      required: true,
    },
  },
  setup(props) {},
};
</script>
