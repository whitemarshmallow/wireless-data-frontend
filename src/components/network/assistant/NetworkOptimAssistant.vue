<template>
  <div class="assistant-container">
    <el-card>
      <!-- <template #header>
        <div class="card-header">
          <span>网络数据处理助手</span>
        </div>
      </template> -->

      <!-- 对话内容显示区域 -->
      <div class="chat-container" ref="chatContainerRef">
        <div v-if="store.messages.length===0" class="empty-chat">
          <el-empty description="暂无对话，开始提问吧"></el-empty>
        </div>
        <div v-else class="messages-container">
          <div v-for="(message,index) in store.messages"
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
              
              <!-- 组件渲染区域 -->
              <div v-if="message.componentType" class="component-container">
                <component 
                  :is="getComponentByType(message.componentType)" 
                  v-bind="message.componentProps || {}"
                  @download-completed="handleDownloadCompleted"
                />
              </div>
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
      
      <!-- 输入区域 -->
      <div class="input-container">
        <el-input
          v-model="userInput" 
          type="textarea" 
          :rows="3"
          placeholder="您可以直接输入问题，或者跟随助手的引导进行操作"
          :disabled="loading"
          @keydown="handleKeyDown" />
        <div class="button-container">
          <el-button 
            type="primary" 
            @click="sendMessage"
            :disabled="loading||!userInput.trim()">
            发送
          </el-button>
          <el-button @click="resetProcess">
            重新开始
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted,onBeforeUnmount, ref, watch } from 'vue';
import { ArrowUp, ArrowDown, DocumentCopy, Loading } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import hljs from 'highlight.js';
import DataSourceSelector from '../selectors/DataSourceSelector.vue';
import DataDownloadWrapper from '../../data/download/DataDownloadWrapper.vue';
import ScenarioSelector from '../selectors/ScenarioSelector.vue';
import ImageSelector from '../selectors/ImageSelector.vue';
import ModelSelector from '../selectors/ModelSelector.vue';
import { useNetworkDataProcessStore,emitter } from '../../../store/networkDataProcessStore';
import { getApiUrl } from '../../../utils/api';

// 如需自定义基础 URL，取消注释下面这一行并修改
const baseUrl = null  // 使用全局配置
// const baseUrl = 'http://....'  // 自定义 URL

// 获取store
const store = useNetworkDataProcessStore();

// 响应式数据
const userInput = ref('');
const chatContainerRef = ref(null);
const loading = ref(false);
// 思考过程的响应式数据
const typeActive = ref(false);
const thinkingExpanded = ref({});
const thinkingStage = ref(0);
const thinkingStages = [
  '正在加载历史对话...',
  '正在加载网络数据处理知识库...',
  '正在调用数据分析模型...',
  '正在进行思考...',
];

// 取消生成
const cancelRequested = ref(false);
const cancelActivited = ref(false);

// 根据组件类型获取组件
const getComponentByType = (type) => {
  const componentMap = {
    'data-source-selector': DataSourceSelector,
    'data-download': DataDownloadWrapper,
    'scenario-selector': ScenarioSelector,
    'image-selector': ImageSelector,
    'model-selector': ModelSelector
  };
  return componentMap[type] || null;
};

// 监听消息变化，自动滚到底部
watch(() => store.messages, () => {
  nextTick(() => {
    if (chatContainerRef.value) {
      chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
    }
  });
}, { deep: true });

// 切换思考过程展开or折叠状态
const toggleThinking = (index) => {
  thinkingExpanded.value[index] = !thinkingExpanded.value[index];
};

// 当前思考状态
const currentThinkingText = computed(() => {
  return typeActive.value ? '正在回复中...' : thinkingStages[thinkingStage.value];
});

// 处理回车事件
const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

// 请求取消生成
const requestCancel = () => {
  cancelActivited.value = true;

  // 点击后两秒才会取消
  setTimeout(() => {
    cancelRequested.value = true;
    ElMessage.info('已停止生成');
  }, 1500);
};

// 重置取消状态
const resetCancelState = () => {
  cancelRequested.value = false;
  cancelActivited.value = false;
};

