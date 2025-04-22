/* eslint-disable */
<template>
  <div class="upload-container">
    <!-- 文件上传部分 -->
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>数据上传</span>
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
            accept=".csv"
          >
            <el-button type="primary">选择文件</el-button>
            <template #tip>
              <div class="el-upload__tip">
                请选择 csv 格式的网络数据文件
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
        <el-input 
          v-if="optimizationResult.success"
          v-model="optimizationResult.suggestion" 
          type="textarea"
          :rows="10"
          readonly
          class="mt-3"
          placeholder="等待网优建议..."
        >
        </el-input>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// const baseUrl = 'http://127.0.0.1:4523/m1/5785836-5470237-default'

const baseUrl = 'http://172.20.10.3:9090'

// const baseUrl = 'http://172.30.130.165:9090'

const uploadUrl = ref(`${baseUrl}/api/network/uploadCsv`) 

// 文件上传表单数据
const uploadForm = reactive({})
const optimizationResult = ref(null)


// 文件上传相关方法
const beforeUpload = (file) => {
  if (!file.name.toLowerCase().endsWith('.csv')) {
    ElMessage.error('请上传csv格式的网优数据文件！')
    return false
  }

  // 添加日志查看实际的上传URL
  console.log('上传URL:', uploadUrl.value) 
  return true
}


//打印详细成功信息
const handleUploadSuccess = (response) => {
  console.log('上传响应数据:', response)
  optimizationResult.value = {
    success: true,
    message: '网优数据分析完成',
    suggestion:response.suggestion||'暂无网优建议'
  }
}

//打印详细错误信息
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

.optimization-result{
  margin-top: 20px;
}
.el-textarea.readonly .el-textarea__inner{
  background-color: #f5f7fa;
}
</style>