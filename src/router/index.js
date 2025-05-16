import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";

// 导入组件
import DataUpload from "../components/data/upload/DataUpload.vue";
import DataDownload from "../components/data/download/DataDownload.vue";
import ViaviDataDownload from "../components/data/download/ViaviDataDownload.vue";
import NetworkOptimization from "../components/network/optimization/NetworkOptimization.vue";
import PingpongSwitch from "../components/network/optimization/PingpongSwitch.vue";
import NetworkDataProcess from "@/components/network/assistant/NetworkDataProcess.vue";
import NetworkOptimAssistant from "../components/network/assistant/NetworkOptimAssistant.vue";
import LLMDataSearch from "../components/data/search/LLMDataSearch.vue";
import BeamRawData from "../components/beam/BeamRawData.vue";
import BeamCompoundData from "../components/beam/BeamCompoundData.vue";
import ServiceComponent from "../components/service/ServiceComponent.vue";
import ContactUs from "../components/service/ContactUs.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage, // 将根路径指向Home组件
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
    path: "/network-data-process",
    name: "NetworkDataProcess",
    component: NetworkDataProcess,
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
