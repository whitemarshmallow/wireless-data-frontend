/* eslint-disable */
<template>
  <div class="pingpong-container">
    <!-- 半透明白色遮罩层 -->
    <div class="page-overlay"></div>

    <!-- 页面标题 -->
    <h1 class="page-title">乒乓切换</h1>
    
    <!-- 页面介绍 -->
    <div class="intro-section translucent-container">
      <h2 class="section-title">功能介绍</h2>
      <p class="description-text">
        乒乓切换分析专注于解决无线网络中小区间频繁切换的问题，通过分析上传的网络数据，快速识别乒乓切换现象并提供针对性解决建议。
        系统基于智能算法，深入分析不同小区间的切换模式与频率，为网络切换优化提供科学决策支持。
      </p>
    </div>

    <!-- 功能特点 -->
    <div class="features-section mb-5">
      <div class="row">
        <div class="col">
          <div class="info-card">
            <h3><i class="el-icon-refresh"></i> 切换识别</h3>
            <p class="description-text">精准识别网络中的乒乓切换现象，快速定位问题区域</p>
          </div>
        </div>
        <div class="col">
          <div class="info-card">
            <h3><i class="el-icon-data-analysis"></i> 原因分析</h3>
            <p class="description-text">深入分析乒乓切换产生的原因，从多维度探究问题根源</p>
          </div>
        </div>
        <div class="col">
          <div class="info-card">
            <h3><i class="el-icon-magic-stick"></i> 优化建议</h3>
            <p class="description-text">提供专业的参数调整与优化建议，有效解决乒乓切换问题</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件上传部分 -->
    <el-card class="mb-5 custom-card">
      <template #header>
        <div class="card-header">
          <span><i class="el-icon-upload mr-2"></i>乒乓切换数据上传</span>
        </div>
      </template>

      <div class="card-description mb-4">
        <p class="description-text">
          请上传CSV格式的网络切换数据文件，系统将自动分析文件中的切换模式，识别乒乓切换现象，并生成优化建议。
          数据文件应包含基站ID、切换时间、信号强度等相关指标数据，以便系统进行全面分析。
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
                请选择 CSV 格式的乒乓切换数据文件
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>

      <div v-if="switchResult" class="switch-result">
        <el-alert
          :title="switchResult.message"
          :type="switchResult.success ? 'success' : 'error'"
          show-icon
        />
        
        <div v-if="switchResult.success" class="result-container mt-4">
          <h3 class="result-title">切换优化建议</h3>
          <el-input 
            v-model="switchResult.suggestion" 
            type="textarea"
            :rows="12"
            readonly
            class="mt-3 switch-textarea"
            placeholder="等待乒乓切换优化建议..."
          >
          </el-input>
        </div>
      </div>
    </el-card>
    
    <!-- 乒乓切换问题解析 -->
    <div class="problem-description translucent-container mb-5">
      <h3 class="sub-section-title">乒乓切换问题解析</h3>
      <p class="description-text mb-4">
        乒乓切换是指终端设备在相邻小区间短时间内频繁往返切换的现象，会导致信令开销增加、用户体验下降、网络资源浪费等问题。
        常见原因包括覆盖重叠区域参数配置不合理、切换门限设置过低、小区边界模糊等因素。通过分析实际网络数据，系统能够识别并解决以下常见问题：
      </p>
      
      <div class="problems-grid">
        <div class="problem-item">
          <div class="problem-icon"><i class="el-icon-warning"></i></div>
          <div class="problem-content">
            <h4>频繁切换</h4>
            <p>终端在短时间内多次在相邻小区间往返切换</p>
          </div>
        </div>
        <div class="problem-item">
          <div class="problem-icon"><i class="el-icon-warning"></i></div>
          <div class="problem-content">
            <h4>切换失败</h4>
            <p>切换过程中信令交换失败导致连接中断</p>
          </div>
        </div>
        <div class="problem-item">
          <div class="problem-icon"><i class="el-icon-warning"></i></div>
          <div class="problem-content">
            <h4>参数不当</h4>
            <p>小区间切换参数配置不合理造成切换决策错误</p>
          </div>
        </div>
        <div class="problem-item">
          <div class="problem-icon"><i class="el-icon-warning"></i></div>
          <div class="problem-content">
            <h4>切换延迟</h4>
            <p>切换决策延迟导致用户体验下降</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 优化流程 -->
    <div class="process-description translucent-container mb-5">
      <h3 class="sub-section-title">优化流程</h3>
      <div class="process-steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>数据收集</h4>
            <p>采集网络切换事件与相关性能指标</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>问题识别</h4>
            <p>系统分析并识别乒乓切换现象</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>原因诊断</h4>
            <p>深入分析乒乓切换的根本原因</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-content">
            <h4>参数优化</h4>
            <p>根据建议调整优化网络参数配置</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 优化收益 -->
    <div class="benefit-section translucent-container mb-5">
      <h2 class="section-title">优化收益</h2>
      <div class="benefits-grid">
        <div class="benefit-card">
          <h3><i class="el-icon-data-line"></i> 降低切换率</h3>
          <p class="description-text">减少不必要的小区切换，显著降低乒乓切换现象</p>
        </div>
        <div class="benefit-card">
          <h3><i class="el-icon-cpu"></i> 减轻网络负担</h3>
          <p class="description-text">降低信令开销，有效减轻网络负担</p>
        </div>
        <div class="benefit-card">
          <h3><i class="el-icon-user"></i> 提升用户体验</h3>
          <p class="description-text">减少掉线率，提高通话质量与数据连续性</p>
        </div>
        <div class="benefit-card">
          <h3><i class="el-icon-lightning"></i> 提高通话质量</h3>
          <p class="description-text">保持稳定连接，降低掉话率，提高通话质量</p>
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
// const baseUrl = 'http://172.30.130.53:5000'  // 自定义 URL

const uploadUrl = ref(getApiUrl('/api/pingpong/uploadCsv', baseUrl))

// 文件上传表单数据
const uploadForm = reactive({})
const switchResult = ref(null)

// 文件上传相关方法
const beforeUpload = (file) => {
  if (!file.name.toLowerCase().endsWith('.csv')) {
    ElMessage.error('请上传CSV格式的数据文件！')
    return false
  }

  // 添加日志查看实际的上传URL
  console.log('上传URL:', uploadUrl.value) 
  return true
}

// 打印详细成功信息
const handleUploadSuccess = (response) => {
  console.log('上传响应数据:', response)
  switchResult.value = {
    success: true,
    message: '乒乓切换数据分析完成',
    suggestion: response.suggestion || '暂无乒乓切换优化建议'
  }
}

// 打印详细错误信息
const handleUploadError = (err) => {
  console.error('上传错误:', err)
  const errorMessage = err.message || '未知错误'
  ElMessage.error(`文件上传失败: ${errorMessage}`)
  switchResult.value = {
    success: false,
    message: `文件上传失败: ${errorMessage}`
  }
}
</script>

<style scoped>
/* 乒乓切换问题样式 */
.problems-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.problem-item {
  display: flex;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
}

.problem-icon {
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
}

.problem-content h4 {
  margin: 0 0 5px;
  font-size: 1rem;
  color: var(--text);
}

.problem-content p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* 优化收益样式 */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.benefit-card {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.benefit-card h3 {
  display: flex;
  align-items: center;
  color: var(--primary);
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.benefit-card h3 i {
  margin-right: 10px;
}
</style>