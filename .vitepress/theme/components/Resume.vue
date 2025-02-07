<script setup lang="ts">
import SubProject from './resume-block/SubProject.vue'
import MainProject from './resume-block/MainProject.vue'
</script>

<template>
  <div class="my-main vp-doc">
    <div class="mt-8 flex flex-col gap-1">
      <div class="flex items-baseline gap-2 mb-4">
        <div class="text-8 font-bold">
          崔兆威
        </div>
        <div class="text-sm text-neutral-500 dark:text-neutral-400">
          中山大学通信工程 2011 级
        </div>
      </div>
      <div class="font-mono">
        手机：13660321734
      </div>
      <div class="font-mono">
        邮箱：<a href="mailto:cuizhaowei92@gmail.com">cuizhaowei92@gmail.com</a>
      </div>
    </div>
    <h2>
      Skill
    </h2>
    <ul>
      <li>
        熟练掌握 HTML/CSS/JavaScript，熟悉 TypeScript
      </li>
      <li>
        熟悉 Vue.js 框架（3.x 与 2.x），了解其背后实现原理
      </li>
      <li>
        熟悉 npm, pnpm, vite,  unplugin 等构建工具的配置使用，并了解其原理
      </li>
      <li>
        熟练使用 Web 开发中常用的工具与工作流，如 whistle, Postman, Chrome devtools
      </li>
      <li>
        熟悉图形可视化相关库，如 ECharts, D3.js 等
      </li>
      <li>
        熟悉 Web 开发相关技术，如 HTTP 协议、常用 Linux 命令、nginx 配置等
      </li>
    </ul>
    <h2>
      Projects
    </h2>
    <MainProject
      title="数据探索 Data Exploration"
      :tags="['Vue 3', 'D3', 'Naive UI', '高性能 Excel-like 表格']"
      link="https://exp.datastory.com.cn"
    >
      <template #description>
        <div>
          通过大模型对数据的某些列进行 Embedding, 然后降维至二维平面，可以从中寻找数据之间的归类情况。项目使用的 D3 与 WebGL 渲染数据量级百万级以上的散点，支持用户拖拽、放大缩小等交互。并实现了一个类似 Excel 的线上看数的在线表格。
        </div>
      </template>
      <ul>
        <li>
          D3, WebGL 实现百万级平面散点的渲染与交互
        </li>
        <li>
          支持千万级数据的在线表格（垂直、水平虚拟滚动）
        </li>
      </ul>
    </MainProject>
    <MainProject
      title="小智 Insight"
      :tags="['AI', 'RAG', 'UnoCSS', '多端适配', 'Streaming Response']"
      link="https://sdx.datastory.com.cn"
    >
      <template #description>
        <div>
          基于 RAG 的对话式产品，可基于企业内部数据、互联网全量数据、联网查询（百度搜索）对问题进行总结回答
        </div>
      </template>
      <SubProject title="人工标注工具">
        <div>
          针对企业内部 PDF 文档进行人工标注，构建向量数据库，可视化框选对应的数据类型（标题、文本、表格、图表等）进行 OCR
        </div>
      </SubProject>
    </MainProject>
    <MainProject
      title="Enlightening AI"
      :tags="['Vue 3', 'Naive UI', 'AI', '复杂状态管理']"
      link="https://enlighteningai.datastory.com.cn"
      :images="[
        'https://static.ryancui.com/images/20250207175426_iBo84k_CleanShot%202025-02-07%20at%2017.49.17@2x.jpeg',
      ]"
    >
      <template #description>
        <div>
          一个可以创建 AI Embedding，AI Skill 并对多种 Prompt、多种模型，效果进行对比、调试；可以创建回归 Test Suite 的平台。最终 Skill 可以开放成可访问的 API 供业务侧调用。
        </div>
      </template>
      <ul>
        <li>
          类似 Dify/Vellum 等 AI 一站式开发平台
        </li>
      </ul>
    </MainProject>
    <MainProject
      title="数说方舟"
      :tags="['Vue 3', 'ECharts', 'Node.js', 'Chrome Extension', 'CLI Tool']"
      link="https://xdp.datastory.com.cn"
    >
      <template #description>
        <div>
          整合了数据源、分析、应用模块的可视化建站系统。实现了对接实际数据源、筛选分析与 API 制作、应用页面图表制作三部分主要的功能。在 No Code 上有一套自定义研发的配件与生态支持，包括脚本、组件、浏览器插件、CLI 工具等。
        </div>
      </template>
      <ul>
        <li>
          参与系统基础架构的制定与技术方案评审，如组件系统、画布渲染、交互功能、自定义组件等
        </li>
        <li>
          外部 async-component 方案解耦平台与组件
        </li>
        <li>
          画布渲染采用同一套 DIV DOM 完成编辑、预览态
        </li>
      </ul>
      <SubProject title="dsv-cli 脚手架">
        <div>
          用于初始化方舟自定义组件，运行组件本地开发环境，管理组件、打包上传等操作。
        </div>
        <ul>
          <li>
            通过 commanderjs 做成一个交互的 cli 工具
          </li>
          <li>
            本地 webpack, dev-server 运行组件开发服务；bundle 将所有引用资源打包成一个 js 文件，供平台 async-component 使用
          </li>
          <li>
            Koa 代理线上环境地址，iframe + mock middleware 做本地开发环境
          </li>
        </ul>
      </SubProject>
      <SubProject title="Chrome 插件">
        <div>
          用于初始化方舟自定义组件，运行组件本地开发环境，管理组件、打包上传等操作。
        </div>
        <ul>
          <li>
            iframe message 与主应用通信，使用 DOM vue 实例属性进行拦截
          </li>
          <li>
            覆盖 XHR 方法实现 ajax 请求拦截，Request/Response 修改，进行 script mocking
          </li>
          <li>
            实现类似「审查元素」功能，能在页面上审查低代码平台的组件
          </li>
        </ul>
      </SubProject>
    </MainProject>
    <h2>
      Working Experience
    </h2>
    <div class="py-2">
      <div class="flex items-baseline justify-between">
        <div class="font-bold text-lg">
          广州数说故事科技有限公司
        </div>
        <div class="font-mono text-neutral-500 dark:text-neutral-400">
          2018/09 至今
        </div>
      </div>
      <div class="my-2">
        高级前端开发工程师
      </div>
      <div class="my-2 text-neutral-500 dark:text-neutral-400">
        主要负责数说方舟低代码平台、生态建设，基础设施需求负责人。负责 Code Review, 带新人，技术方案制定等工作。
      </div>
      <ul>
        <li>
          数说方舟低代码平台技术方案制定（组件 Schema, 渲染策略, 自定义组件, 联动交互等）
        </li>
        <li>
          自定义研发生态建设（Chrome 插件/cli 工具/开发文档维护）
        </li>
        <li>
          组员任务分配，指导新人入门
        </li>
      </ul>
    </div>
    <div class="py-2">
      <div class="flex items-baseline justify-between">
        <div class="font-bold text-lg">
          广州科腾信息技术有限公司
        </div>
        <div class="font-mono text-neutral-500 dark:text-neutral-400">
          2017/05 - 2018/09
        </div>
      </div>
      <div class="my-2">
        前端开发工程师
      </div>
      <div class="my-2 text-neutral-500 dark:text-neutral-400">
        主要负责 Web 前端 MIS 系统 CodeBase 与小程序 CodeBase 开发，向各项目提供技术支持、Code Review；参与具体项目的 Web 端、移动端、小程序开发；搭建 Gitlab + GitlabCI + Docker 版本控制与持续集成环境。
      </div>
    </div>
    <div class="py-2">
      <div class="flex items-baseline justify-between">
        <div class="font-bold text-lg">
          中山大学网络与信息技术中心
        </div>
        <div class="font-mono text-neutral-500 dark:text-neutral-400">
          2015/07 - 2017/04
        </div>
      </div>
      <div class="my-2">
        研发工程师
      </div>
      <div class="my-2 text-neutral-500 dark:text-neutral-400">
        负责中山大学校务信息系统的设计、开发工作，完成了两个重要系统的开发并成功上线
      </div>
    </div>
  </div>
</template>
