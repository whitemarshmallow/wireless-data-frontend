/* eslint-disable */
<template>
  <div class="llm-container">
    <!-- 半透明白色遮罩层 -->
    <div class="page-overlay"></div>

    <!-- 页面标题 -->
    <h1 class="page-title">大模型数据搜集</h1>
    
    <!-- 页面介绍 -->
    <div class="intro-section translucent-container">
      <h2 class="section-title">功能介绍</h2>
      <p class="description-text">
        大模型数据搜集提供高效的数据采集与筛选功能，支持根据多种参数条件精准获取无线网络样本数据。
        通过设置主类别、时间间隔、UE速度等参数，系统将自动匹配符合条件的高质量样本，为大模型训练与研究提供数据支持。
      </p>
    </div>

    <!-- 功能特点 -->
    <div class="features-section mb-5">
      <div class="row">
        <div class="col">
          <div class="info-card">
            <h3><i class="el-icon-search"></i> 精准筛选</h3>
            <p class="description-text">支持多维度参数筛选，精确匹配所需数据样本</p>
          </div>
        </div>
        <div class="col">
          <div class="info-card">
            <h3><i class="el-icon-data-board"></i> 智能分析</h3>
            <p class="description-text">基于大模型技术，提供专业的数据分析建议</p>
          </div>
        </div>
        <div class="col">
          <div class="info-card">
            <h3><i class="el-icon-download"></i> 便捷导出</h3>
            <p class="description-text">支持多种格式导出，满足不同场景的数据需求</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索条件表单 -->
    <el-card class="mb-5 custom-card">
      <template #header>
        <div class="card-header">
          <span><i class="el-icon-search mr-2"></i>大模型数据搜集</span>
        </div>
      </template>

      <div class="card-description mb-4">
        <p class="description-text">
          请设置以下数据筛选条件，系统将根据您的需求搜集适合的样本数据。设置越精确，获取的数据将越符合您的研究需求。
          设置完成后点击"提交查询"按钮，系统将自动分析并生成数据建议。
        </p>
      </div>

      <el-form :model="searchForm" label-width="120px" class="search-form">
        <div class="form-row">
          <el-form-item label="主类别">
            <el-select 
                v-model="searchForm.mainCategory"
                placeholder="请选择主类别"
                class="custom-select"
              >
              <el-option
                    v-for="category in mainCategories"
                    :key="category.value"
                    :label="category.label"
                    :value="category.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="需要关注的问题">
            <el-select 
                v-model="searchForm.attentionQuestion"
                placeholder="请选择需要关注的问题"
                class="custom-select"
              >
              <el-option
                    v-for="question in attentionQuestions"
                    :key="question.value"
                    :label="question.label"
                    :value="question.value"
              />
            </el-select>
          </el-form-item>
        </div>

        <div class="form-row">
          <el-form-item label="间隔大小">
            <el-select 
              v-model="searchForm.interval" 
              placeholder="请选择间隔大小"
              class="custom-select"
            >
              <el-option
                v-for="interval in intervals"
                :key="interval"
                :label="`${interval}ms`"
                :value="interval"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="UE速度">
            <el-select 
              v-model="searchForm.speed" 
              placeholder="请选择UE速度"
              class="custom-select"
            >
              <el-option
                v-for="speed in speeds"
                :key="speed"
                :label="speed.label"
                :value="speed.value"
              />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="时间跨度">
          <div class="time-range-container">
            <el-input 
              v-model="searchForm.startTime" 
              placeholder="请输入起始时间"  
              clearable
              class="time-input"
            />
            <span class="unit-label">ms</span>
            <span class="separator">至</span>           
            <el-input 
              v-model="searchForm.endTime" 
              placeholder="请输入结束时间"  
              clearable
              class="time-input"
            />
            <span class="unit-label">ms</span>
          </div>
        </el-form-item>

        <el-form-item label="样本数量">
          <div class="sample-count-container">
            <el-input-number
              v-model="searchForm.sampleCount"
              :min="1"
              placeholder="请输入样本数量"
              class="sample-input"
            />
            <span class="unit-label">个</span>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitSearchData" :loading="loading" class="submit-btn">
            <i class="el-icon-search mr-2"></i>提交查询
          </el-button>
        </el-form-item>
      </el-form>   
    </el-card>

    <!-- 搜索结果展示 -->
    <div v-if="searchResult" class="results-section mb-5">
      <el-card class="result-card custom-card">
        <template #header>
          <div class="card-header">
            <span><i class="el-icon-data-analysis mr-2"></i>搜索结果与分析</span>
          </div>
        </template>

        <el-alert
          :title="searchResult.message"
          :type="searchResult.success ? 'success' : 'error'"
          show-icon
          class="mb-4"
        />

        <template v-if="searchResult.success">
          <div class="analysis-container">
            <h3 class="analysis-title">大模型数据分析建议</h3>
            <div class="analysis-content">
              <el-input 
                v-model="fileDescription" 
                type="textarea"
                :rows="6"
                readonly
                placeholder="等待建议..."
                class="analysis-textarea"
              >
              </el-input>
            </div>
          </div>
            
          <div class="download-section">
            <div class="download-options">
              <span class="download-label">选择输出格式：</span>
              <el-select 
                v-model="searchForm.outputFormat" 
                placeholder="请选择输出格式"
                class="format-select"
              >
                <el-option label="TXT" value="txt" />
                <el-option label="CSV" value="csv" />
              </el-select>
            </div>
            
            <el-button 
              type="primary"
              @click="handleSearchDownload"
              class="download-btn"
            >
              <i class="el-icon-download mr-2"></i>下载结果文件
            </el-button>
          </div>
        </template>
      </el-card>
    </div>
    
    <!-- 应用场景 -->
    <div class="scenarios-section translucent-container mb-5">
      <h2 class="section-title">应用场景</h2>
      <div class="scenarios-grid">
        <div class="scenario-card">
          <h3>大模型训练</h3>
          <p class="description-text">为无线网络领域大模型训练提供高质量、多样化的数据样本</p>
        </div>
        <div class="scenario-card">
          <h3>性能预测</h3>
          <p class="description-text">基于历史数据进行网络性能预测，优化配置与部署</p>
        </div>
        <div class="scenario-card">
          <h3>算法验证</h3>
          <p class="description-text">为新算法提供真实网络环境下的测试数据，加速验证流程</p>
        </div>
        <div class="scenario-card">
          <h3>研究分析</h3>
          <p class="description-text">支持学术研究与深度分析，探索网络行为规律与优化方向</p>
        </div>
      </div>
    </div>

    <!-- 数据类型说明 -->
    <div class="data-types-section translucent-container mb-5">
      <h2 class="section-title">数据类型说明</h2>
      <div class="data-types-content">
        <div class="data-type-item">
          <div class="data-type-icon"><i class="el-icon-time"></i></div>
          <div class="data-type-desc">
            <h4>时域波束预测数据</h4>
            <p>包含时间序列信号特征，用于波束方向预测与优化</p>
          </div>
        </div>
        <div class="data-type-item">
          <div class="data-type-icon"><i class="el-icon-refresh"></i></div>
          <div class="data-type-desc">
            <h4>切换优化数据</h4>
            <p>记录用户设备在不同场景下的切换行为与性能表现</p>
          </div>
        </div>
        <div class="data-type-item">
          <div class="data-type-icon"><i class="el-icon-cpu"></i></div>
          <div class="data-type-desc">
            <h4>信令开销数据</h4>
            <p>统计网络信令交互过程中的资源消耗与效率指标</p>
          </div>
        </div>
        <div class="data-type-item">
          <div class="data-type-icon"><i class="el-icon-timer"></i></div>
          <div class="data-type-desc">
            <h4>时延精度数据</h4>
            <p>测量网络通信时延与波束定位精度的关联性指标</p>
          </div>
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

