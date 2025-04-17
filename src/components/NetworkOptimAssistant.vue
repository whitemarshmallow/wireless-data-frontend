<template>
  <div class="assistant-container">
    <el-card>
        <template #header>
            <div class="card-header">
                <span>乒乓切换优化</span>
            </div>
        </template>

        <!-- 对话内容显示区域 -->
        <div class="chat-container" ref="chatContainerRef">
            <div v-if="messages.length===0" class="empty-chat">
                <el-empty description="暂无对话，开始提问吧"></el-empty>
            </div>
            <div v-else class="messages-container">
                <div v-for="(message,index) in messages"
                :key="index"
                :class="['message',message.role==='user'?'user-message':'assistant-message']">
                    <div class="message-content">
                        <div class="message-header">
                            <span class="role-indicator">{{ message.role==='user'?'您':'网络数据助理' }}</span>
                            <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                        </div>
                        <!-- 思考过程区域 -->
                        <div v-if="message.thinking" class="thinking-process">
                          <div class="thinking-header" @click="toggleThinking(index)">
                            <el-icon><DocumentCopy /></el-icon>
                            <span>思考过程</span>
                            <el-icon>
                              <ArrowDown v-if="!thinkingExpanded[index]" />
                              <ArrowUp v-else />
                            </el-icon>
                          </div>
                          <!-- 思考过程内容显示区域 -->
                          <div v-if="thinkingExpanded[index]" class="thinking-content" v-html="formatMessage(message.thinking)"></div>
                        </div>
                        <!-- 图像显示区域 -->
                        <div v-if="message.images && message.images.length>0" class="message-images">
                          <div v-for="(img,imgIndex) in message.images" :key="imgIndex" class="image-container">
                            <el-image
                              :src="img.url"
                              fit="contain"
                              :preview-src-list="[img.url]">
                            </el-image>
                            <div v-if="img.caption" class="image-caption">{{ img.caption }}</div>
                          </div>
                        </div>

                        <!-- 回答内容显示区域 -->
                        <div class="message-text" v-html="formatMessage(message.content)"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 加载 -->
        <div v-if="loading" class="loading-container">
            <div class="loading-status">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span>{{currentThinkingText}}</span>
            </div>
            <el-button v-if="!cancelActivited" type="danger" size="small" @click="requestCancel" >
              停止生成
            </el-button>
        </div>

        <!-- 模型选择区域 -->
        <div class="model-selection-container">
          <div class="model-selection-row">
            <span class="model-icon">🤖</span>
            <span class="model-label">选择模型</span>
            <el-popover
              placement="bottom"
              :width="360"
              trigger="click"
              popper-class="model-popover"
            >
              <template #reference>
                <div class="model-selector">
                  <span class="selected-models">
                    {{ getSelectedModelsText() }}
                  </span>
                  <el-icon><ArrowDown /></el-icon>
                </div>
              </template>
              
              <!-- 弹出的模型选择面板 -->
              <div class="model-options-panel">
                <h3 class="model-panel-title">选择使用的模型</h3>
                
                <!-- 大模型选项 -->
                <el-checkbox 
                  v-model="modelOptions.largeModel" 
                  class="model-option-item"
                  border
                >
                  <div class="model-option-content">
                    <span class="model-name">大模型</span>
                    <span class="model-description">适用于复杂网络数据问题分析</span>
                  </div>
                </el-checkbox>
                
                <!-- 小模型选项 -->
                <el-checkbox 
                  v-model="modelOptions.smallModel" 
                  class="model-option-item"
                  border
                >
                  <div class="model-option-content">
                    <span class="model-name">小模型</span>
                    <span class="model-description">针对特定网络数据场景的优化</span>
                  </div>
                </el-checkbox>
                
                <!-- 小模型详细选项 -->
                <div v-if="modelOptions.smallModel" class="small-model-detail">
                  <div class="small-model-category">
                    <span class="category-label">选择类别：</span>
                    <el-radio-group v-model="modelOptions.category" @change="handleCategoryChange" size="small">
                      <el-radio-button label="baseStation">基站</el-radio-button>
                      <el-radio-button label="user">用户</el-radio-button>
                    </el-radio-group>
                  </div>
                  
                  <!-- 基站小模型选项 -->
                  <div v-if="modelOptions.category === 'baseStation'" class="sub-model-options">
                    <el-select v-model="modelOptions.baseStationSubOption" placeholder="选择基站模型" size="large">
                      <el-option :label="'容量与负载管理'" :value="1"></el-option>
                      <el-option :label="'能耗与能效分析'" :value="2"></el-option>
                      <el-option :label="'邻区关系和切换优化'" :value="3"></el-option>
                      <el-option :label="'基站MIMO'" :value="4"></el-option>
                      <el-option :label="'RRC连接分析'" :value="5"></el-option>
                      <el-option :label="'PCI/天线方向'" :value="6"></el-option>
                      <el-option :label="'综合KPI'" :value="7"></el-option>
                    </el-select>
                  </div>
                  
                  <!-- 用户小模型选项 -->
                  <div v-if="modelOptions.category === 'user'" class="sub-model-options">
                    <el-select v-model="modelOptions.userSubOption" placeholder="选择用户模型" size="large">
                      <el-option :label="'覆盖与性能评估'" :value="1"></el-option>
                      <el-option :label="'网络容量与吞吐分析'" :value="2"></el-option>
                      <el-option :label="'QoS与切片管理'" :value="3"></el-option>
                      <el-option :label="'异常检测与网络故障排查'" :value="4"></el-option>
                      <el-option :label="'基于位置的业务体验分析'" :value="5"></el-option>
                      <el-option :label="'Massive MIMO与波束管理评估'" :value="6"></el-option>
                      <el-option :label="'TA与距离管理'" :value="7"></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </el-popover>
          </div>
        </div>
        
        <!-- 输入区域 -->
        <div class="input-container">
            <el-input
            v-model="userInput" type="textarea" :rows="3"
            placeholder="请输入您的问题"
            :disabled="loading"
            @keydown="handleKeyDown" />
            <div class="button-container">
                <el-button type="primary" @click="sendMessage"
                :disabled="loading||!userInput.trim()">发送
                </el-button>
            </div>
        </div>
    </el-card>
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, ref, watch} from 'vue'
import { ArrowUp, ArrowDown, DocumentCopy, Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
// import mermaid from 'mermaid'
import hljs from 'highlight.js'

// const baseUrl = 'http://127.0.0.1:4523/m1/5785836-5470237-default'

// const baseUrl = 'http://172.20.10.3:9090'

 const baseUrl = 'http://172.30.130.165:9090'


//响应式数据
const messages=ref([])
const userInput=ref('')
const chatContainerRef=ref(null)
const loading=ref(false)
//思考过程的响应式数据
const typeActive=ref(false)
const thinkingExpanded=ref({}) //思考过程的折叠or展开状态
const thinkingStage=ref(0)
const thinkingStages=[
  '正在加载历史对话...',
  '正在加载乒乓切换知识库...',
  '正在调用乒乓切换小模型...',
  '正在进行思考...',
]

// 模型选择相关的响应式数据
const modelOptions = ref({
  largeModel: true,         // 默认选择大模型
  smallModel: false,        // 默认不选择小模型
  category: 'baseStation',  // 默认选择基站类别
  baseStationSubOption: 1,  // 默认选择基站的第一个选项
  userSubOption: 1          // 默认选择用户的第一个选项
})

// 处理类别切换的函数
const handleCategoryChange = (category) => {
  if (category === 'baseStation') {
    modelOptions.value.baseStationSubOption = 1
  } else {
    modelOptions.value.userSubOption = 1
  }
}

// 获取当前选择的模型文本
const getSelectedModelsText = () => {
  const models = []
  
  if (modelOptions.value.largeModel) {
    models.push('大模型')
  }
  
  if (modelOptions.value.smallModel) {
    models.push('小模型')
    
    // 添加小模型的具体类型
    if (modelOptions.value.category === 'baseStation') {
      const baseStationOptions = {
        1: '容量与负载管理',
        2: '能耗与能效分析',
        3: '邻区关系和切换优化',
        4: '基站MIMO',
        5: 'RRC连接分析',
        6: 'PCI/天线方向',
        7: '综合KPI'
      }
      models.push(`基站-${baseStationOptions[modelOptions.value.baseStationSubOption]}`)
    } else {
      const userOptions = {
        1: '覆盖与性能评估',
        2: '网络容量与吞吐分析',
        3: 'QoS与切片管理',
        4: '异常检测与网络故障排查',
        5: '基于位置的业务体验分析',
        6: 'Massive MIMO与波束管理评估',
        7: 'TA与距离管理'
      }
      models.push(`用户-${userOptions[modelOptions.value.userSubOption]}`)
    }
  }
  
  return models.length > 0 ? models.join(' + ') : '请选择模型'
}

//模仿思考过程
const typingSpeed=30 //打字速度（ms
const sentenceDelay=300 //句子间的延迟（ms
//取消生成
const cancelRequested=ref(false) //是否请求取消
const cancelActivited=ref(false) //是否显示取消状态

//初始化示例消息
onMounted(()=>{
    messages.value.push({
        role:'assistant',
        content:"您好！我是网络数据助理，可以帮助您下载上传数据，预测特定数据。您可以通过下面的'选择模型'来指定使用大模型或小模型（基站/用户）进行回答。请问有什么可以帮助您的吗？",
        timestamp:new Date()
    })

})

//监听消息变化，而且需要自动滚到底部
watch(messages,()=>{
    nextTick(()=>{
        if(chatContainerRef.value){
            chatContainerRef.value.scrollTop=chatContainerRef.value.scrollHeight
        }
    })
},{deep:true})

//切换思考过程展开or折叠状态
const toggleThinking=(index)=>{
  thinkingExpanded.value[index]=!thinkingExpanded.value[index]
}

//当前思考状态
const currentThinkingText=computed(()=>{
  return typeActive.value?'正在回复中...':thinkingStages[thinkingStage.value]
})

//处理回车事件
const handleKeyDown=(event)=>{
    if(event.key==='Enter'&&!event.shiftKey){
        event.preventDefault();
        sendMessage()
    }
}

//请求取消生成
const requestCancel=()=>{
  cancelActivited.value=true

  //点击后两秒才会取消
  setTimeout(() => {
    cancelRequested.value=true
    ElMessage.info('已停止生成')
  }, 1500);
}

//重置取消状态
const resetCancelState=()=>{
  cancelRequested.value=false
  cancelActivited.value=false
}

//模仿逐字输出效果
const typewritterEffect=(text,index,field='content')=>{
  return new Promise((resolve)=>{
    //将文本分割成句子
    const sentences=text.split(/(?<=[.!?。！？]\s*)/g).filter(s=>s.trim()!=='')
    let sentenceIndex=0
    let currentDisplayText=''

    const typeNextSentence=()=>{
      //如果请求取消了，就提前结束并标记未完成状态
      if(cancelRequested.value){
        //添加标记：生成被中断了
        if(currentDisplayText){
          messages.value[index][field]=currentDisplayText+'生成已停止'
        }
        resolve()
        return
      }


      //如果处理完了所有句子，就完成打字
      if(sentenceIndex>=sentences.length){
        resolve()
        return
      }

      const sentence=sentences[sentenceIndex]
      let charIndex=0

      //开始对当前句子进行带效果
      const typechar=()=>{
        //检查请求是否取消
        if(cancelRequested.value){
          messages.value[index][field]=currentDisplayText+'生成已停止'
          resolve()
          return
        }

        if(charIndex<sentence.length){
          //在当前已显示文本后添加一个字符
          currentDisplayText+=sentence.charAt(charIndex)
          messages.value[index][field]=currentDisplayText
          charIndex++
          setTimeout(typechar, typingSpeed)
        }else{
          //这个句子打印完了，移到下一行
          sentenceIndex++
          setTimeout(typeNextSentence, sentenceDelay);
        }
      }
      typechar()
    }
    typeNextSentence()
  })
}

//发送消息
const sendMessage=async()=>{
    const messageText=userInput.value.trim()
    if(!messageText||loading.value) return

    //重置取消状态
    resetCancelState()

    //添加用户信息
    messages.value.push({
        role:'user',
        content:messageText,
        timestamp:new Date()
    })

    //清空输入框
    userInput.value=''

    //!!!先显示完全部思考阶段，再进行API请求
    //重置思考状态
    thinkingStage.value=0
    //设置加载状态
    loading.value=true

    console.log('开始显示思考阶段',thinkingStages[thinkingStage.value]);

    try{
      //依次显示所有思考阶段，每个阶段3s
        for(let i=0;i<thinkingStages.length;i++){
          console.log(`显示思考阶段${i}:${thinkingStages[i]}`);
          thinkingStage.value=i

          //等待思考阶段显示
          await new Promise((resolve)=>{
            const timer=setTimeout(resolve,3000)
            //如果请求取消，提前结束等待
            const cancelCheck=setInterval(()=>{
              if(cancelRequested.value){
                clearTimeout(timer)
                clearInterval(cancelCheck)
                resolve()
              }
            },100)
          })

          //如果取消，直接中断流程
          if(cancelRequested.value){
            break
          }
        }

      if(!cancelRequested.value){
        //所有思考阶段显示完毕，发送请求到后端
        const response=await fetch(`${baseUrl}/api/assistant`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                message: messageText,
                modelOptions: {
                  useLargeModel: modelOptions.value.largeModel,
                  useSmallModel: modelOptions.value.smallModel,
                  category: modelOptions.value.category,
                  subOption: modelOptions.value.category === 'baseStation' 
                    ? modelOptions.value.baseStationSubOption 
                    : modelOptions.value.userSubOption
                }
            })
        })

        if(!response.ok){
            throw new Error('请求失败')
        }

        const data=await response.json()

        //助理回复
        messages.value.push({
            role:'assistant',
            content:'',
            thinking:data.thinking||'',
            //刚开始不设置图片和reply，等思考过程完成后再显示
            images:[],
            reply:'',
            timestamp:new Date()
        })

        const assistantMessageIndex=messages.value.length-1

        //如果有思考过程，默认折叠显示
        if(data.thinking){
          thinkingExpanded.value[assistantMessageIndex]=true
          await typewritterEffect(data.thinking,assistantMessageIndex,'thinking')
        }

        //思考过程显示完毕再添加图片
        if(!cancelRequested.value&&data.images&&data.images.length>0){
          //先添加图片，然后开始文本的回复
          messages.value[assistantMessageIndex].images=data.images
          //添加小延迟
          await new Promise(resolve=>setTimeout(resolve,100))
        }

        //回复过程也逐字显示
        if(!cancelRequested.value){
          typeActive.value=true
          await typewritterEffect(data.reply||'抱歉，我无法回答问题',assistantMessageIndex,'content')
          typeActive.value=false
        }
      }
    }catch(error){
        console.error('请求出错',error);
        ElMessage.error('获取回复失败，请稍后重试')
        
        //添加错误消息
        messages.value.push({
            role:'assistant',
            content:'抱歉，我遇到了一些技术问题，请稍后再试',
            timestamp:new Date()
        })
    }finally{
        loading.value=false
        typeActive.value=false
        resetCancelState()
    }
}

