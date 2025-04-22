import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// import store from "./store";
import store from "./store/networkDataProcessStore";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { createPinia } from "pinia";

// 创建pinia实例
const pinia = createPinia();

const app = createApp(App);

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus);
app.use(router);
app.use(pinia);
app.use(store);
app.mount("#app");
