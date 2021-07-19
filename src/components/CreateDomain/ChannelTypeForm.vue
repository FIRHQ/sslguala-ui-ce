<template>
  <el-form :model="Channelform" label-position="top" :rules="state.rules">
    <el-form-item label="">
      <el-radio-group v-model="Channelform.type">
        <el-radio :label="`MsgChannel::Lark`">
          <Feishu></Feishu>
          飞书
        </el-radio>
        <el-radio :label="`MsgChannel::Dingtalk`">
          <DingDing></DingDing>
          钉钉
        </el-radio>
        <el-radio :label="`MsgChannel::Wecom`">
          <Wx></Wx>
          企业微信
        </el-radio>
        <el-radio :label="`MsgChannel::Email`">
          <Email></Email>
          邮箱
        </el-radio>

        <el-radio :label="`MsgChannel::Bark`">
          <i class="iconfont icon-yaling" />
          Bark
        </el-radio>

        <el-radio :label="`MsgChannel::Webhook`">
          <i class="iconfont icon-Webhook" />
          Webhook
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <template v-if="Channelform.type">
      <CommonChannelFormContent
        v-if="'MsgChannel::Dingtalk' === Channelform.type"
        :Channelform="Channelform"
      >
        <el-form-item label="介绍" prop="desc">
          <a
            class="text-blue-500"
            target="_blank"
            href="https://developers.dingtalk.com/document/app/custom-robot-access"
            >钉钉自定义机器人简介</a
          >
          <p>建议使用</p>
        </el-form-item>
      </CommonChannelFormContent>
      <CommonChannelFormContent
        v-if="'MsgChannel::Lark' === Channelform.type"
        :Channelform="Channelform"
      >
        <el-form-item label="介绍" prop="desc">
          <a
            class="text-blue-500"
            target="_blank"
            href="https://open.feishu.cn/document/ukTMukTMukTM/ucTM5YjL3ETO24yNxkjN"
            >飞书自定义机器人简介</a
          >
        </el-form-item>
      </CommonChannelFormContent>
      <CommonChannelFormContent
        v-if="'MsgChannel::Wecom' === Channelform.type"
        :Channelform="Channelform"
        :NeedSecurityCode="false"
      >
        <el-form-item label="介绍" prop="desc">
          <a
            class="text-blue-500"
            target="_blank"
            href="https://work.weixin.qq.com/api/doc/90000/90136/91770"
            >企业微信自定义机器人简介</a
          >
        </el-form-item>
      </CommonChannelFormContent>

      <CommonChannelFormContent
        v-if="'MsgChannel::Bark' === Channelform.type"
        :Channelform="Channelform"
        :NeedSecurityCode="false"
      >
        <el-form-item label="介绍" prop="desc">
          <a class="text-blue-500" target="_blank" href="https://github.com/Finb/Bark"
            >Bark 的介绍</a
          >
          <p>url 提交只复制到 key 即可, 如 https://api.day.app/xxxxxxxx</p>
        </el-form-item>
      </CommonChannelFormContent>

      <EmailChannelFormContent
        v-if="Channelform.type === 'MsgChannel::Email'"
        :Channelform="Channelform"
      />
      <WebhookChannelFormContent
        v-if="Channelform.type === 'MsgChannel::Webhook'"
        :Channelform="Channelform"
      />
      <!-- <el-form-item label="title" prop="title">
        <el-input
          v-model="Channelform.title"
          placeholder="用来显示渠道名称"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="url" prop="url" v-if="Channelform.type !== 'MsgChannel::Email'">
        <el-input
          v-model="Channelform.url"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="email" prop="email" v-else>
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
          >设为常用渠道</el-checkbox
        >
      </el-form-item>
      <el-form-item label="签名校验（加签）" v-if="Channelform.type !== 'MsgChannel::Email'">
        <el-input
          v-model="Channelform.config_secret"
          autocomplete="off"
        ></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="config_custom_string">
            <el-input
              v-model="state.channel_form.config_custom_string"
              autocomplete="off"
            ></el-input>
          </el-form-item> -->
      <el-button @click="cancelAdd">取消</el-button>
      <el-button type="primary" @click="sureAdd">确认添加</el-button>
    </template>
  </el-form>
</template>
<script setup>
import { reactive, defineProps, defineEmit } from 'vue';
import Feishu from '../SvgIcon/Feishu.vue';
import DingDing from '../SvgIcon/DingDing.vue';
import Wx from '../SvgIcon/Wx.vue';
import Email from '../SvgIcon/Email.vue';
import CommonChannelFormContent from '../ChannelFormContent/Common.vue';
import EmailChannelFormContent from '../ChannelFormContent/Email.vue';
import WebhookChannelFormContent from '../ChannelFormContent/Webhook.vue';

const props = defineProps({
  Channelform: Object,
  editVisible: Boolean,
});

const state = reactive({
  rules: {
    title: [{ required: true, message: '请输入标识名称', trigger: 'blur' }],
    url: [{ required: true, message: '请输入通知地址', trigger: 'blur' }],
    config_email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' }],
  },
});

const emit = defineEmit(['cancel', 'add']);

const cancelAdd = () => {
  emit('cancel');
};

const sureAdd = () => {
  emit('add');
};
</script>
