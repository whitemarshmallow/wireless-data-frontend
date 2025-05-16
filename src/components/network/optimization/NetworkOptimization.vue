/* eslint-disable */
<template>
  <div class="network-container">
    <!-- 半透明白色遮罩层 -->
    <div class="page-overlay"></div>

    <!-- 页面标题 -->
    <h1 class="page-title">网络数据大模型处理</h1>
    
    <!-- 页面介绍 -->
    <div class="intro-section translucent-container">
      <h2 class="section-title">功能介绍</h2>
      <p class="description-text">
        网络数据大模型处理技术基于先进的大模型技术，对上传的网络数据进行智能分析与评估，生成专业的网络优化建议。
        通过上传标准格式的CSV网络数据文件，系统将自动进行深度分析，为网络性能优化提供科学依据与解决方案。
      </p>
    </div>

    <!-- 优化特点 -->
    <div class="features-section mb-5">
      <div class="row">
        <div class="col">
          <div class="info-card">
            <h3><i class="el-icon-data-analysis"></i> 智能分析</h3>
            <p class="description-text">基于AI技术的网络参数智能分析，快速识别网络问题点</p>
          </div>
        </div>
        <div class="col">
          <div class="info-card">
            <h3><i class="el-icon-magic-stick"></i> 专业建议</h3>
            <p class="description-text">生成针对性的网络优化建议，提供详细的改进措施</p>
          </div>
        </div>
        <div class="col">
          <div class="info-card">
            <h3><i class="el-icon-data-line"></i> 性能提升</h3>
            <p class="description-text">综合评估网络性能指标，提供实用的提升方案</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件上传部分 -->
    <el-card class="mb-5 custom-card">
      <template #header>
        <div class="card-header">
          <span><i class="el-icon-upload mr-2"></i>网络数据上传</span>
        </div>
      </template>

      <div class="card-description mb-4">
        <p class="description-text">
          请上传CSV格式的网络优化数据文件，系统将自动解析并分析文件内容，生成专业的网络优化建议。
          数据文件应包含标准的网络参数指标，如信号强度、覆盖范围、干扰水平等关键数据。
        </p>
      </div>

      <el-form :model="uploadForm" label-width="120px">
        <el-form-item label="选择文件">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :before-upload="beforeUpload"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            accept=".csv"
          >
            <el-button type="primary">选择文件</el-button>
            <template #tip>
              <div class="el-upload__tip">
                请选择 CSV 格式的网络优化数据文件
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>

      <div v-if="optimizationResult" class="optimization-result">
        <el-alert
          :title="optimizationResult.message"
          :type="optimizationResult.success ? 'success' : 'error'"
          show-icon
        />
        
        <div v-if="optimizationResult.success" class="result-container mt-4">
          <h3 class="result-title">优化建议</h3>
          <el-input 
            v-model="optimizationResult.suggestion" 
            type="textarea"
            :rows="12"
            readonly
            class="mt-3 optimization-textarea"
            placeholder="等待网优建议..."
          >
          </el-input>
        </div>
      </div>
    </el-card>
    
    <!-- 优化流程 -->
    <div class="process-description translucent-container mb-5">
      <h3 class="sub-section-title">网络优化流程</h3>
      <div class="process-steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>数据采集</h4>
            <p>收集网络运行参数与性能指标</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>数据上传</h4>
            <p>将网络数据上传至系统进行处理</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>智能分析</h4>
            <p>系统对数据进行深度分析与评估</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-content">
            <h4>优化实施</h4>
            <p>根据建议实施网络优化措施</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 适用场景 -->
    <div class="scenarios-section translucent-container mb-5">
      <h2 class="section-title">适用场景</h2>
      <div class="scenarios-grid">
        <div class="scenario-card">
          <h3>网络覆盖优化</h3>
          <p class="description-text">针对信号覆盖范围与强度不足的区域进行精准优化</p>
        </div>
        <div class="scenario-card">
          <h3>干扰消除</h3>
          <p class="description-text">识别并消除网络中的干扰源，提高信号质量</p>
        </div>
        <div class="scenario-card">
          <h3>容量提升</h3>
          <p class="description-text">优化网络容量配置，提高用户并发承载能力</p>
        </div>
        <div class="scenario-card">
          <h3>切换优化</h3>
          <p class="description-text">改善小区间切换成功率，减少掉话率</p>
        </div>
      </div>
    </div>

    <!-- 技术支持与帮助 -->
    <div class="support-section translucent-container mb-5">
      <h2 class="section-title">技术支持</h2>
      <p class="description-text">
        如果您在使用过程中遇到任何问题，或有任何建议与反馈，请随时联系我们的技术支持团队。
        我们将持续优化系统功能与用户体验，为您提供最优质的服务。
      </p>
      <div class="support-contact mt-3">
        <div class="contact-item">
          <i class="el-icon-message"></i> 
          <span>邮箱：support@wirelessdata.com</span>
        </div>
        <div class="contact-item">
          <i class="el-icon-phone"></i>
          <span>电话：400-123-4567</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import '@/assets/common-styles.css'
import { getApiUrl } from '../../../utils/api'

// 如需自定义基础 URL，取消注释下面这一行并修改
const baseUrl = null  // 使用全局配置
// const baseUrl = 'http://172.20.10.3:9090'  // 自定义 URL

const uploadUrl = ref(getApiUrl('/api/network/uploadCsv', baseUrl))

// 文件上传表单数据
const uploadForm = reactive({})
const optimizationResult = ref(null)

// 文件上传相关方法
const beforeUpload = (file) => {
  if (!file.name.toLowerCase().endsWith('.csv')) {
    ElMessage.error('请上传CSV格式的网络优化数据文件！')
    return false
  }

  // 添加日志查看实际的上传URL
  console.log('上传URL:', uploadUrl.value) 
  return true
}

// 打印详细成功信息
const handleUploadSuccess = (response) => {
  console.log('上传响应数据:', response)
  optimizationResult.value = {
    success: true,
    message: '网络优化数据分析完成',
    suggestion: response.suggestion || '暂无网络优化建议'
  }
}

// 打印详细错误信息
const handleUploadError = (err) => {
  console.error('上传错误:', err)
  const errorMessage = err.message || '未知错误'
  ElMessage.error(`文件上传失败: ${errorMessage}`)
  optimizationResult.value = {
    success: false,
    message: `文件上传失败: ${errorMessage}`
  }
}
</script>

<style scoped>
</style>