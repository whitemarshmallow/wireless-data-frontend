<template>
  <div class="beam-container">
    <!-- 半透明白色遮罩层 -->
    <div class="page-overlay"></div>

    <!-- 页面标题 -->
    <h1 class="page-title">波束合成数据生成平台</h1>
    
    <!-- 页面介绍 -->
    <div class="intro-section translucent-container">
      <h2 class="section-title">功能介绍</h2>
      <p class="description-text">
        波束合成数据生成平台能够将原始波束数据进行高级处理与合成，生成用于信号分析与网络优化的综合性数据集。
        本平台支持波束空域与时域数据的智能合成，能够根据用户需求生成高质量的合成数据，为无线网络优化与分析提供强大支持。
      </p>
    </div>

    <!-- 处理优势 -->
    <div class="features-section mb-5">
      <div class="row">
        <div class="col">
          <div class="info-card">
            <h3><i class="el-icon-data-line"></i> 智能合成</h3>
            <p class="description-text">采用先进算法对多源波束数据进行智能合成，生成高质量综合数据集</p>
          </div>
        </div>
        <div class="col">
          <div class="info-card">
            <h3><i class="el-icon-refresh"></i> 灵活配置</h3>
            <p class="description-text">支持多种合成参数配置，满足不同场景下的数据生成需求</p>
          </div>
        </div>
        <div class="col">
          <div class="info-card">
            <h3><i class="el-icon-document"></i> 多格式输出</h3>
            <p class="description-text">可选择CSV或TXT等多种格式导出，便于后续分析处理</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 切换部分 -->
    <el-tabs v-model="activeTab" class="custom-tabs mb-4">
      <el-tab-pane label="波束空域数据合成" name="airspace">
        <!-- 空域案例内容 -->
        <div class="upload-container">
          <el-card class="mb-5">
            <template #header>
              <div class="card-header">
                <span>文件上传</span>
              </div>
            </template>

            <div class="card-description mb-4">
              <p class="description-text">
                波束空域数据合成支持对多个空域数据源进行融合与合成处理。
                通过上传原始空域数据文件，系统将自动进行数据合成，生成综合性的空域数据集，适用于后续的信号分析与网络优化。
              </p>
            </div>

            <el-form :model="airspaceUploadForm" label-width="120px">
              <el-form-item label="选择文件">
                <el-upload
                  class="upload-demo"
                  :action="airspaceUploadUrl"
                  :on-success="handleUploadSuccess"
                  :on-error="handleUploadError"
                  :before-upload="beforeUpload"
                  accept=".json,.xml,.txt,.npy,.csv"
                >
                  <el-button type="primary">选择文件</el-button>
                  <template #tip>
                    <div class="el-upload__tip">
                      支持 .json, .xml, .txt, .npy, .csv 格式文件
                    </div>
                  </template>
                </el-upload>
              </el-form-item>

              <el-form-item label="输出格式">
                <el-select v-model="airspaceUploadForm.outputFormat" placeholder="选择输出格式">
                  <el-option label="CSV" value="csv" />
                  <el-option label="TXT" value="txt" />
                </el-select>
              </el-form-item>
            </el-form>

            <div v-if="airspaceUploadResult" class="upload-result">
              <el-alert
                :title="airspaceUploadResult.message"
                :type="airspaceUploadResult.success ? 'success' : 'error'"
                show-icon
              />
              <el-button 
                v-if="airspaceUploadResult.success" 
                type="primary"
                @click="handleAirspaceDownload"
                class="mt-3"
              >
                下载转换后的文件
              </el-button>
            </div>
          </el-card>
          
          <!-- 处理流程说明 -->
          <div class="process-description translucent-container">
            <h3 class="sub-section-title">合成流程</h3>
            <div class="process-steps">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>数据上传</h4>
                  <p>选择并上传原始波束空域数据文件</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>数据合成</h4>
                  <p>系统自动进行数据融合与特征提取</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>结果导出</h4>
                  <p>下载合成后的数据文件用于后续分析</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="波束时域数据合成" name="time">
        <div class="upload-container">
          <el-card class="mb-5">
            <template #header>
              <div class="card-header">
                <span>文件上传</span>
              </div>
            </template>

            <div class="card-description mb-4">
              <p class="description-text">
                波束时域数据合成支持对时序信号数据进行高级处理与合成。
                通过上传原始时域数据文件，系统将自动进行时序数据的合成与优化，生成高质量的时域综合数据集，便于后续的频谱分析与信号处理。
              </p>
            </div>

            <el-form :model="timeUploadForm" label-width="120px">
              <el-form-item label="选择文件">
                <el-upload
                  class="upload-demo"
                  :action="timeUploadUrl"
                  :on-success="handleUploadSuccess"
                  :on-error="handleUploadError"
                  :before-upload="beforeUpload"
                  accept=".json,.xml,.txt,.npy,.csv"
                >
                  <el-button type="primary">选择文件</el-button>
                  <template #tip>
                    <div class="el-upload__tip">
                      支持 .json, .xml, .txt, .npy, .csv 格式文件
                    </div>
                  </template>
                </el-upload>
              </el-form-item>

              <el-form-item label="输出格式">
                <el-select v-model="timeUploadForm.outputFormat" placeholder="选择输出格式">
                  <el-option label="CSV" value="csv" />
                  <el-option label="TXT" value="txt" />
                </el-select>
              </el-form-item>
            </el-form>

            <div v-if="timeUploadResult" class="upload-result">
              <el-alert
                :title="timeUploadResult.message"
                :type="timeUploadResult.success ? 'success' : 'error'"
                show-icon
              />
              <el-button 
                v-if="timeUploadResult.success" 
                type="primary"
                @click="handleTimeDownload"
                class="mt-3"
              >
                下载转换后的文件
              </el-button>
            </div>
          </el-card>
          
          <!-- 处理流程说明 -->
          <div class="process-description translucent-container">
            <h3 class="sub-section-title">合成流程</h3>
            <div class="process-steps">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>数据上传</h4>
                  <p>选择并上传原始波束时域数据文件</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>数据合成</h4>
                  <p>系统自动进行时序数据的合成与优化</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>结果导出</h4>
                  <p>下载合成后的数据文件用于后续分析</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 应用场景 -->
    <div class="scenarios-section translucent-container mb-5">
      <h2 class="section-title">应用场景</h2>
      <div class="scenarios-grid">
        <div class="scenario-card">
          <h3>网络规划</h3>
          <p class="description-text">合成数据可用于网络规划与覆盖预测，提升网络部署效率</p>
        </div>
        <div class="scenario-card">
          <h3>信号分析</h3>
          <p class="description-text">基于合成数据进行深入的信号特性分析，发现潜在问题</p>
        </div>
        <div class="scenario-card">
          <h3>性能优化</h3>
          <p class="description-text">利用高质量合成数据实现网络性能的精准评估与优化</p>
        </div>
        <div class="scenario-card">
          <h3>干扰识别</h3>
          <p class="description-text">通过合成数据分析检测并识别网络中的干扰源，提升通信质量</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import '@/assets/common-styles.css'
