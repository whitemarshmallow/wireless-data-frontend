<template>
  <div class="image-selector">
    <el-checkbox-group v-model="selectedImageTypes">
        <el-checkbox
        v-for="imageType in avaliableImageTypes"
        :key="imageType.value" :label="imageType.value">
            {{ imageType.label }}
        </el-checkbox>
    </el-checkbox-group>

    <div class="button-container">
        <el-button
        type="primary" :disabled="selectedImageTypes.length===0" 
        @click="confirmSelection">生成图表</el-button>
    </div>
  </div>
</template>

<script setup>
import { useNetworkDataProcessStore } from '@/store/networkDataProcessStore';
import { ref,computed } from 'vue';
// eslint-disable-next-line no-undef
const props=defineProps({
    category:{
        type:String,
        required:true
    },
    subOption:{
        type:Number,
        required:true
    }
})

const store=useNetworkDataProcessStore()
const selectedImageTypes=ref([])

//根据场景类别和子选项确定可用的图像类型
const avaliableImageTypes=computed(()=>{
    const baseOptions=[
        {label:'RSPR热力图',value:'RSPR热力图'},
        {label:'xx图2',value:'xx图2'},
        {label:'xx图3',value:'xx图3'},
    ]

    if(props.category==='user'){
        if(props.subOption===1){//覆盖与性能评估
            return[
                ...baseOptions,
                {label:'RSPR热力图',value:'RSPR热力图'}
            ]
        }
    }
    return baseOptions
})

const confirmSelection=()=>{
    if(selectedImageTypes.value.length>0){
        store.selectImageTypes(selectedImageTypes.value)
    }
}
</script>

<style scoped>
.image-selector {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.button-container {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>