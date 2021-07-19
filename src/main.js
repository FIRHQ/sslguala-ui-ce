import { createApp } from "vue";
import './index.css';
// import ElementPlus from 'element-plus'
import {
  ElButton,
  ElMessage,
  ElMessageBox,
  ElIcon,
  ElRow,
  ElCol,
  ElInput,
  ElEmpty,
  ElTable,
  ElTableColumn,
  ElTabs,
  ElTabPane,
  ElForm,
  ElFormItem,
  ElPagination,
  ElMenu,
  ElMenuItem,
  ElSkeleton,
  ElSubmenu,
  ElDialog,
  ElStep,
  ElSteps,
  ElCheckbox,
  ElSelect,
  ElOption,
  ElRadioGroup,
  ElRadio,
  ElCheckboxGroup,
  ElDivider,
  ElTag,
  ElResult,
  ElPopover,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
} from "element-plus";
import lang from "element-plus/lib/locale/lang/zh-cn";
import locale from 'element-plus/lib/locale';
import store from './store';
import router from "./router";
import App from "./App.vue";
import "dayjs/locale/zh-cn";

locale.use(lang);
// import 'element-plus/lib/theme-chalk/index.css'

const app = createApp(App);
app.use(router);
app.use(ElMenu);
app.use(ElSkeleton);
app.use(ElMenuItem);
app.use(ElSubmenu);
app.use(ElRow);
app.use(ElCol);
app.use(ElButton);
app.use(ElIcon);
app.use(ElInput);
app.use(ElMessage);
app.use(ElMessageBox);
app.use(ElEmpty);
app.use(ElTable);
app.use(ElTableColumn);
app.use(ElTabs);
app.use(ElTabPane);
app.use(ElForm);
app.use(ElFormItem);
app.use(ElPagination);
app.use(ElDialog);
app.use(ElStep);
app.use(ElSteps);
app.use(ElCheckbox);
app.use(ElSelect);
app.use(ElOption);
app.use(ElRadioGroup);
app.use(ElRadio);
app.use(ElCheckboxGroup);
app.use(ElDivider);
app.use(ElTag);
app.use(ElResult);
app.use(ElPopover);
app.use(ElDropdown);
app.use(ElDropdownMenu);
app.use(ElDropdownItem);
app.use(store);
app.mount("#app");
