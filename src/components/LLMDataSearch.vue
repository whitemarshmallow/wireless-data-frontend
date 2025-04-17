/* eslint-disable */
<template>
  <div class="upload-container">
    <!-- 大模型数据搜集部分 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>大模型数据搜集</span>
        </div>
      </template>

      <el-form :model="searchForm" label-width="120px">
        <el-form-item label="主类别">
          <el-select 
              v-model="searchForm.mainCategory"
              placeholder="请选择主类别"
            >
            <el-option
                  v-for="category in mainCategories"
                  :key="category.value"
                  :label="category.label"
                  :value="category.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="间隔大小">
          <el-select v-model="searchForm.interval" placeholder="请选择间隔大小">
            <el-option
              v-for="interval in intervals"
              :key="interval"
              :label="`${interval}ms`"
              :value="interval"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="时间跨度">
          <div class="time-range-container">
            <el-input v-model="searchForm.startTime" 
              placeholder="请输入起始时间"  clearable/>
            <span class="unit-label">ms</span>
            <span class="separator">至</span>           
            <el-input v-model="searchForm.endTime" 
              placeholder="请输入结束时间"  clearable/>
            <span class="unit-label">ms</span>
          </div>
        </el-form-item>

        <el-form-item label="UE速度">
          <el-select v-model="searchForm.speed" placeholder="请选择UE速度">
            <el-option
              v-for="speed in speeds"
              :key="speed"
              :label="speed.label"
              :value="speed.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="样本数量">
          <el-input-number
          v-model="searchForm.sampleCount"
          :min="1"
          placeholder="请输入样本数量"
          />
          <span class="unit-label" style="margin-left: 10px;">个</span>
        </el-form-item>

        <el-form-item label="需要关注的问题">
          <el-select 
              v-model="searchForm.attentionQuestion"
              placeholder="请选择需要关注的问题"
            >
            <el-option
                  v-for="question in attentionQuestions"
                  :key="question.value"
                  :label="question.label"
                  :value="question.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitSearchData" :loading="loading">提交查询</el-button>
        </el-form-item>

        <el-form-item v-if="searchResult">
          <el-alert
            :title="searchResult.message"
            :type="searchResult.success ? 'success' : 'error'"
            show-icon
          />
        </el-form-item>

        <el-form-item v-if="searchResult?.success" label="数据分析建议">
          <el-input 
            v-model="fileDescription" 
            type="textarea"
            :rows="4"
            readonly
            placeholder="暂无分析建议"
          >
          </el-input>
        </el-form-item>
        

        <el-form-item v-if="searchResult?.success" label="输出格式">
          <el-select v-model="searchForm.outputFormat" placeholder="请选择输出格式">
            <el-option label="TXT" value="txt" />
            <el-option label="CSV" value="csv" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="searchResult?.success">
          <el-button 
            type="primary"
            @click="handleSearchDownload"
            class="mt-3"
          >
            下载结果文件
          </el-button>
        </el-form-item>
      </el-form>   
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// const baseUrl = 'http://127.0.0.1:4523/m1/5785836-5470237-default'

// const baseUrl = 'http://172.20.10.3:9090'

const baseUrl = 'http://172.30.130.165:9090'

// 搜索表单数据
const searchForm = reactive({
  mainCategory: '',
  attentionQuestion:'',
  interval: '',
  speed: '',
  sampleCount: '',
  startTime: '',
  endTime: ''
})

const searchResult = ref(null)
const loading = ref(false)
const fileDescription = ref('')

const mainCategories = [
  { label: '时域波束预测数据', value: 'time_domain_beam' }
]

const intervals=[60,80,100,160]

const speeds=[
  {label:'30km/h',value:30},
  {label:'60km/h',value:60},
  {label:'90km/h',value:90},
  {label:'mix speed',value:'mix'}
]

const attentionQuestions = [
  { label: '信令开销', value: 'signaling_overhead' },
  { label: '时延、波束精度', value: 'latency_beam_accuracy' }
]

// 提交搜索请求
const submitSearchData = async () => {
  if (!searchForm.mainCategory) {
    ElMessage.error('请选择主类别')
    return
  }
  if (!searchForm.interval) {
    ElMessage.error('请选择间隔大小')
    return
  }
  if (!searchForm.startTime||!searchForm.endTime) {
    ElMessage.error('请输入时间')
    return
  }
  if (!searchForm.speed) {
    ElMessage.error('请选择UE速度')
    return
  }
  if (!searchForm.sampleCount) {
    ElMessage.error('请输入样本数量')
    return
  }
  if (!searchForm.attentionQuestion) {
    ElMessage.error('请选择要关注的问题')
    return
  }
  loading.value=true

  try {
    const response = await fetch(`${baseUrl}/api/llmSearch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mainCategories:searchForm.mainCategory,
        interval:searchForm.interval,
        startTime:searchForm.startTime,
        endTime:searchForm.endTime,
        speed:searchForm.speed,
        sampleCount:searchForm.sampleCount,
        attentionQuestion:searchForm.attentionQuestion
      })
    })

    const result = await response.json()
    
    if (result.success) {
      searchResult.value = {
        success: true,
        message: '数据分析完成',
        data: result.data
      }
      fileDescription.value=result.description||'暂无文件说明'
      ElMessage.success('数据分析完成，请查看分析建议')
    } else {
      searchResult.value = {
        success: false,
        message: result.message || '获取数据失败'
      }
      fileDescription.value=''
    }
  } catch (error) {
    console.error("查询错误",error);
    
    searchResult.value = {
      success: false,
      message: '查询过程中发生错误'
    }
  }finally{
    loading.value=false
  }
}

const handleSearchDownload = async () => {
  try {
    if (searchResult.value?.data) {
      const content = typeof searchResult.value.data === 'string' 
        ? searchResult.value.data 
        : JSON.stringify(searchResult.value.data)
      
      const mimeType = searchForm.outputFormat === 'csv' 
        ? 'text/csv' 
        : 'text/plain'
      
      const blob = new Blob([content], { type: mimeType })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `llm_search_result.${searchForm.outputFormat}`
      
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

.mt-3 {
  margin-top: 2px;
}

.time-range-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.unit-label {
  color: #606266;
}

.separator {
  color: #606266;
}
</style>