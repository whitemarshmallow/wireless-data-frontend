import { defineStore } from "pinia";
import mitt from "mitt";
import { getApiUrl } from "../utils/api";

// 如需修改，只需取消注释下面这一行并提供新的 URL
const baseUrl = null; // 使用 null 表示使用全局配置
// const baseUrl = 'http://....com'  // 取消注释并修改此行以自定义 API URL

//事件发射器
export const emitter = mitt();

export const useNetworkDataProcessStore = defineStore("networkDataProcess", {
  state: () => ({
    // 流程状态
    processingStage: "initial", // 'initial', 'data-selection', 'download', 'scenario', 'image', 'analysis'

    // 数据源相关
    selectedDataSource: null, // 'viavi', 'network', 'institute', 'beam'
    downloadParams: {},
    downloadCompleted: false,

    // 场景选择相关
    selectedCategory: null, // 'baseStation', 'user'
    selectedSubOption: null,

    // 图像相关
    selectedImageTypes: [],
    generatedImages: [],

    // 模型相关
    modelConfig: {
      useLargeModel: true,
      smallModelType: "random_forest", // 默认选择随机森林
    },

    // 聊天历史
    messages: [],
  }),

  actions: {
    // 添加助手消息
    addAssistantMessage(content, extras = {}) {
      this.messages.push({
        role: "assistant",
        content: content,
        timestamp: new Date(),
        componentType: extras.componentType || null,
        componentProps: extras.componentProps || {},
        thinking: extras.thinking || "",
        images: extras.images || [],
      });
    },

    // 添加用户消息
    addUserMessage(content, selections = {}) {
      this.messages.push({
        role: "user",
        content: content,
        timestamp: new Date(),
        selections: selections,
      });
    },

    // 更新消息内容
    updateMessageContent(index, content, field = "content") {
      if (index >= 0 && index < this.messages.length) {
        this.messages[index][field] = content;
      }
    },

    // 更新消息图像
    updateMessageImages(index, images) {
      if (index >= 0 && index < this.messages.length) {
        this.messages[index].images = images;
      }
    },

    // 更新流程阶段
    setProcessingStage(stage) {
      this.processingStage = stage;

      // 根据阶段自动添加引导消息
      switch (stage) {
        case "data-selection":
          this.addAssistantMessage(
            "您好！我是网络数据助理，可以帮助您处理网络数据并进行分析。请告诉我您想处理哪种类型的数据？",
            { componentType: "data-source-selector" }
          );
          break;
        case "download":
          this.addAssistantMessage(
            `好的，请设置${this.getDataSourceLabel()}的下载参数：`,
            {
              componentType: "data-download",
              componentProps: { sourceType: this.selectedDataSource },
            }
          );
          break;
        case "scenario":
          this.addAssistantMessage(
            "数据下载成功！现在我们可以从基站和用户两侧进行分析，您想关注哪个方面？",
            { componentType: "scenario-selector" }
          );
          break;
        case "image":
          this.addAssistantMessage(
            `对于${this.getScenarioLabel()}分析，我们有以下几种图像可以生成：`,
            {
              componentType: "image-selector",
              componentProps: {
                category: this.selectedCategory,
                subOption: this.selectedSubOption,
              },
            }
          );
          break;
        case "analysis":
          this.addAssistantMessage(
            "图像已生成。您希望我如何帮助分析这些数据？是否需要使用大模型提供建议？",
            { componentType: "model-selector" }
          );
          break;
      }
    },

    // 设置数据源
    setDataSource(source) {
      this.selectedDataSource = source;
      this.addUserMessage(`我选择了${this.getDataSourceLabel()}`);
      this.setProcessingStage("download");
    },

    // 完成下载
    completeDownload(params) {
      this.downloadParams = params;
      this.downloadCompleted = true;
      this.addUserMessage("数据下载完成", { downloadParams: params });
      this.setProcessingStage("scenario");
    },

    // 选择场景
    selectScenario(category, subOption) {
      this.selectedCategory = category;
      this.selectedSubOption = subOption;
      this.addUserMessage(`我想关注${this.getScenarioLabel()}`);
      this.setProcessingStage("image");
    },

    // 选择图像类型
    selectImageTypes(types) {
      this.selectedImageTypes = types;
      this.addUserMessage(`我想查看${types.join("、")}`);
      // 调用图像生成
      this.generateImages();
    },

    // 生成图像
    async generateImages() {
      try {
        // 添加临时消息表示正在加载
        const loadingMessageIndex = this.messages.length;
        this.addAssistantMessage("正在生成图像，请稍候...");

        // 准备API请求参数
        const requestParams = {
          imageTypes: this.selectedImageTypes,
          category: this.selectedCategory,
          subOption: this.selectedSubOption,
          dataSource: this.selectedDataSource,
          downloadParams: this.downloadParams,
        };

        console.log("请求参数准备完成：", requestParams);

        // 调用图像生成API
        const response = await fetch(
          getApiUrl("/api/assistant/image", baseUrl),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestParams),
          }
        );

        console.log("收到返回参数：", response);

        if (!response.ok) {
          throw new Error(`图像生成失败: ${response.statusText}`);
        }

        // 解析API响应
        const data = await response.json();

        // 存储返回的图像数据
        this.generatedImages = data.images || [];

        // 删除加载消息
        if (this.messages.length > loadingMessageIndex) {
          this.messages.splice(loadingMessageIndex, 1);
        }

        // 添加带图像的消息
        this.addAssistantMessage("图像已生成", {
          images: this.generatedImages,
        });

        // 进入分析阶段
        this.setProcessingStage("analysis");
      } catch (error) {
        console.error("图像生成失败:", error);

        // 通知用户
        this.addAssistantMessage(`抱歉，图像生成失败: ${error.message}`);
      }
    },

    // 设置模型配置
    async setModelConfig(config) {
      this.modelConfig = { ...this.modelConfig, ...config };

      // 添加用户消息
      let userMessage = "";
      if (config.useLargeModel) {
        userMessage = `请使用大模型进行分析，并使用${this.getSmallModelLabel(
          config.smallModelType
        )}小模型`;
      } else {
        userMessage = `请使用${this.getSmallModelLabel(
          config.smallModelType
        )}小模型进行分析`;
      }

      this.addUserMessage(userMessage);

      try {
        console.log("发起模型分析请求:", {
          message: userMessage,
          context: this.getContextData(),
          modelOptions: this.modelConfig,
        });

        // 实际调用API进行分析
        const response = await fetch(getApiUrl("/api/assistant", baseUrl), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage, // 用户消息
            context: this.getContextData(),
            modelOptions: this.modelConfig,
          }),
        });

        if (!response.ok) {
          throw new Error(`请求失败: ${response.status}`);
        }

        const data = await response.json();
        console.log("模型分析响应:", data);

        //发射事件，让组件去处理ui效果（打字机效果等等
        emitter.emit("modelAnalysisResponse", data);
      } catch (error) {
        console.error("模型分析请求失败:", error);

        //添加错误消息
        this.addAssistantMessage(`分析失败: ${error.message}`);
        //发射错误事件
        emitter.emit("modelAnalysisError", error.message);
      }
    },

    // 获取上下文数据（用于API请求）
    getContextData() {
      return {
        dataSource: this.selectedDataSource,
        downloadParams: this.downloadParams,
        category: this.selectedCategory,
        subOption: this.selectedSubOption,
        imageTypes: this.selectedImageTypes,
        generatedImages: this.generatedImages,
      };
    },

    // 辅助方法：获取数据源标签
    getDataSourceLabel() {
      const labels = {
        viavi: "viavi仿真数据",
        network: "现网数据",
        institute: "信通院仿真数据",
        beam: "波束数据",
      };
      return labels[this.selectedDataSource] || this.selectedDataSource;
    },

    // 辅助方法：获取场景标签
    getScenarioLabel() {
      if (!this.selectedCategory || !this.selectedSubOption) return "";

      const options = {
        baseStation: {
          1: "容量与负载管理",
          2: "能耗与能效分析",
          3: "邻区关系和切换优化",
          4: "基站MIMO",
          5: "RRC连接分析",
          6: "PCI/天线方向",
          7: "综合KPI",
        },
        user: {
          1: "覆盖与性能评估",
          2: "网络容量与吞吐分析",
          3: "QoS与切片管理",
          4: "异常检测与网络故障排查",
          5: "基于位置的业务体验分析",
          6: "Massive MIMO与波束管理评估",
          7: "TA与距离管理",
        },
      };

      const category =
        this.selectedCategory === "baseStation" ? "基站" : "用户";
      return `${category}的${
        options[this.selectedCategory][this.selectedSubOption]
      }`;
    },

    // 辅助方法：获取小模型标签
    getSmallModelLabel(type) {
      const labels = {
        random_forest: "随机森林",
        lstm: "LSTM神经网络",
        cnn: "CNN卷积神经网络",
        kmeans: "K-means聚类",
        linear_regression: "线性回归",
      };

      return labels[type] || type;
    },

    // 开始新的处理流程
    startNewProcess() {
      // 重置所有状态
      this.processingStage = "initial";
      this.selectedDataSource = null;
      this.downloadParams = {};
      this.downloadCompleted = false;
      this.selectedCategory = null;
      this.selectedSubOption = null;
      this.selectedImageTypes = [];
      this.generatedImages = [];
      this.messages = [];
      this.modelConfig = {
        useLargeModel: true,
        smallModelType: "random_forest",
      };

      // 添加初始消息
      //   this.addAssistantMessage(
      //     "您好！我是网络数据助理，可以帮助您处理网络数据并进行分析。请告诉我您想处理哪种类型的数据。"
      //   );

      // 开始数据选择阶段
      this.setProcessingStage("data-selection");
    },
  },
});
