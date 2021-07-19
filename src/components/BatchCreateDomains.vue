<template>
  <el-input
    type="textarea"
    v-model="domains"
    rows="6"
    placeholder="请输入合法的域名，一行一个，每次最多输入 100 行"
    autocomplete="off"
    @input="handleChangeInput"
  ></el-input>
  <div class="text-right">{{count}}/100</div>
</template>
<script setup>
import { ref, defineEmit } from 'vue';
import URI from "urijs";

const domains = ref('');
const emit = defineEmit(['passon']);
const count = ref(0);

const handleChangeInput = (val) => {
  const value = val.replace(/\s+/g, "\n");
  let arr = [];
  if (value.indexOf("\n") > -1) {
    arr = value.split(/[\s\n]/);
  } else {
    arr.push(value);
  }
  arr = arr.filter((d) => d).map((item) => {
    if (item.includes('http')) {
      return URI(item).domain();
    }
    return item;
  });
  count.value = arr.length;
  emit('passon', arr);
};
</script>
