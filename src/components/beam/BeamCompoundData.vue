<template>
  <div class="beam-container">
    <!-- Tab 切换部分 -->
    <el-tabs v-model="activeTab" class="mb-4">
      <el-tab-pane label="波束空域数据合成" name="airspace">
        <!-- 空域案例内容 -->
        <div class="upload-container">
          <el-card class="mb-4">
            <template #header>
              <div class="card-header">
                <span>文件上传</span>
              </div>
            </template>

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
        </div>
      </el-tab-pane>

      <el-tab-pane label="波束时域数据合成" name="time">
        <div class="upload-container">
          <el-card class="mb-4">
            <template #header>
              <div class="card-header">
                <span>文件上传</span>
              </div>
            </template>

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
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// const baseUrl = 'http://192.168.43.139:9090'

//我的热点

const baseUrl = 'http://172.20.10.3:9090'

//研究院 wifi

// const baseUrl = 'http://172.30.130.165:9090'

// 上传 URL
const airspaceUploadUrl = `${baseUrl}/api/beam/airspace/compound-data`
const timeUploadUrl = `${baseUrl}/api/beam/time/compound-data`

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
.beam-container {
  max-width: 800px;
  margin: 20px auto;
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-3 {
  margin-top: 12px;
}
</style>

