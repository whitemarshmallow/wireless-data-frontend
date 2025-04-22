<template>
  <div class="model-selector">
    <!-- 第一步：是否需要大模型？ -->
     <div class="step-container" v-if="currentStep===1">
        <h4>是否需要大模型提供分析建议？</h4>
        <div class="option-buttons">
            <el-button type="primary" @click="selectLargeModel(true)">是，使用大模型</el-button>
            <el-button @click="selectLargeModel(false)">否，直接使用小模型</el-button>
        </div>
     </div>

     <!-- 第二步：选择小模型的类型 -->
      <div class="step-container" v-if="currentStep===2">
        <h4>请选择使用的小模型类型：</h4>
        <el-select v-model="selectedSmallModel" aria-placeholder="选择小模型类型" style="width:100%;">
            <el-option label="随机森林 (Random Forest)" value="random_forest"></el-option>
            <el-option label="LSTM 神经网络" value="lstm"></el-option>
            <el-option label="CNN 卷积神经网络" value="cnn"></el-option>
            <el-option label="K-means 聚类" value="kmeans"></el-option>
            <el-option label="线性回归" value="linear_regression"></el-option>
        </el-select>
      </div>

      <div class="button-container">
        <el-button type="primary" @click="confirmSelection" :disabled="!selectedSmallModel">开始分析</el-button>
      </div>
  </div>
</template>

<script setup>
import { useNetworkDataProcessStore } from '@/store/networkDataProcessStore';
import { ref } from 'vue';


const store=useNetworkDataProcessStore()
const currentStep=ref(1)
const useLargeModel=ref(false)
const selectedSmallModel=ref('')

//选择是否用大模型
const selectLargeModel=(useIt)=>{
    useLargeModel.value=useIt
    currentStep.value=2
}
//确认选择并提交
const confirmSelection=()=>{
    if(selectedSmallModel.value){
        store.setModelConfig({
            useLargeModel:useLargeModel.value,
            smallModelType:selectedSmallModel.value
        })
    }
}

</script>

<style scoped>
.model-selector {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.step-container {
  margin-bottom: 16px;
}

.step-container h4 {
  margin-bottom: 12px;
}

.option-buttons {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.button-container {
  margin-top: -10px;
  display: flex;
  justify-content: flex-end;
}
</style>