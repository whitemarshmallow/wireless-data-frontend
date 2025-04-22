<template>
  <el-container class="main-container">
    <!-- 侧边栏 -->
    <el-aside width="200px">
      <!-- 顶部logo -->
       <div class="sidebar-header">
        <img src="./assets/logo.png" alt="logo" class="sidebar-logo">
        <h2 class="sidebar-title">网络数据处理工具</h2>
       </div>

      <el-menu
        :default-active="activeRoute"
        class="el-menu-vertical"
        background-color="#191a23"
        text-color="#fff"
        active-text-color="#409EFF"
        :router="true"
      >
        <el-menu-item index="/upload">
          <el-icon><Upload /></el-icon>
          <span>数据上传</span>
        </el-menu-item>
        <el-menu-item index="/download">
          <el-icon><Download /></el-icon>
          <span>数据下载</span>
        </el-menu-item>
        <el-menu-item index="/viavi-download">
          <el-icon><Download /></el-icon>
          <span>仿真数据下载</span>
        </el-menu-item>
        <el-menu-item index="/network-optimization">
          <el-icon><Histogram /></el-icon>
          <span>网络数据大模型处理</span>
        </el-menu-item>
        <el-menu-item index="/pingpong-switch">
          <el-icon><Switch /></el-icon>
          <span>乒乓切换</span>
        </el-menu-item>
        <el-menu-item index="/network-data-process">
          <el-icon><Connection /></el-icon>
          <span>网络数据处理</span>
        </el-menu-item>
        <el-menu-item index="/network-optim-assistant">
          <el-icon><Avatar /></el-icon>
          <span>乒乓切换优化</span>
        </el-menu-item>
        <el-menu-item index="/llm-data-search">
          <el-icon><Search /></el-icon>
          <span>大模型数据搜集</span>
        </el-menu-item>
        <el-menu-item index="/beam-raw-data">
          <el-icon><Document /></el-icon>
          <span>波束原始数据处理</span>
        </el-menu-item>
        <el-menu-item index="/beam-compound-data">
          <el-icon><Document /></el-icon>
          <span>波束合成数据生成</span>
        </el-menu-item>
        <el-menu-item index="/service">
          <el-icon><Service /></el-icon>
          <span>服务</span>
        </el-menu-item>
        <el-menu-item index="/contact">
          <el-icon><Message /></el-icon>
          <span>联系我们</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <el-header>
        <div class="header-content">
          <h2>网络数据处理</h2>
          <el-input
            v-model="searchQuery"
            placeholder="搜索..."
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </el-header>

      <el-main>
        <!-- 路由视图替代动态组件 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Upload, Download, Service, Message, Search, Document, Avatar, Connection } from '@element-plus/icons-vue'

const searchQuery = ref('')
const route = useRoute()

// 计算当前激活的路由路径用于菜单高亮
const activeRoute = computed(() => route.path)
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.main-container {
  height: 100vh;
}

.el-main{
  --el-main-padding: 15px;
}

.el-container{
  margin: 0;
  padding: 0;
}

.el-aside {
  background-color: #191a23;
  color: white;
  padding: 0;
  margin: 0;
  width: 200px;
}

.el-menu-vertical {
  border-right: none;
  background-color: #191a23 !important;
}

.el-menu-item:hover {
  background-color: #191a23 !important;
}

.el-menu-item.is-active {
  background-color: #4d70ff !important;
  color: #fff;
}

/* 设置图标颜色 */
.el-menu-item .el-icon {
  color: #fff !important;
}

/* 激活时的图标颜色 */
.el-menu-item.is-active .el-icon {
  color: #fff !important;
}

.el-header {
  background-color: white;
  border-bottom: 1px solid #dcdfe6;
}

/* 侧边栏顶部样式 */
.sidebar-header{
  padding: 20px 16px;
  background-color: #191a23;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid #000000;
}

.sidebar-logo{
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
}

.sidebar-title {
  color: white;
  font-size: 20px;
  margin: 0;
  text-align: center;
  line-height: 1.4;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

h2 {
  display: flex;
  align-items: center;
  margin: 0;
}


.search-input {
  width: 200px;
}
</style>