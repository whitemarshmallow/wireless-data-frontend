<template>
  <div class="data-source-selector">
    <el-radio-group v-model="selectedSource" @change="handleSelection">
        <el-radio-button label="viavi">viavi仿真数据</el-radio-button>
        <el-radio-button label="institute">信通院仿真数据</el-radio-button>
        <el-radio-button label="network">现网数据</el-radio-button>
        <el-radio-button label="beam">波束数据</el-radio-button>
    </el-radio-group>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useNetworkDataProcessStore } from '@/store/networkDataProcessStore';

const store=useNetworkDataProcessStore()
const selectedSource=ref('')

const handleSelection=()=>{
    store.setDataSource(selectedSource.value)
}

</script>