// 搜索表单数据
const searchForm = reactive({
  mainCategory: '',
  attentionQuestion:'',
  interval: '',
  speed: '',
  sampleCount: '',
  startTime: '',
  endTime: '',
  outputFormat: 'txt'
})

const searchResult = ref(null)
const loading = ref(false)
const fileDescription = ref('')

const mainCategories = [
  { label: '时域波束预测数据', value: 'time_domain_beam' }
]

const intervals = [60, 80, 100, 160]

const speeds = [
  {label: '30km/h', value: 30},
  {label: '60km/h', value: 60},
  {label: '90km/h', value: 90},
  {label: 'mix speed', value: 'mix'}
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
  if (!searchForm.startTime || !searchForm.endTime) {
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
  loading.value = true

  try {
    const response = await fetch(getApiUrl('/api/llmSearch', baseUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mainCategories: searchForm.mainCategory,
        interval: searchForm.interval,
        startTime: searchForm.startTime,
        endTime: searchForm.endTime,
        speed: searchForm.speed,
        sampleCount: searchForm.sampleCount,
        attentionQuestion: searchForm.attentionQuestion
      })
    })

    const result = await response.json()
    
    if (result.success) {
      searchResult.value = {
        success: true,
        message: '数据分析完成',
        data: result.data
      }
      console.log("result.deepseek值:", result.deepSeekAnswer);      
      fileDescription.value = result.deepSeekAnswer || '暂无文件说明'
      ElMessage.success('数据分析完成，请查看分析建议')
    } else {
      searchResult.value = {
        success: false,
        message: result.message || '获取数据失败'
      }
      fileDescription.value = ''
    }
  } catch (error) {
    console.error("查询错误", error);
    
    searchResult.value = {
      success: false,
      message: '查询过程中发生错误'
    }
  } finally {
    loading.value = false
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
/* 搜索表单样式 */
.search-form {
  margin-top: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .el-form-item {
  flex: 1;
}

.custom-select {
  width: 100%;
}

.time-range-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.time-input {
  max-width: 200px;
}

.unit-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0 5px;
}

.separator {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0 8px;
}

.sample-count-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sample-input {
  width: 180px;
}

.submit-btn {
  padding: 10px 25px;
  font-size: 1rem;
}
</style>