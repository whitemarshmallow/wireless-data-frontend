<template>
  <div class="download-wrapper">
    <viavi-data-download
    v-if="sourceType==='viavi'"
    @download-completed="handleDownloadCompleted"
    in-chat-mode
    />
    <data-download
    v-else-if="sourceType==='institute'"
    @download-completed="handleDownloadCompleted"
    in-chat-mode
    />
    <div class="placeholder">
        <el-alert type="info" :closable="false">{{ sourceType==='network'?'现网数据':'波束数据' }}功能正在开发中</el-alert>
    </div>
  </div>
</template>

<script setup>
import {defineProps} from 'vue'
import { useNetworkDataProcessStore } from '@/store/networkDataProcessStore';
import ViaviDataDownload from '../download/ViaviDataDownload.vue';
import DataDownload from '../download/DataDownload.vue';

defineProps({
    sourceType:{
        type:String,
        required:true
    }
})

const store=useNetworkDataProcessStore()

const handleDownloadCompleted=(params)=>{
    store.completeDownload(params)
}

</script>
