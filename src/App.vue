<template>
  <div class="app-container">
    <!-- 宇宙背景效果 -->
    <div class="cosmic-background">
      <div class="orbital-ring"></div>
      <div class="glow-center"></div>
      <div class="stars"></div>
    </div>

    <!-- 头部导航栏 -->
    <header class="main-header">
      <div class="logo">
        <router-link to="/">
          <img src="./assets/logo.png" alt="无线数据智能平台" v-if="logoExists">
          <span>无线数据智能平台</span>
        </router-link>
      </div>

      <nav class="main-nav">
        <ul class="nav-links">
          <li class="nav-item dropdown">
            <span>数据处理</span>
            <div class="dropdown-content">
              <router-link to="/beam-raw-data">波束原始数据处理</router-link>
              <router-link to="/beam-compound-data">波束合成数据生成</router-link>
            </div>
          </li>
          <li class="nav-item dropdown">
            <span>数据管理</span>
            <div class="dropdown-content">
              <router-link to="/upload">数据上传</router-link>
              <router-link to="/download">数据下载</router-link>
              <router-link to="/viavi-download">仿真数据下载</router-link>
            </div>
          </li>
          <li class="nav-item dropdown">
            <span>网络数据助理</span>
            <div class="dropdown-content">
              <router-link to="/network-optimization">网络数据大模型处理</router-link>
              <router-link to="/pingpong-switch">乒乓切换</router-link>
              <router-link to="/network-data-process">网络数据处理</router-link>
            </div>
          </li>
          <li class="nav-item">
            <router-link to="/llm-data-search">大模型数据搜集</router-link>
          </li>
        </ul>
      </nav>

      <div class="user-actions">
        <!-- <router-link to="/service" class="action-link">服务</router-link>
        <router-link to="/contact" class="action-link">联系我们</router-link> -->
        <button class="button-glow">立即开始 →</button>
      </div>
    </header>

    <!-- 主内容区域 - 使用路由视图显示当前页面 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 页脚区域 -->
    <footer class="main-footer">
      <div class="footer-container">
        <!-- 左侧品牌区域 (占1/4) -->
        <div class="footer-brand">
          <div class="brand-logo">无线数据智能平台</div>
          <p class="brand-description">数据驱动的无线网络优化平台，为您提供全方位的网络优化解决方案</p>
          <div class="social-links">
            <a href="#" class="social-link">微博</a>
            <a href="#" class="social-link">知乎</a>
            <a href="#" class="social-link">微信</a>
          </div>
        </div>
        
        <!-- 右侧导航区域 (占3/4) -->
        <div class="footer-nav-container">
          <!-- 数据处理 -->
          <div class="footer-nav-section">
            <h3>数据处理</h3>
            <ul>
              <li><router-link to="/beam-raw-data">波束原始数据处理</router-link></li>
              <li><router-link to="/beam-compound-data">波束合成数据生成</router-link></li>
              <li><router-link to="/llm-data-search">大模型数据搜集</router-link></li>
            </ul>
          </div>
          
          <!-- 数据管理 -->
          <div class="footer-nav-section">
            <h3>数据管理</h3>
            <ul>
              <li><router-link to="/upload">数据上传</router-link></li>
              <li><router-link to="/download">数据下载</router-link></li>
              <li><router-link to="/viavi-download">仿真数据下载</router-link></li>
            </ul>
          </div>
          
          <!-- 网络优化 -->
          <div class="footer-nav-section">
            <h3>网络数据助理</h3>
            <ul>
              <li><router-link to="/network-optimization">网络数据上传</router-link></li>
              <li><router-link to="/pingpong-switch">乒乓切换</router-link></li>
              <li><router-link to="/network-optim-assistant">乒乓切换优化</router-link></li>
            </ul>
          </div>

          <div class="footer-nav-section">
            <h3>联系我们</h3>
            <ul>
              <li><router-link to="/service">服务</router-link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- 版权信息 -->
      <div class="copyright-bar">
        <p>© 2025 无线数据智能平台. 保留所有权利.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 检查logo文件是否存在
const logoExists = ref(true);

onMounted(() => {
  // 这里可以添加检查logo文件是否存在的逻辑
  // 如果没有logo文件，将logoExists设为false
  try {
    // 检查图片是否可以加载
    const img = new Image();
    img.src = './assets/logo.png';
    img.onerror = () => {
      logoExists.value = false;
    };
  } catch (e) {
    logoExists.value = false;
  }
});
</script>

