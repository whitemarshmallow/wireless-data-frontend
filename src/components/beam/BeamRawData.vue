<template>
  <div class="beam-container">
    <!-- 半透明白色遮罩层 -->
    <div class="page-overlay"></div>

    <!-- 页面标题 -->
    <h1 class="page-title">波束原始数据处理平台</h1>
    
    <!-- 页面介绍 -->
    <div class="intro-section translucent-container">
      <h2 class="section-title">功能介绍</h2>
      <p class="description-text">
        波束数据处理平台提供高效的数据转换与处理工具，支持多种格式的输入文件，为无线网络优化提供数据基础。
        本平台支持波束空域与时域原始数据的高精度处理，能够精确处理原始波束数据，支持多源数据融合，提供高质量数据基础。
      </p>
    </div>

    <!-- 处理优势 -->
    <div class="features-section mb-5">
      <div class="row">
        <div class="col">
          <div class="info-card">
            <h3><i class="el-icon-data-analysis"></i> 高精度处理</h3>
            <p class="description-text">采用先进算法进行数据处理，保证数据精度，支持多种格式无缝转换</p>
          </div>
        </div>
        <div class="col">
          <div class="info-card">
            <h3><i class="el-icon-upload"></i> 便捷上传</h3>
            <p class="description-text">支持多种格式文件上传，包括JSON、XML、TXT等常用格式</p>
          </div>
        </div>
        <div class="col">
          <div class="info-card">
            <h3><i class="el-icon-download"></i> 灵活导出</h3>
            <p class="description-text">可选择不同输出格式，满足后续分析与处理的多样化需求</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 切换部分 -->
    <el-tabs v-model="activeTab" class="custom-tabs mb-4">
      <el-tab-pane label="波束空域原始数据处理" name="airspace">
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
                波束空域原始数据处理支持对天线阵列捕获的空间域信号数据进行转换与处理。
                通过上传原始空域数据文件，系统将自动进行数据格式转换，使其适用于后续的信号处理与分析。
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
            <h3 class="sub-section-title">处理流程</h3>
            <div class="process-steps">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>数据上传</h4>
                  <p>选择并上传波束空域原始数据文件</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>数据处理</h4>
                  <p>系统自动进行数据格式化与标准化处理</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>结果导出</h4>
                  <p>下载转换后的数据文件用于后续分析</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="波束时域原始数据处理" name="time">
        <div class="upload-container">
          <el-card class="mb-5">
            <template #header>
              <div class="card-header">
                <span>文件上传</span>
              </div>
            </template>

            <div class="card-description mb-4">
              <p class="description-text">
                波束时域原始数据处理支持对天线阵列捕获的时间域信号数据进行转换与处理。
                通过上传原始时域数据文件，系统将自动进行时序数据的格式转换，便于后续的频谱分析与信号处理。
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
            <h3 class="sub-section-title">处理流程</h3>
            <div class="process-steps">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>数据上传</h4>
                  <p>选择并上传波束时域原始数据文件</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>数据处理</h4>
                  <p>系统自动进行时序数据格式化与标准化处理</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>结果导出</h4>
                  <p>下载转换后的数据文件用于后续分析</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    
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
const airspaceUploadUrl = getApiUrl('/api/beam/airspace/process-data', baseUrl)
const timeUploadUrl = getApiUrl('/api/beam/time/process-data', baseUrl)

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
      a.download = `beam_time_data.${timeUploadForm.outputFormat}`
      
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