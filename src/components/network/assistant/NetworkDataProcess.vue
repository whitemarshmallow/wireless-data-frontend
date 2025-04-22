<template>
  <div class="network-data-process">
    <network-optim-assistant :process-mode="true" />
  </div>
</template>

<script setup>
import NetworkOptimAssistant from './NetworkOptimAssistant.vue';
import {useNetworkDataProcessStore}from '../../../store/networkDataProcessStore'
import { onMounted } from 'vue';

const store=useNetworkDataProcessStore()

onMounted(()=>{
    //初始化数据处理流程
    store.startNewProcess()
})
</script>

<style scoped>
.network-data-process {
  max-width: 900px;
  margin: 0 auto;
}

.description {
  color: #606266;
  margin-bottom: 20px;
}
</style>