/* eslint-disable */
<template>
  <div class="upload-container">
    <!-- 文件上传部分 -->
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>文件上传</span>
        </div>
      </template>

      <el-form :model="uploadForm" label-width="120px">
        <el-form-item label="选择文件">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :before-upload="beforeUpload"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
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
    <el-card>
      <template #header>
        <div class="card-header">
          <span>直接粘贴数据</span>
        </div>
      </template>

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
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// const baseUrl = 'http://127.0.0.1:4523/m1/5785836-5470237-default'

// const baseUrl = 'http://172.20.10.3:9090'

const baseUrl = 'http://172.30.130.165:9090'

const uploadUrl = ref(`${baseUrl}/api/json/uploadJsonFile`) // 默认值，会被 beforeUpload 修改

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

const getUploadUrl = (file) => {
  const extension = file.name.split('.').pop().toLowerCase()
  switch (extension) {
    case 'json': return `${baseUrl}/api/json/uploadJsonFile`
    case 'xml': return `${baseUrl}/api/xml/uploadXmlFile`
    case 'txt': return `${baseUrl}/api/text/uploadfileTxt`
    case 'npy': return `${baseUrl}/api/npy/uploadNpy`
    case 'csv': return `${baseUrl}/api/csv/uploadCsvFile`
    default: return `${baseUrl}/api/json/uploadJsonFile`
  }
}

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

  // 根据文件类型动态设置上传URL
  uploadUrl.value = getUploadUrl(file)
  // 添加日志查看实际的上传URL
  console.log('上传URL:', uploadUrl.value) 
  
  return true
}



//修改，打印详细成功信息
const handleUploadSuccess = (response) => {
  console.log('上传响应数据:', response)
  uploadResult.value = {
    success: true,
    message: '文件处理成功',
    data: response  // 直接存储响应数据
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
    if (uploadResult.value?.data) {
      const content = typeof uploadResult.value.data === 'string' 
        ? uploadResult.value.data 
        : JSON.stringify(uploadResult.value.data)
      
      const mimeType = uploadForm.outputFormat === 'csv' 
        ? 'text/csv' 
        : 'text/plain'
      
      const blob = new Blob([content], { type: mimeType })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `processed_testData.${uploadForm.outputFormat}`
      
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

// 数据粘贴相关方法 1.20未修改
const submitPasteData = async () => {
  if (!pasteForm.content.trim()) {
    ElMessage.error('请先粘贴数据')
    return
  }

  try {
    const response = await fetch('http://localhost:9090/api/convert', {
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
.upload-container {
  max-width: 800px;
  margin: 20px auto;
}

.mb-4 {
  margin-bottom: 16px;
}

.upload-result,
.paste-result {
  margin-top: 20px;
}

.mt-3 {
  margin-top: 12px;
}
</style>