/* eslint-disable */
<template>
  <div class="upload-container">
    <!-- 半透明白色遮罩层 -->
    <div class="page-overlay"></div>

    <!-- 页面标题 -->
    <h1 class="page-title">数据上传平台</h1>
    
    <!-- 页面介绍 -->
    <div class="intro-section translucent-container">
      <h2 class="section-title">功能介绍</h2>
      <p class="description-text">
        数据上传平台支持多种格式数据的上传与转换，为无线网络数据处理提供便捷入口。
        您可以通过文件上传或直接粘贴的方式提交数据，系统将自动进行处理并提供标准格式的输出结果。
      </p>
    </div>

    <!-- 上传方式选择 -->
    <div class="features-section mb-5">
      <div class="row">
        <div class="col">
          <div class="info-card">
            <h3><i class="el-icon-upload"></i> 文件上传</h3>
            <p class="description-text">支持多种格式文件上传，包括JSON、XML、TXT、NPY、CSV等</p>
          </div>
        </div>
        <div class="col">
          <div class="info-card">
            <h3><i class="el-icon-edit"></i> 直接粘贴</h3>
            <p class="description-text">可直接粘贴数据内容，支持JSON、XML、TXT等常用文本格式</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件上传部分 -->
    <el-card class="mb-5 custom-card">
      <template #header>
        <div class="card-header">
          <span><i class="el-icon-upload mr-2"></i>文件上传</span>
        </div>
      </template>

      <div class="card-description mb-4">
        <p class="description-text">
          通过此功能，您可以上传各种格式的数据文件进行处理。系统将自动识别文件类型并进行相应处理，
          支持将数据转换为标准格式以便后续分析与处理。
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
            accept=".json,.xml,.txt,.npy,.csv"
            :data="{ outputFormat: uploadForm.outputFormat }"
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
          <el-select v-model="uploadForm.outputFormat" placeholder="选择输出格式">
            <el-option label="CSV" value="csv" />
            <el-option label="TXT" value="txt" disabled />
          </el-select>
        </el-form-item>
      </el-form>

      <div v-if="uploadResult" class="upload-result">
        <el-alert
          :title="uploadResult.message"
          :type="uploadResult.success ? 'success' : 'error'"
          show-icon
        />
        <el-button 
          v-if="uploadResult.success" 
          type="primary"
          @click="handleDownload"
          class="mt-3"
        >
          下载转换后的文件
        </el-button>
      </div>
    </el-card>

    <!-- 数据粘贴部分 -->
    <el-card class="mb-5 custom-card">
      <template #header>
        <div class="card-header">
          <span><i class="el-icon-edit mr-2"></i>直接粘贴数据</span>
        </div>
      </template>

      <div class="card-description mb-4">
        <p class="description-text">
          如果您已有格式化的数据内容，可以直接粘贴到下方文本框中进行处理。
          此功能适合处理较小规模的数据或从其他来源临时复制的数据内容。
        </p>
      </div>

      <el-form :model="pasteForm" label-width="120px">
        <el-form-item label="粘贴数据">
          <el-input
            v-model="pasteForm.content"
            type="textarea"
            :rows="10"
            placeholder="在此粘贴数据（支持 JSON, XML, TXT 格式）..."
          />
        </el-form-item>

        <el-form-item label="输出格式">
          <el-select v-model="pasteForm.outputFormat" placeholder="选择输出格式">
            <el-option label="CSV" value="csv" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitPasteData">提交并转换</el-button>
        </el-form-item>
      </el-form>

      <div v-if="pasteResult" class="paste-result">
        <el-alert
          :title="pasteResult.message"
          :type="pasteResult.success ? 'success' : 'error'"
          show-icon
        />
        <el-button 
          v-if="pasteResult.success" 
          type="primary"
          @click="handlePasteDownload"
          class="mt-3"
        >
          下载转换后的文件
        </el-button>
      </div>
    </el-card>

    <!-- 数据处理流程 -->
    <div class="process-description translucent-container mb-5">
      <h3 class="sub-section-title">数据处理流程</h3>
      <div class="process-steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>数据提交</h4>
            <p>通过文件上传或直接粘贴提交数据</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>格式转换</h4>
            <p>系统自动处理并转换为标准格式</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>结果下载</h4>
            <p>下载处理后的数据用于后续分析</p>
          </div>
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

// 初始化上传 URL（将在 beforeUpload 中动态修改）
const uploadUrl = ref(getApiUrl('/api/upload', baseUrl))

// 文件上传表单数据
const uploadForm = reactive({
  outputFormat: 'csv'
})
const uploadResult = ref(null)

// 数据粘贴表单数据
const pasteForm = reactive({
  content: '',
  outputFormat: 'csv'
})
const pasteResult = ref(null)


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

