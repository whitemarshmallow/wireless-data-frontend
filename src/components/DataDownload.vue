<template>
  <el-card class="download-container">
    <template #header>
      <div class="card-header">
        <span>数据下载</span>
      </div>
    </template>

    <el-form :model="downloadForm" label-width="120px">
      <el-form-item label="主类别">
        <el-select 
          v-model="downloadForm.mainCategory"
          placeholder="请选择主类别"
          @change="handleMainCategoryChange"
        >
          <el-option
            v-for="category in mainCategories"
            :key="category.value"
            :label="category.label"
            :value="category.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="子类别" v-if="showSubCategories">
        <el-checkbox-group v-model="downloadForm.subCategories">
          <el-checkbox
            v-for="subCat in subCategories"
            :key="subCat"
            :label="subCat"
          >
            {{ subCat }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="模型类型" v-if="showModelTypes">
        <el-select 
          v-model="downloadForm.modelType"
          placeholder="请选择模型类型"
          @change="handleModelTypeChange"
        >
          <el-option
            v-for="model in modelTypes"
            :key="model.value"
            :label="model.label"
            :value="model.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="数据类型" v-if="showDataTypes">
        <el-checkbox-group v-model="downloadForm.dataTypes">
          <el-checkbox
            v-for="dataType in dataTypes"
            :key="dataType"
            :label="dataType"
          >
            {{ dataType }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="下载格式">
        <el-select v-model="downloadForm.format" placeholder="选择下载格式">
          <el-option label="压缩包 (ZIP)" value="zip" />
          <el-option label="单个CSV文件" value="csv" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleDownload">下载数据</el-button>
      </el-form-item>
    </el-form>

    <div v-if="downloadResult" class="download-result">
      <el-alert
        :title="downloadResult.message"
        :type="downloadResult.success ? 'success' : 'error'"
        show-icon
      />
    </div>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const categoryMap = {
  'mobility_management': ['无线资源控制和无线接入承载', '切换管理', '数据传输与吞吐量', '信道质量与资源分配', '用户流量与服务性能'],
  'beam': ['波束时序合成数据', '波束时序仿真数据','波束时序处理后数据','波束空域合成数据','波束空域仿真数据','波束空域处理后数据'],
  'csi_data': ['资源管理', '网络性能监控', '服务质量优化', '故障诊断']
}

const modelDataTypeMap = {
  'gnn': ['图数据'],
  'large_model': ['文本数据'],
  'time_series': ['时序数据']
}

const downloadForm = reactive({
  mainCategory: '',
  subCategories: [],
  modelType: '',
  dataTypes: [],
  format: 'zip'
})

const downloadResult = ref(null)
const showSubCategories = ref(false)
const showModelTypes = ref(false)
const showDataTypes = ref(false)

const mainCategories = [
  { label: '移动性管理', value: 'mobility_management' },
  { label: '波束', value: 'beam' },
  { label: '网优数据', value: 'csi_data' }
]

const modelTypes = [
  { label: '图神经网络', value: 'gnn' },
  { label: '大模型', value: 'large_model' },
  { label: '时序模型', value: 'time_series' }
]

const subCategories = computed(() => 
  categoryMap[downloadForm.mainCategory] || []
)

const dataTypes = computed(() => 
  modelDataTypeMap[downloadForm.modelType] || []
)

const handleMainCategoryChange = () => {
  downloadForm.subCategories = []
  downloadForm.modelType = ''
  downloadForm.dataTypes = []
  showSubCategories.value = true
  showModelTypes.value = true
}

const handleModelTypeChange = () => {
  downloadForm.dataTypes = []
  showDataTypes.value = true
}

const handleDownload = async () => {
  // 验证表单
  if (!downloadForm.mainCategory) {
    ElMessage.error('请选择主类别')
    return
  }
  if (downloadForm.subCategories.length === 0) {
    ElMessage.error('请至少选择一个子类别')
    return
  }
  if (!downloadForm.modelType) {
    ElMessage.error('请选择模型类型')
    return
  }
  if (downloadForm.dataTypes.length === 0) {
    ElMessage.error('请至少选择一个数据类型')
    return
  }

  try {
    const response = await fetch('http://172.30.130.165:9090/api/download-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(downloadForm)
    })

    if (!response.ok) {
      throw new Error('下载失败')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = downloadForm.format === 'zip' ? 'download.zip' : 'download.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)

    downloadResult.value = {
      success: true,
      message: '数据下载成功'
    }
  } catch (error) {
    downloadResult.value = {
      success: false,
      message: error.message
    }
  }
}
</script>

<style scoped>
.download-container {
  max-width: 800px;
  margin: 20px auto;
}

.download-result {
  margin-top: 20px;
}
</style>