import { getApiUrl } from '../../utils/api'

// 如需自定义基础 URL，取消注释下面这一行并修改
const baseUrl = null  // 使用全局配置
// const baseUrl = 'http://172.20.10.3:9090'  // 自定义 URL

// 上传 URL
const airspaceUploadUrl = getApiUrl('/api/beam/airspace/compound-data', baseUrl)
const timeUploadUrl = getApiUrl('/api/beam/time/compound-data', baseUrl)

// Tab 激活状态
const activeTab = ref('airspace')

// 空域案例的表单数据
const airspaceUploadForm = reactive({
  outputFormat: 'csv'
})
const airspaceUploadResult = ref(null)

// 时域案例的表单数据
const timeUploadForm = reactive({
  outputFormat: 'csv'
})
const timeUploadResult = ref(null)

// 文件上传相关方法
const beforeUpload = (file) => {
  const validTypes = ['.json', '.xml', '.txt', '.npy', '.csv']
  const isValidType = validTypes.some(type => 
    file.name.toLowerCase().endsWith(type)
  )
  
  if (!isValidType) {
    ElMessage.error('请上传支持的文件格式!')
    return false
  }
  return true
}

const handleUploadSuccess = (response) => {
  console.log('上传响应数据:', response)
  const result = {
    success: true,
    message: '文件处理成功',
    data: response
  }
  
  // 根据当前激活的 tab 设置对应的结果
  if (activeTab.value === 'airspace') {
    airspaceUploadResult.value = result
  } else {
    timeUploadResult.value = result
  }
}

const handleUploadError = () => {
  const result = {
    success: false,
    message: '文件上传失败'
  }
  
  if (activeTab.value === 'airspace') {
    airspaceUploadResult.value = result
  } else {
    timeUploadResult.value = result
  }
}

// 空域案例下载方法
const handleAirspaceDownload = async () => {
  try {
    if (airspaceUploadResult.value?.data) {
      const content = typeof airspaceUploadResult.value.data === 'string' 
        ? airspaceUploadResult.value.data 
        : JSON.stringify(airspaceUploadResult.value.data)
      
      const mimeType = airspaceUploadForm.outputFormat === 'csv' 
        ? 'text/csv' 
        : 'text/plain'
      
      const blob = new Blob([content], { type: mimeType })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `beam_airspace_data.${airspaceUploadForm.outputFormat}`
      
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      ElMessage.success('文件下载开始')
    } else {
      ElMessage.error('没有可用的数据')
    }
  } catch (error) {
    console.error('下载出错:', error)
    ElMessage.error('下载文件时出错')
  }
}

// 时域案例下载方法
const handleTimeDownload = async () => {
  try {
    if (timeUploadResult.value?.data) {
      const content = typeof timeUploadResult.value.data === 'string' 
        ? timeUploadResult.value.data 
        : JSON.stringify(timeUploadResult.value.data)
      
      const mimeType = timeUploadForm.outputFormat === 'csv' 
        ? 'text/csv' 
        : 'text/plain'
      
      const blob = new Blob([content], { type: mimeType })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `beam_time_compound_data.${timeUploadForm.outputFormat}`
      
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      ElMessage.success('文件下载开始')
    } else {
      ElMessage.error('没有可用的数据')
    }
  } catch (error) {
    console.error('下载出错:', error)
    ElMessage.error('下载文件时出错')
  }
}
</script>

<style scoped>
</style>