//格式化时间
const formatTime=(timestamp)=>{
    const date=new Date(timestamp)
    return `${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`
}

//格式化消息内容
const formatMessage = (content) => {
    //跳过空内容
    if(!content) return ''

    //1、移除调试信息
    let cleanContent = content
        .replace(/模型回答:[\s\S]*?(?=\n\n\$)/g,'')
        .trim();
    
    //2、处理代码块
    cleanContent = cleanContent.replace(/```([\w]*)\n([\s\S]*?)```/g, (match, language, code) => {
      const highlightedCode = language ? 
        hljs.highlight(code, {language: language}).value : 
        code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
      return `<pre class="code-block${language ? ' language-'+language : ''}"><code>${highlightedCode}</code></pre>`;
    });
    
    //3、处理图表语法 (Mermaid)
    cleanContent = cleanContent.replace(/```mermaid\n([\s\S]*?)```/g, (match, diagram) => {
        return `<div class="mermaid-diagram" data-diagram="${diagram.replace(/"/g, '&quot;')}">
            <pre class="mermaid-code">${diagram.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        </div>`;
    });
    
    //4、处理表格
    cleanContent = cleanContent.replace(/\|\s*(.*?)\s*\|[\s]*(?:\n|\r\n?)\|\s*[-:\s|]*\|[\s]*(?:\n|\r\n?)((.*\|[\s]*(?:\n|\r\n?))*)/g, 
  (match) => parseMarkdownTable(match));

    //5、处理分隔符
    cleanContent = cleanContent
        // 处理---###
        .replace(/---#{1,6}/g,'<hr>')
        .replace(/----/g, '<hr class="heavy-divider">')
        //删除可能的转义字符
        .replace(/\\([^\w])/g,'$1')

    //6、处理md格式
    cleanContent = cleanContent
        //标题
        .replace(/#{6}\s+([^\n]+)/g,'<h6>$1</h6>')
        .replace(/#{5}\s+([^\n]+)/g,'<h5>$1</h5>')
        .replace(/#{4}\s+([^\n]+)/g,'<h4>$1</h4>')
        .replace(/#{3}\s+([^\n]+)/g,'<h3>$1</h3>')
        .replace(/#{2}\s+([^\n]+)/g,'<h2>$1</h2>')
        .replace(/#{1}\s+([^\n]+)/g,'<h1>$1</h1>')

        // 强调和加粗
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        
        // 行内代码
        .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')

        // 中文方括号
        .replace(/【([^】]+)】/g, '<strong>【$1】</strong>');

    // 列表处理
    cleanContent = cleanContent
        // 先处理列表项
        .replace(/^\s*-\s+([^\n]+)/gm, '<li class="unordered">$1</li>')
        .replace(/^\s*\d+\.\s+([^\n]+)/gm, '<li class="ordered">$1</li>')
        
        // 然后将连续的列表项分组
        .replace(/(<li class="unordered">.*?<\/li>)+/gs, '<ul>$&</ul>')
        .replace(/(<li class="ordered">.*?<\/li>)+/gs, '<ol>$&</ol>')
        
        // 清理类名
        .replace(/class="unordered"/g, '')
        .replace(/class="ordered"/g, '');
    
    //7、处理链接
    cleanContent = cleanContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    //8、普通换行
    // cleanContent = cleanContent.replace(/\n/g,'<br>');

    // 返回格式化后的内容
    return `<div class="formatted-message">${cleanContent}</div>`
}

// 使用专门的表格解析函数
function parseMarkdownTable(tableText) {
  const lines = tableText.trim().split(/\n/);
  const headerLine = lines[0];
  const separatorLine = lines[1];
  const bodyLines = lines.slice(2);
  
  // 解析表头
  const headers = headerLine.split('|')
    .map(cell => cell.trim())
    .filter(cell => cell);
    
  // 判断对齐方式
  const alignments = separatorLine.split('|')
    .map(cell => cell.trim())
    .filter(cell => cell)
    .map(cell => {
      if (cell.startsWith(':') && cell.endsWith(':')) return 'center';
      if (cell.endsWith(':')) return 'right';
      return 'left';
    });
    
  // 处理表格体
  const rows = bodyLines.map(line => {
    return line.split('|')
      .map(cell => cell.trim())
      .filter(cell => cell);
  });
  
  // 生成HTML
  let html = '<table class="md-table"><thead><tr>';
  
  // 添加表头
  headers.forEach((header, i) => {
    const align = alignments[i] || 'left';
    html += `<th style="text-align: ${align}">${header}</th>`;
  });
  
  html += '</tr></thead><tbody>';
  
  // 添加表格内容
  rows.forEach(row => {
    html += '<tr>';
    row.forEach((cell, i) => {
      const align = alignments[i] || 'left';
      html += `<td style="text-align: ${align}">${cell}</td>`;
    });
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  return html;
}


</script>

<style scoped>
.assistant-container {
  max-width: 800px;
  margin: 20px auto;
}

/* 模型选择区域的样式 */
.model-selection-container {
  margin-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 12px;
}

.model-selection-row {
  display: flex;
  align-items: center;
  height: 36px;
}

.model-icon {
  font-size: 18px;
  margin-right: 8px;
}

.model-label {
  font-weight: 500;
  margin-right: 10px;
  white-space: nowrap;
  color: #606266;
}

.model-selector {
  width: 400px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  min-width: 260px;
  background-color: #fff;
  flex: 1;
  transition: box-shadow 0.2s ease;
}

.model-selector:hover {
  border-color: #c0c4cc;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.selected-models {
  font-size: 14px;
  color: #303133;
}

/* 弹出面板样式 */
.model-options-panel {
  padding: 8px;
}

.model-panel-title {
  font-size: 16px;
  margin: 0 0 16px 0;
  color: #303133;
  font-weight: 500;
}

.model-option-item {
  width: 100%;
  margin-bottom: 10px;
}

.model-option-content {
  display: flex;
  flex-direction: column;
  padding: 4px 0;
}

.model-name {
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 4px;
}

.model-description {
  font-size: 12px;
  color: #909399;
}

.el-checkbox.is-bordered{
  height: 36px;
}

.small-model-detail {
  margin-top: 5px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  animation: fadeIn 0.3s ease;
}

.small-model-category {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.category-label {
  margin-right: 10px;
  font-size: 14px;
  color: #606266;
}

.sub-model-options {
  margin-top: 10px;
  width: 100%;
}

.sub-model-options .el-select {
  width: 100%;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.chat-container{
    height: 400px;
    overflow-y: auto;
    margin-bottom: 16px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    background-color: #f9f9f9;
    padding: 10px;
}
.empty-chat{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.messages-container{
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.message{
    max-width: 80%;
    padding: 10px;
    border-radius: 8px;
}

.user-message{
    align-self: flex-end;
    background-color: #ecf5ff;
    border: 1px solid #d9ecff;
}

.assistant-message{
    align-self: flex-start;
    background-color: #f0f9eb;
    border: 1px solid #e1f3d8;
}

.message-content{
    display: flex;
    flex-direction: column;
}

.message-header{
    margin-bottom: 4px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #909399;
}

.role-indicator{
    font-weight: bold;
}

.message-text{
    word-break:break-word;
    width: auto;
    display: inline-block;
}

.input-container{
    display: flex;
    flex-direction: column;
}

.button-container{
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}

.loading-container{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    color: #409eff;
    gap: 8px;
}

.loading-status {
    display: flex;
    align-items: center;
    color: #409eff;
    gap: 8px;
}

/* 思考过程的样式 */
.thinking-process {
  margin: 5px 0 10px 0;
  border-radius: 4px;
  overflow: hidden;
}

.thinking-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #e6f1fc;
  border: 1px solid #caddf1;
  cursor: pointer;
  border-radius: 4px;
  gap: 8px;
  font-size: 13px;
  color: #409eff;
}

.thinking-content {
  background-color: #f8f9fb;
  border: 1px solid #ebeef5;
  border-top: none;
  padding: 10px;
  font-size: 13px;
  color: #606266;
  border-radius: 0 0 4px 4px;
}

/* 图像显示的样式 */
.message-images {
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.image-container {
  max-width: 100%;
}

.el-image {
  max-width: 100%;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-caption {
  margin-top: 6px;
  font-size: 13px;
  color: #606266;
  text-align: center;
}

/* 格式化的样式 */
.formatted-message {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
}

.formatted-message h1, .formatted-message h2, .formatted-message h3,
.formatted-message h4, .formatted-message h5, .formatted-message h6 {
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-weight: 600;
  line-height: 1.25;
}

.formatted-message h1 { font-size: 1.5em; }
.formatted-message h2 { font-size: 1.3em; }
.formatted-message h3 { font-size: 1.2em; }
.formatted-message h4 { font-size: 1.1em; }
.formatted-message h5, .formatted-message h6 { font-size: 1em; }

.formatted-message ul {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.formatted-message hr {
  border: 0;
  border-top: 1px solid #ebeef5;
  margin: 1em 0;
}

/* 添加到现有的格式化样式部分 */
.formatted-message pre.code-block {
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 0.75em;
  margin: 0.75em 0;
  overflow-x: auto;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.9em;
  white-space: pre;
}
.formatted-message code.inline-code {
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 3px;
  padding: 0.1em 0.4em;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.9em;
}

.formatted-message .mermaid-diagram {
  background-color: #f9f9f9;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 1em;
  margin: 1em 0;
}

.formatted-message hr.heavy-divider {
  border-top: 2px solid #409eff;
  margin: 1.5em 0;
}

.formatted-message a {
  color: #409eff;
  text-decoration: none;
}

.formatted-message a:hover {
  text-decoration: underline;
}
</style>
<style>
.formatted-message table.md-table {
  border-collapse: collapse;
  margin: 0.75em 0;
  width: 100%;
  border: 1px solid #dcdfe6;
}

.formatted-message table.md-table th,
.formatted-message table.md-table td {
  border: 1px solid #dcdfe6;
  padding: 0.5em 0.75em;
  text-align: left;
}

.formatted-message table.md-table th {
  background-color: #f5f7fa;
  font-weight: 600;
}
</style>