<style>
:root {
  --primary: #ff7b4c;
  --primary-glow: rgba(255, 123, 76, 0.5);
  --secondary: #8f5bfd;
  --secondary-glow: rgba(143, 91, 253, 0.5);
  --dark-bg: #0a0c15;
  --card-bg: rgba(20, 25, 40, 0.7);
  --text: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
}

/* 重置样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--dark-bg);
  color: var(--text);
  overflow-x: hidden;
  line-height: 1.6;
}

a {
  text-decoration: none;
  color: inherit;
}

ul {
  list-style: none;
}

/* 宇宙背景效果 */
.cosmic-background {
  position: fixed;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: -1;
}

.orbital-ring {
  position: absolute;
  width: 200vw;
  height: 200vw;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

.orbital-ring:before {
  content: '';
  position: absolute;
  width: 150vw;
  height: 150vw;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 50%;
}

.glow-center {
  position: absolute;
  width: 60vw;
  height: 60vw;
  top: 30%;
  left: 70%;
  background: radial-gradient(circle,
      rgba(143, 91, 253, 0.1) 0%,
      rgba(255, 123, 76, 0.05) 40%,
      transparent 70%);
  border-radius: 50%;
  filter: blur(50px);
}

.stars {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(2px 2px at 20px 30px, #ffffff, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 40px 70px, #ffffff, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 50px 160px, #ffffff, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 90px 40px, #ffffff, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 130px 80px, #ffffff, rgba(0, 0, 0, 0));
  background-repeat: repeat;
  background-size: 200px 200px;
}

/* 应用容器 */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 头部导航栏 */
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 4rem;
  background: rgba(10, 12, 21, 0.8);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.logo {
  display: flex;
  align-items: center;
}

.logo a {
  display: flex;
  align-items: center;
}

.logo img {
  height: 2rem;
  margin-right: 0.8rem;
}

.logo span {
  font-size: 1.2rem;
  font-weight: 600;
  background: linear-gradient(to right, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links {
  display: flex;
  gap: 2rem;
  margin-right: 40px;
}

.nav-item {
  position: relative;
  font-weight: 500;
}

.nav-item span,
.nav-item a {
  color: var(--text);
  padding: 0.5rem 0;
  display: block;
  transition: color 0.3s;
  cursor: pointer;
}

.nav-item:hover span,
.nav-item:hover>a {
  color: var(--primary);
}

.dropdown-content {
  display: none;
  position: absolute;
  background: rgba(10, 12, 21, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.8rem;
  min-width: 180px;
  padding: 0.8rem 0;
  z-index: 100;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content a {
  display: block;
  padding: 0.7rem 1.5rem;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.dropdown-content a:hover {
  background: rgba(255, 123, 76, 0.1);
  color: var(--primary);
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.action-link {
  color: var(--text-secondary);
  transition: color 0.3s;
}

.action-link:hover {
  color: var(--primary);
}

.button-glow {
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  color: white;
  padding: 0.6rem 1.5rem;
  border-radius: 2rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  box-shadow: 0 0 15px var(--primary-glow);
}

.button-glow:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 25px var(--primary-glow);
}

/* 主内容区域 */
.main-content {
  flex: 1;
  padding: 0;
  /* 移除内边距，让每个页面组件自己控制内边距 */
}

/* 页脚 */
.main-footer {
  background-color: #0f1118;
  color: #ffffff;
  padding: 0;
}

.footer-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

/* 左侧品牌区域 - 占1/4 */
.footer-brand {
  flex: 1;
  padding-right: 60px;
}

.brand-logo {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #ff7b4c;
}

.brand-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 25px;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.social-link:hover {
  color: #ff7b4c;
}

/* 右侧导航区域 - 占3/4 */
.footer-nav-container {
  flex: 3;
  display: flex;
  justify-content: space-between;
}

.footer-nav-section {
  flex: 1;
  padding: 0 20px;
}

.footer-nav-section h3 {
  color: #ff7b4c;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  position: relative;
}

.footer-nav-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-nav-section li {
  margin-bottom: 12px;
}

.footer-nav-section a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.footer-nav-section a:hover {
  color: #ffffff;
}

/* 版权栏 */
.copyright-bar {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  text-align: center;
}

.copyright-bar p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  margin: 0;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .footer-container {
    flex-direction: column;
  }
  
  .footer-brand {
    margin-bottom: 40px;
    padding-right: 0;
  }
  
  .footer-nav-container {
    flex-wrap: wrap;
  }
  
  .footer-nav-section {
    flex-basis: 50%;
    margin-bottom: 30px;
  }
}

@media (max-width: 576px) {
  .footer-nav-container {
    flex-direction: column;
  }
  
  .footer-nav-section {
    flex-basis: 100%;
    padding: 0;
  }
}


</style>