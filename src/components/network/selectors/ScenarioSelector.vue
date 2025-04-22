<template>
  <div class="scenarios-selector">
    <div class="category-selection">
        <el-radio-group v-model="selectedCategory" @change="resetSubOption">
            <el-radio-button label="baseStation">基站</el-radio-button>
            <el-radio-button label="user">用户</el-radio-button>
        </el-radio-group>
    </div>

    <div class="sub-option-selection" v-if="selectedCategory">
        <h4>{{ selectedCategory==='baseStation'?'基站':'用户' }}分析场景：</h4>
        <el-select v-model="selectedSubOption" aria-placeholder="选择分析场景" @change="handleSelection">
            <el-option 
                v-for="(label,value) in options[selectedCategory]" :key="value"
                :label="label" :value="Number(value)"
            />
        </el-select>
    </div>
  </div>
</template>

<script setup>
import { useNetworkDataProcessStore } from '@/store/networkDataProcessStore';
import { ref,reactive } from 'vue';

const store=useNetworkDataProcessStore()
const selectedCategory=ref('')
const selectedSubOption=ref(null)

const options=reactive({
    'baseStation': {
        1: "容量与负载管理",
        2: "能耗与能效分析",
        3: "邻区关系和切换优化",
        4: "基站MIMO",
        5: "RRC连接分析",
        6: "PCI/天线方向",
        7: "综合KPI",
    },
    'user': {
        1: "覆盖与性能评估",
        2: "网络容量与吞吐分析",
        3: "QoS与切片管理",
        4: "异常检测与网络故障排查",
        5: "基于位置的业务体验分析",
        6: "Massive MIMO与波束管理评估",
        7: "TA与距离管理",
    }
})

const resetSubOption=()=>{
    selectedSubOption.value=null
}

const handleSelection=()=>{
    if(selectedCategory.value&&selectedSubOption.value){
        store.selectScenario(selectedCategory.value,selectedSubOption.value)
    }
}

</script>
