<template>
  <div class="home-container">
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="main-title">无线数据智能平台</h1>
        <p class="subtitle">数据驱动的无线网络优化，一键式智能处理解决方案</p>
        
        <div class="search-box">
          <input type="text" placeholder="开始您的数据处理任务..." class="search-input">
          <button class="search-button">开始处理 →</button>
        </div>
        
        <div class="video-link">
          <a href="#watch-demo">
            <span class="play-icon">▶</span> 观看演示视频
          </a>
        </div>
      </div>
    </section>

    <!-- 功能卡片区域 -->
    <section class="features-section">
      <div class="section-header">
        <h2>核心功能</h2>
        <h3 class="section-title">数据驱动的智能网络优化平台</h3>
        <p class="section-description">为无线网络提供全周期的数据处理与优化工具</p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon orange-icon"></div>
          <h3>波束数据处理</h3>
          <p>精准处理原始波束数据，支持多源数据融合，提供高质量数据基础</p>
          <router-link to="/beam-raw-data" class="feature-link">了解更多 →</router-link>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon purple-icon"></div>
          <h3>网络智能优化</h3>
          <p>基于AI算法的网络参数自动优化，提升网络容量与用户体验</p>
          <router-link to="/network-optimization" class="feature-link">了解更多 →</router-link>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon blue-icon"></div>
          <h3>乒乓切换优化</h3>
          <p>识别并消除无效切换，提升网络稳定性与连接可靠性</p>
          <router-link to="/pingpong-switch" class="feature-link">了解更多 →</router-link>
        </div>
      </div>
    </section>

    <!-- 数据管理部分 -->
    <section class="data-management-section">
      <div class="section-header">
        <h2>数据管理</h2>
        <h3 class="section-title">高效数据处理工具</h3>
        <p class="section-description">支持多种数据格式的上传、转换与下载，为您的无线网络优化提供便捷的数据管理方案</p>
      </div>

      <div class="data-cards">
        <div class="data-card">
          <div class="card-content">
            <div class="data-icon orange-bg"></div>
            <div class="data-info">
              <h4>数据上传</h4>
              <p>支持 JSON, XML, TXT, NPY, CSV 格式</p>
            </div>
          </div>
          <router-link to="/upload" class="card-link">上传数据</router-link>
        </div>

        <div class="data-card">
          <div class="card-content">
            <div class="data-icon purple-bg"></div>
            <div class="data-info">
              <h4>数据下载</h4>
              <p>多种筛选条件，精准获取所需数据</p>
            </div>
          </div>
          <router-link to="/download" class="card-link">下载数据</router-link>
        </div>

        <div class="data-card">
          <div class="card-content">
            <div class="data-icon blue-bg"></div>
            <div class="data-info">
              <h4>仿真数据</h4>
              <p>丰富的模拟场景数据支持</p>
            </div>
          </div>
          <router-link to="/viavi-download" class="card-link">获取仿真数据</router-link>
        </div>
      </div>
    </section>
    
    <!-- AI助手部分 -->
    <section class="ai-section">
      <div class="ai-container">
        <div class="ai-visual">
          <div class="glow-sphere"></div>
        </div>
        
        <div class="ai-content">
          <h2 class="ai-badge">AI助手</h2>
          <h3 class="ai-title">大模型驱动的网络优化</h3>
          <p class="ai-description">利用AI技术提供智能网络优化建议，自动识别并解决网络问题，提升优化效率</p>
          <router-link to="/network-optim-assistant" class="ai-button">体验AI助手</router-link>
        </div>
      </div>
    </section>
    
    <!-- 技术优势部分 -->
    <section class="tech-advantages-section">
      <div class="section-header">
        <h2>技术优势</h2>
        <h3 class="section-title">领先的网络优化技术</h3>
        <p class="section-description">整合最新AI技术与无线网络专业知识，为客户提供高效、精准的优化方案</p>
      </div>
      
      <div class="advantages-grid">
        <div class="advantage-item">
          <div class="advantage-icon"></div>
          <h4>实时数据处理</h4>
          <p>毫秒级数据处理响应，满足实时业务需求</p>
        </div>
        
        <div class="advantage-item">
          <div class="advantage-icon"></div>
          <h4>高精度算法</h4>
          <p>99.8%的参数优化准确率，远超行业平均水平</p>
        </div>
        
        <div class="advantage-item">
          <div class="advantage-icon"></div>
          <h4>多场景适配</h4>
          <p>支持城市、郊区、室内等多种复杂网络环境</p>
        </div>
        

      </div>
    </section>
    
    <!-- 客户案例部分 -->
    <section class="case-studies-section">
      <div class="section-header">
        <h2>客户案例</h2>
        <h3 class="section-title">成功的网络优化案例</h3>
        <p class="section-description">我们已帮助众多客户提升网络性能，以下是部分成功案例</p>
      </div>
      
      <div class="case-studies-carousel">
        <div class="case-study-card">
          <div class="case-logo"></div>
          <h4>xxxx</h4>
          <p>通过我们的乒乓切换优化方案，网络稳定性提升35%，用户投诉率下降42%</p>
          <a href="#" class="case-link">查看详情</a>
        </div>
        
        <div class="case-study-card">
          <div class="case-logo"></div>
          <h4>xxxx</h4>
          <p>利用我们的数据分析工具，分析出网络瓶颈，优化后吞吐量提升58%</p>
          <a href="#" class="case-link">查看详情</a>
        </div>
        
        <div class="case-study-card">
          <div class="case-logo"></div>
          <h4>xxxx</h4>
          <p>基于AI辅助的网络规划，覆盖率提升28%，同时节省25%建设成本</p>
          <a href="#" class="case-link">查看详情</a>
        </div>
      </div>
    </section>
    
    <!-- 联系我们部分 -->
    <section class="contact-section">
      <div class="contact-container">
        <div class="contact-info">
          <h3>开始您的网络优化之旅</h3>
          <p>无论您是需要数据处理、网络优化还是专业咨询，我们都能为您提供最佳解决方案</p>
          <div class="contact-methods">
            <div class="contact-method">
              <span class="contact-icon">📞</span>
              <p>123-456-7890</p>
            </div>
            <div class="contact-method">
              <span class="contact-icon">✉️</span>
              <p>xxxx@xxxxxx.com</p>
            </div>
          </div>
        </div>
        
        <div class="contact-form">
          <h4>联系我们</h4>
          <div class="form-group">
            <input type="text" placeholder="您的姓名" class="form-input">
          </div>
          <div class="form-group">
            <input type="email" placeholder="您的邮箱" class="form-input">
          </div>
          <div class="form-group">
            <textarea placeholder="您的需求描述" class="form-textarea"></textarea>
          </div>
          <button class="submit-button">发送消息</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 首页组件脚本部分
