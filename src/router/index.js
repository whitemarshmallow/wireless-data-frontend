import { createRouter, createWebHistory } from "vue-router";

// 导入组件
import DataUpload from "../components/DataUpload.vue";
import DataDownload from "../components/DataDownload.vue";
import ViaviDataDownload from "../components/ViaviDataDownload.vue";
import NetworkOptimization from "../components/NetworkOptimization.vue";
import PingpongSwitch from "../components/PingpongSwitch.vue";
import NetworkOptimAssistant from "../components/NetworkOptimAssistant.vue";
import LLMDataSearch from "../components/LLMDataSearch.vue";
import BeamRawData from "../components/BeamRawData.vue";
import BeamCompoundData from "../components/BeamCompoundData.vue";
import ServiceComponent from "../components/ServiceComponent.vue";
import ContactUs from "../components/ContactUs.vue";

const routes = [
  {
    path: "/",
    redirect: "/upload", // 默认重定向到上传页面
  },
  {
    path: "/upload",
    name: "Upload",
    component: DataUpload,
  },
  {
    path: "/download",
    name: "Download",
    component: DataDownload,
  },
  {
    path: "/viavi-download",
    name: "ViaviDownload",
    component: ViaviDataDownload,
  },
  {
    path: "/network-optimization",
    name: "NetworkOptimization",
    component: NetworkOptimization,
  },
  {
    path: "/pingpong-switch",
    name: "PingpongSwitch",
    component: PingpongSwitch,
  },
  {
    path: "/network-optim-assistant",
    name: "NetworkOptimAssistant",
    component: NetworkOptimAssistant,
  },
  {
    path: "/llm-data-search",
    name: "LLMDataSearch",
    component: LLMDataSearch,
  },
  {
    path: "/beam-raw-data",
    name: "BeamRawData",
    component: BeamRawData,
  },
  {
    path: "/beam-compound-data",
    name: "BeamCompoundData",
    component: BeamCompoundData,
  },
  {
    path: "/service",
    name: "Service",
    component: ServiceComponent,
  },
  {
    path: "/contact",
    name: "Contact",
    component: ContactUs,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
