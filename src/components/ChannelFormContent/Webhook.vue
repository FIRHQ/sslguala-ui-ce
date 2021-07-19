<template>
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

  <el-form-item label="发送内容">
    <div>
      <pre>
        POST With JSON
        {"title": "警告标题", "description": "警告内容"}
      </pre>

    </div>
  </el-form-item>

  <el-form-item label="">
    <el-checkbox v-model="Channelform.is_common">设为常用渠道 <span>设为常用渠道后, 新建其他监控时, 可以快捷勾选此渠道</span></el-checkbox>
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