</script>

<style scoped>
.home-container {
  font-family: 'SF Pro Display', Arial, sans-serif;
}

/* 英雄区域样式 */
.hero-section {
  padding: 215px 0 130px 0;
  text-align: center;
  background: linear-gradient(rgba(60,72,165, 0.7), rgba(255, 255, 255, 1));
  position: relative;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-badge {
  display: inline-block;
  background-color: #f1f2f6;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 20px;
  margin-bottom: 20px;
}

.main-title {
  font-size: 4rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 20px;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(to right, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.5rem;
  color: #666;
  margin-bottom: 40px;
  line-height: 1.5;
}

.search-box {
  display: flex;
  max-width: 600px;
  margin: 0 auto 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.search-input {
  flex-grow: 1;
  padding: 16px 20px;
  border: none;
  font-size: 16px;
  outline: none;
}

.search-button {
  background: linear-gradient(90deg, #ff7b4c, #ff5e3a);
  color: white;
  border: none;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.search-button:hover {
  background: linear-gradient(90deg, #ff5e3a, #ff4825);
}

.video-link {
  margin-top: 30px;
}

.video-link a {
  display: inline-flex;
  align-items: center;
  color: #666;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s;
}

.video-link a:hover {
  color: #ff5e3a;
}

.play-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #fff;
  border-radius: 50%;
  margin-right: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 功能卡片区域 */
.features-section {
  padding: 80px 0;
  background-color: #fff;
}

.features-grid {
  display: flex;
  justify-content: center;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.feature-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.05);
  flex: 1;
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  margin-bottom: 24px;
}

.orange-icon {
  background-color: #FF7B4C;
}

.purple-icon {
  background-color: #8F5BFD;
}

.blue-icon {
  background-color: #5BE2FF;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #111;
  margin-bottom: 16px;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 24px;
}

.feature-link {
  color: #ff5e3a;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s;
}

.feature-link:hover {
  color: #ff4825;
}

/* 数据管理部分 */
.data-management-section {
  padding: 80px 0;
  background-color: #f8f9fa;
}

.section-header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 60px;
  padding: 0 20px;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #ff5e3a;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.section-title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 20px;
}

.section-description {
  font-size: 1.2rem;
  color: #666;
  line-height: 1.6;
}

.data-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.data-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-content {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.data-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  margin-right: 20px;
  flex-shrink: 0;
}

.orange-bg {
  background-color: #FF7B4C;
}

.purple-bg {
  background-color: #8F5BFD;
}

.blue-bg {
  background-color: #5BE2FF;
}

.data-info h4 {
  font-size: 18px;
  font-weight: 600;
  color: #111;
  margin-bottom: 8px;
}

.data-info p {
  color: #666;
  font-size: 14px;
}

.card-link {
  color: #ff5e3a;
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  transition: color 0.3s;
}

.card-link:hover {
  color: #ff4825;
}

/* AI助手部分 */
.ai-section {
  padding: 100px 0;
  background-color: #fff;
  overflow: hidden;
}

.ai-container {
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.ai-visual {
  flex: 1;
  position: relative;
  height: 400px;
}

.glow-sphere {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(255, 123, 76, 0.1) 0%, rgba(143, 91, 253, 0.2) 50%, transparent 80%);
  box-shadow: 0 0 100px rgba(143, 91, 253, 0.3);
  animation: pulse 6s infinite alternate;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.9);
    opacity: 0.7;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 1;
  }
}

.ai-content {
  flex: 1;
  padding-left: 50px;
}

.ai-badge {
  display: inline-block;
  font-size: 2rem;
  font-weight: 600;
  color: #8F5BFD;
  margin-bottom: 16px;
}

.ai-title {
  font-size: 36px;
  font-weight: 700;
  color: #111;
  margin-bottom: 20px;
}

.ai-description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
  max-width: 500px;
}

.ai-button {
  display: inline-block;
  background: linear-gradient(90deg, #8F5BFD, #7342D6);
  color: white;
  padding: 14px 30px;
  border-radius: 30px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
}

.ai-button:hover {
  background: linear-gradient(90deg, #7342D6, #5F35B5);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(143, 91, 253, 0.3);
}

/* 技术优势部分 */
.tech-advantages-section {
  padding: 80px 0;
  background-color: #f8f9fa;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.advantage-item {
  background-color: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s;
}

.advantage-item:hover {
  transform: translateY(-5px);
}

.advantage-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff7b4c, #ff5e3a);
  margin: 0 auto 20px;
}

.advantage-item h4 {
  font-size: 18px;
  font-weight: 600;
  color: #111;
  margin-bottom: 12px;
}

.advantage-item p {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

/* 客户案例部分 */
.case-studies-section {
  padding: 80px 0;
  background-color: #fff;
}

.case-studies-carousel {
  display: flex;
  overflow-x: auto;
  gap: 30px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  scrollbar-width: none; /* Firefox */
}

.case-studies-carousel::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.case-study-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  min-width: 300px;
  flex: 1;
}

.case-logo {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background-color: #f1f2f6;
  margin-bottom: 20px;
}

.case-study-card h4 {
  font-size: 18px;
  font-weight: 600;
  color: #111;
  margin-bottom: 12px;
}

.case-study-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.case-link {
  color: #ff5e3a;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.case-link:hover {
  color: #ff4825;
}

/* 联系我们部分 */
.contact-section {
  padding: 80px 0;
  background-color: #f8f9fa;
}

.contact-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  gap: 50px;
}

.contact-info {
  flex: 1;
}

.contact-info h3 {
  font-size: 36px;
  font-weight: 700;
  color: #111;
  margin-bottom: 20px;
}

.contact-info p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-method {
  display: flex;
  align-items: center;
}

.contact-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f1f2f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.contact-form {
  flex: 1;
  background-color: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.1);
}

.contact-form h4 {
  font-size: 24px;
  font-weight: 600;
  color: #111;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 14px;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-input:focus, .form-textarea:focus {
  border-color: #ff5e3a;
  outline: none;
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
}

.submit-button {
  background: linear-gradient(90deg, #ff7b4c, #ff5e3a);
  color: white;
  border: none;
  padding: 14px 30px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
  width: 100%;
}

.submit-button:hover {
  background: linear-gradient(90deg, #ff5e3a, #ff4825);
}

/* 响应式调整 */
@media (max-width: 992px) {
  .features-grid {
    flex-direction: column;
    max-width: 600px;
  }
  
  .ai-container {
    flex-direction: column;
  }
  
  .ai-visual {
    margin-bottom: 50px;
  }
  
  .ai-content {
    padding-left: 0;
    text-align: center;
  }
  
  .contact-container {
    flex-direction: column;
  }
  
  .contact-info {
    margin-bottom: 40px;
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 32px;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .data-cards {
    flex-direction: column;
    align-items: center;
  }
  
  .data-card {
    max-width: 100%;
  }
}
</style>