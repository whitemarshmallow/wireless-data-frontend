<template>
  <div class="service-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>服务</span>
        </div>
      </template>
      <div class="service-content">
        <h3>我们的服务</h3>
        <el-descriptions border>
          <el-descriptions-item label="数据处理">提供专业的数据处理服务</el-descriptions-item>
          <el-descriptions-item label="数据分析">深度数据分析与可视化</el-descriptions-item>
          <el-descriptions-item label="技术支持">7*24小时技术支持</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup>
// 组件逻辑
</script>

<style scoped>
.service-container {
  padding: 20px;
}

.service-content {
  margin-top: 20px;
}
</style>