//修改，打印详细成功信息
const handleUploadSuccess = (response) => {
  console.log('上传响应数据:', response)
  console.log('outputformat:', uploadForm.outputFormat)
  uploadResult.value = {
    success: true,
    message: '文件处理成功',
    data: response,  // 直接存储响应数据
    downloadUrl:response.downloadUrl
  }
}

//修改，打印详细错误信息
const handleUploadError = (err) => {
  console.error('上传错误:', err)
  const errorMessage = err.message || '未知错误'
  ElMessage.error(`文件上传失败: ${errorMessage}`)
  uploadResult.value = {
    success: false,
    message: `文件上传失败: ${errorMessage}`
  }
}

const handleDownload = async () => {
  try {
    const downloadUrl = uploadResult.value?.downloadUrl || uploadResult.value?.data?.downloadUrl
    
    if(downloadUrl) {
      const fullUrl = getApiUrl(downloadUrl, baseUrl)
      
      // 使用fetch请求数据，无论服务器如何响应
      ElMessage.info('正在准备下载文件...')
      
      // 执行fetch请求获取文件内容
      const response = await fetch(fullUrl)
      const data = await response.text() // 获取文本内容，无论响应类型
      
      // 创建Blob对象
      const blob = new Blob([data], { type: 'text/csv' })
      
      // 创建下载链接
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `network_data_${new Date().getTime()}.csv` // 使用时间戳确保文件名唯一
      
      // 触发下载
      document.body.appendChild(a)
      a.click()
      
      // 清理
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      ElMessage.success('文件下载已开始')
    } else {
      // 保留原有的后备方案...
      ElMessage.error('没有可用的下载链接')
    }
  } catch (error) {
    console.error('下载出错:', error)
    ElMessage.error(`下载文件时出错: ${error.message}`)
  }
}

// 数据粘贴相关方法
const submitPasteData = async () => {
  if (!pasteForm.content.trim()) {
    ElMessage.error('请先粘贴数据')
    return
  }

  try {
    const response = await fetch(getApiUrl('/api/convert', baseUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: pasteForm.content,
        outputFormat: pasteForm.outputFormat
      })
    })

    const result = await response.json()
    
    if (result.success) {
      pasteResult.value = {
        success: true,
        message: '数据转换成功',
        downloadUrl: result.downloadUrl
      }
    } else {
      pasteResult.value = {
        success: false,
        message: result.message || '转换失败'
      }
    }
  } catch (error) {
    pasteResult.value = {
      success: false,
      message: '提交或转换过程中发生错误'
    }
  }
}

const handlePasteDownload = async () => {
  try {
    if (pasteResult.value?.data) {
      const content = typeof pasteResult.value.data === 'string' 
        ? pasteResult.value.data 
        : JSON.stringify(pasteResult.value.data)
      
      const mimeType = pasteForm.outputFormat === 'csv' 
        ? 'text/csv' 
        : 'text/plain'
      
      const blob = new Blob([content], { type: mimeType })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pasted_data.${pasteForm.outputFormat}`
      
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
/* 数据上传页面特定样式 */
.upload-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
  position: relative;
  color: var(--text);
}

/* 布局样式 */
.row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.col {
  flex: 1;
}

/* 卡片描述文本 */
.card-description {
  border-left: 3px solid var(--secondary);
  padding-left: 15px;
  margin: 10px 0 20px;
  background-color: rgba(143, 91, 253, 0.05);
  padding: 10px 15px;
  border-radius: 0 5px 5px 0;
}

/* 自定义卡片样式 */
.custom-card {
  transition: transform 0.3s, box-shadow 0.3s;
  margin-bottom: 30px;
}

/* 处理流程样式 */
.process-steps {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  flex: 1;
  padding: 0 10px;
}

.step-number {
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
  flex-shrink: 0;
  box-shadow: 0 3px 8px rgba(255, 123, 76, 0.3);
}

.step-content {
  flex: 1;
}

.step-content h4 {
  margin: 0 0 5px;
  color: var(--text);
}

.step-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* 子标题样式 */
.sub-section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

/* 上传/粘贴结果样式 */
.upload-result,
.paste-result {
  margin-top: 20px;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

/* 支持与联系样式 */
.support-contact {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 15px;
}

.contact-item {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  background-color: rgba(255, 255, 255, 0.7);
  padding: 8px 15px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.contact-item i {
  margin-right: 10px;
  color: var(--primary);
}

.mr-2 {
  margin-right: 8px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .row {
    flex-direction: column;
    gap: 15px;
  }
  
  .process-steps {
    flex-direction: column;
  }
  
  .support-contact {
    flex-direction: column;
    gap: 10px;
  }
}
</style>