// 模仿逐字输出效果
const typewritterEffect = (text, index, field = 'content') => {

  // 检查传入的文本
  if (!text || typeof text !== 'string') {
    console.error('无效的文本内容:', text);
    store.updateMessageContent(index, '处理内容时出错', field);
    return Promise.resolve();
  }
  
  console.log(`开始文本效果: ${field}, 长度:`, text.length);

  return new Promise((resolve) => {
    // 将文本分割成句子
    const sentences = text.split(/(?<=[.!?。！？]\s*)/g).filter(s => s.trim() !== '');
    let sentenceIndex = 0;
    let currentDisplayText = '';

    const typeNextSentence = () => {
      // 如果请求取消了，就提前结束并标记未完成状态
      if (cancelRequested.value) {
        // 添加标记：生成被中断了
        if (currentDisplayText) {
          store.updateMessageContent(index, currentDisplayText + '生成已停止', field);
        }
        resolve();
        return;
      }

      // 如果处理完了所有句子，就完成打字
      if (sentenceIndex >= sentences.length) {
        resolve();
        return;
      }

      const sentence = sentences[sentenceIndex];
      let charIndex = 0;

      // 开始对当前句子进行带效果
      const typeChar = () => {
        // 检查请求是否取消
        if (cancelRequested.value) {
          store.updateMessageContent(index, currentDisplayText + '生成已停止', field);
          resolve();
          return;
        }

        if (charIndex < sentence.length) {
          // 在当前已显示文本后添加一个字符
          currentDisplayText += sentence.charAt(charIndex);
          store.updateMessageContent(index, currentDisplayText, field);
          charIndex++;
          setTimeout(typeChar, 30); // typingSpeed
        } else {
          // 这个句子打印完了，移到下一行
          sentenceIndex++;
          setTimeout(typeNextSentence, 300); // sentenceDelay
        }
      };
      typeChar();
    };
    typeNextSentence();
  });
};

const handleDownloadCompleted = (params) => {
  store.completeDownload(params);
};

//公共消息处理
const processAssistantResponse=async(data,skipThinking=false)=>{
  //添加空消息
  store.addAssistantMessage('',{
    thinking:data.thinking||'',
    images:[],
    timestamp:new Date()
  })

  //获取最新消息的索引
  const messageIndex=store.messages.length-1

  console.log('处理消息响应，索引',messageIndex);
  console.log('消息数据',data);

  //应用思考过程
  if(data.thinking&&!skipThinking){
    thinkingExpanded.value[messageIndex]=true
    await typewritterEffect(data.thinking,messageIndex,'thinking')
  }

  //添加图像
  if(!cancelRequested.value&&data.images&&data.images.length>0){
    store.updateMessageImages(messageIndex,data.images)
    await nextTick()
  }

  // 构建完整回复内容
  let fullReply='';
  // 添加大模型回复（如果有）
  if(data.largemodel&&!cancelRequested.value){
    fullReply+='【大模型回复：】\n\n'+data.largemodel
    if(data.smallmodel){
      fullReply+='\n\n'
    }
  }
  // 添加小模型回复（如果有）
  if(data.smallmodel && !cancelRequested.value) {
    fullReply+='【小模型回复：】\n\n'+data.smallmodel
  }

  //应用打字机效果
  if(!requestCancel.value){
    typeActive.value=true
    await typewritterEffect(fullReply||'分析完成',messageIndex,'content')
    typeActive.value=false
  }
  
  return messageIndex

}

// 发送消息
const sendMessage = async () => {
  const messageText = userInput.value.trim();
  if (!messageText || loading.value) return;
  
  // 重置取消状态
  resetCancelState();

  // 添加用户消息到store
  store.addUserMessage(messageText);
  
  // 清空输入框
  userInput.value = '';
  
  // 检查当前处理阶段
  const currentStage = store.processingStage;
  
  // 如果是在进行引导式流程但用户自由输入了问题
  if (currentStage && currentStage !== 'analysis') {
    // 这里可以添加处理用户在引导过程中自由提问的逻辑
    // 或者添加一个提示，建议用户按照引导流程操作
    store.addAssistantMessage('为了更好地帮助您处理数据，建议按照引导流程进行操作。如果您想重新开始，请点击"重新开始"按钮。');
    return;
  }
  
  // 如果是在分析阶段或没有特定阶段，则调用模型API
  loading.value = true;

  
  try {
    // 依次显示所有思考阶段，每个阶段3s
    for (let i = 0; i < thinkingStages.length; i++) {
      thinkingStage.value = i;

      // 等待思考阶段显示
      await new Promise((resolve) => {
        const timer = setTimeout(resolve, 3000);
        // 如果请求取消，提前结束等待
        const cancelCheck = setInterval(() => {
          if (cancelRequested.value) {
            clearTimeout(timer);
            clearInterval(cancelCheck);
            resolve();
          }
        }, 100);
      });

      // 如果取消，直接中断流程
      if (cancelRequested.value) {
        break;
      }
    }

    if (!cancelRequested.value) {
      // 添加超时处理
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 30秒超时
      
      console.log('发送请求:', {
        message: messageText,
        context: store.getContextData(),
        modelOptions: store.modelConfig
      });

      // 所有思考阶段显示完毕，发送请求到后端
      const response = await fetch(getApiUrl('/api/assistant', baseUrl), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageText,
          context: store.getContextData(),
          modelOptions: store.modelConfig
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('请求失败');
      }

      const data = await response.json();
      // API请求后添加
      console.log('API响应:', data);

      //是用公共的处理函数 处理响应
      await processAssistantResponse(data)
    }
  } catch (error) {
    console.error('请求出错', error);
    ElMessage.error('获取回复失败，请稍后重试');
    
    // 添加错误消息
    store.addAssistantMessage('抱歉，我遇到了一些技术问题，请稍后再试');
  } finally {
    loading.value = false;
    typeActive.value = false;
    resetCancelState();
  }
};

//添加监听事件处理setModelConfig
const handleModelAnalysisResponse=async(responseData)=>{
  loading.value=true

  try{
    //运行思考阶段动画
    for(let i=0;i<thinkingStages.length&&!cancelRequested.value;i++){
      thinkingStage.value=i;
      await new Promise(r=>setTimeout(r,2000))
    }

    if(!cancelRequested.value){
      await processAssistantResponse(responseData)
    }

  }catch(error){
    console.error('处理模型分析响应出错',error);
    store.addAssistantMessage('抱歉，处理分析结果时出错了')
  }finally{
    loading.value=false
    resetCancelState()
  }
}

onMounted(() => {
  // 初始化网络数据处理流程
  store.startNewProcess();

  //监听模型分析和响应事件
  emitter.on('modelAnalysisResponse',handleModelAnalysisResponse)
});

//在组件销毁前移除事件监听
onBeforeUnmount(() => {
  emitter.off('modelAnalysisResponse',handleModelAnalysisResponse)
});


// 重置处理流程
const resetProcess = () => {
  store.startNewProcess();
};

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 格式化消息内容
const formatMessage = (content) => {
  // 跳过空内容
  if (!content) return '';

  // 1、移除调试信息
  let cleanContent = content
    .replace(/模型回答:[\s\S]*?(?=\n\n\$)/g, '')
    .trim();
  
  // 2、处理代码块
  cleanContent = cleanContent.replace(/```([\w]*)\n([\s\S]*?)```/g, (match, language, code) => {
    const highlightedCode = language ? 
      hljs.highlight(code, {language: language}).value : 
      code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    return `<pre class="code-block${language ? ' language-'+language : ''}"><code>${highlightedCode}</code></pre>`;
  });
  
  // 3、处理图表语法 (Mermaid)
  // cleanContent = cleanContent.replace(/```mermaid\n([\s\S]*?)```/g, (match, diagram) => {
  //   return `<div class="mermaid-diagram" data-diagram="${diagram.replace(/"/g, '&quot;')}">
  //       <pre class="mermaid-code">${diagram.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  //   </div>`;
  // });
  
  // 4、处理表格
  cleanContent = cleanContent.replace(/\|\s*(.*?)\s*\|[\s]*(?:\n|\r\n?)\|\s*[-:\s|]*\|[\s]*(?:\n|\r\n?)((.*\|[\s]*(?:\n|\r\n?))*)/g, 
    (match) => parseMarkdownTable(match));

  // 5、处理分隔符
  cleanContent = cleanContent
    // 处理---###
    .replace(/---#{1,6}/g, '<hr>')
    .replace(/----/g, '<hr class="heavy-divider">')
    // 删除可能的转义字符
    .replace(/\\([^\w])/g, '$1');

  // 6、处理md格式
  cleanContent = cleanContent
    // 标题
    .replace(/#{6}\s+([^\n]+)/g, '<h6>$1</h6>')
    .replace(/#{5}\s+([^\n]+)/g, '<h5>$1</h5>')
    .replace(/#{4}\s+([^\n]+)/g, '<h4>$1</h4>')
    .replace(/#{3}\s+([^\n]+)/g, '<h3>$1</h3>')
    .replace(/#{2}\s+([^\n]+)/g, '<h2>$1</h2>')
    .replace(/#{1}\s+([^\n]+)/g, '<h1>$1</h1>')

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
  
  // 7、处理链接
  cleanContent = cleanContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

  // 返回格式化后的内容
  return `<div class="formatted-message">${cleanContent}</div>`;
};

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
.el-card__body{
  height: 620px;
}
.assistant-container {
  max-width: 800px;
  margin: 20px auto;
}

.chat-container {
  height: 470px;
  overflow-y: auto;
  margin-bottom: 16px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #f9f9f9;
  padding: 10px;
}

.empty-chat {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  max-width: 80%;
  padding: 10px;
  border-radius: 8px;
}

.user-message {
  align-self: flex-end;
  background-color: #ecf5ff;
  border: 1px solid #d9ecff;
}

.assistant-message {
  align-self: flex-start;
  background-color: #f0f9eb;
  border: 1px solid #e1f3d8;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-header {
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.role-indicator {
  font-weight: bold;
}

.message-text {
  word-break: break-word;
  width: auto;
  display: inline-block;
}

.input-container {
  display: flex;
  flex-direction: column;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  gap: 10px;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
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

/* 组件容器样式 */
.component-container {
  margin: 10px 0;
  padding: 12px;
  background-color: #f9f9fb;
  border-radius: 4px;
  border: 1px dashed #dcdfe6;
  width: 570px;
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