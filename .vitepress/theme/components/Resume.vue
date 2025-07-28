<script setup lang="ts">
import SubProject from './resume-block/SubProject.vue'
import MainProject from './resume-block/MainProject.vue'
</script>

<template>
  <div class="my-main vp-doc">
    <div class="mt-8 flex flex-col gap-1">
      <div class="flex items-baseline gap-3 mb-4">
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
        熟练掌握 HTML/CSS/JavaScript，熟悉 <em fancy>TypeScript</em>
      </li>
      <li>
        熟悉 <em fancy>Vue3</em>/<em fancy>Vue2</em> 框架，了解实现原理；熟练使用常用 UI 框架，如 ElementPlus, Ant Design Vue, Naive UI 等
      </li>
      <li>
        了解 React/Angular 等其余 MVVM 框架
      </li>
      <li>
        熟悉 npm, pnpm, <em fancy>vite</em>, unplugin 等构建工具的配置使用，并了解其原理
      </li>
      <li>
        熟练使用 Web 开发中常用的工具与工作流，如 whistle, Postman, Chrome Devtools 等
      </li>
      <li>
        熟悉图形可视化相关库，如 ECharts, D3.js 等
      </li>
      <li>
        熟悉 Web 开发技术，如 HTTP 协议、常用 Linux 命令、<em fancy>Nginx 配置</em>、<em fancy>Node.js</em> 等
      </li>
    </ul>
    <h2>
      Products
    </h2>
    <MainProject
      title="数据探索 Data Exploration"
      :tags="['Vue 3', 'D3', 'Naive UI', '高性能 Excel-like 表格']"
      link="https://exp.datastory.com.cn"
      :images="[
        'https://ebefa3b.webp.li/20250728115040961.png',
        'https://ebefa3b.webp.li/20250728120031068.png',
      ]"
    >
      <template #description>
        通过大模型对数据的某些列进行 Embedding, 然后降维至二维平面，可以从中洞察数据之间的分组、归类情况，并对数据打上对应的标签。
      </template>
      <ul>
        <li><em fancy>百万级散点</em>的渲染，支持拖拽、缩放等交互（D3/WebGL）</li>
        <li>类似 Excel 的千万级数据的在线表格，支持排序、筛选、列移动、显示隐藏等（前端：基于 React Virtual Scroll 改写的 Vue 3 虚拟滚动；后端 DuckDB）</li>
      </ul>
    </MainProject>
    <MainProject
      title="小智 Insight"
      :tags="['Vue 3', 'ChatBot', 'AI', 'UnoCSS', '多端适配', 'SSE', 'RAG']"
      link="https://sdx.datastory.com.cn"
      :images="[
        'https://ebefa3b.webp.li/20250728152959530.png',
        'https://ebefa3b.webp.li/20250728160500513.png',
      ]"
    >
      <template #description>
        基于 RAG 的对话式产品，可基于企业内部数据、互联网全量数据、联网查询（百度搜索）对问题进行总结回答。
      </template>
      <ul>
        <li>仿 ChatGPT 的对话式产品，支持多轮对话、上下文记忆（<em fancy>UnoCSS 实现，无组件库</em>）</li>
        <li>对接 <em fancy>SSE</em> 返回结构化数据，可展示成表格、图表等（@microsoft/fetch-event-source）</li>
        <li>独立完成产品交互设计、UI 设计等工作</li>
      </ul>
      <SubProject title="人工标注工具" :tags="['Vue 3', 'NaiveUI']">
        针对企业内部 PDF 文档进行人工标注，构建向量数据库，可视化框选对应的数据类型（标题、文本、表格、图表等）进行 OCR. 为小智 Insight 提供数据支持。
        <ul>
          <li>DOM 画布框选操作，mousedown/mousemove/mouseup/scroll 事件处理</li>
        </ul>
      </SubProject>
    </MainProject>
    <MainProject
      title="Enlightening AI"
      :tags="['Vue 3', 'Naive UI', 'AI', '复杂页面状态管理']"
      link="https://enlighteningai.datastory.com.cn"
      :images="['https://ebefa3b.webp.li/20250728161507347.png']"
    >
      <template #description>
        一个可以创建 AI Embedding，AI Skill 并对多种 Prompt、多种模型，效果进行对比、调试；可以创建回归 Test Suite 的平台。最终 Skill 可以开放成可访问的 API 供业务侧调用。
      </template>
      <ul>
        <li>类似 Dify/Vellum 等 AI 一站式开发平台</li>
      </ul>
    </MainProject>
    <MainProject
      title="数说方舟"
      :tags="['Vue 3', 'ECharts', 'Node.js', 'Chrome Extension', 'CLI Tool']"
      link="https://xdp.datastory.com.cn"
      :images="[
        'https://ebefa3b.webp.li/20250728163746392.png',
        'https://ebefa3b.webp.li/20250728163909061.png',
        'https://ebefa3b.webp.li/20250728164510336.png',
      ]"
    >
      <template #description>
        整合了数据源、分析、应用模块的可视化建站系统。实现了对接实际数据源、筛选分析与 API 制作、应用页面图表制作三部分主要的功能。在低代码开发上有一套自定义研发的配件与生态支持，包括脚本、组件、浏览器插件、CLI 工具等。
      </template>
      <ul>
        <li>
          参与系统基础架构的制定与技术方案评审，如组件系统、画布渲染、交互功能、自定义组件等
        </li>
        <li>
          外部 async-component 方案解耦平台与组件
        </li>
        <li>
          画布渲染采用同一套 div DOM 完成编辑、预览态
        </li>
      </ul>
      <SubProject title="dsv-cli 脚手架" :tags="['Node.js', 'webpack']">
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
      <SubProject title="XDP Devtools" :tags="['Chrome 插件', 'XHR 劫持', 'Vue 3']">
        <div>
          方便在浏览器（正式环境）上排查低代码页面的页面逻辑、内部变量等，类似 Vue Devtools
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
      Jobs
    </h2>
    <div class="py-2 avoid-page-break">
      <div class="flex items-baseline justify-between">
        <div class="font-bold text-lg">
          广州数说故事科技有限公司
        </div>
        <div class="font-mono text-sm text-neutral-500 dark:text-neutral-400">
          2018/09 至今
        </div>
      </div>
      <div class="my-2">
        高级前端开发工程师，平台商业中心
      </div>
      <ul class="my-2 text-neutral-500 dark:text-neutral-400">
        <li>平台产品前端技术侧负责人，制定技术方案，代码审核, 带新人等</li>
      </ul>
    </div>
    <div class="py-2 avoid-page-break">
      <div class="flex items-baseline justify-between">
        <div class="font-bold text-lg">
          广州科腾信息技术有限公司
        </div>
        <div class="font-mono text-sm text-neutral-500 dark:text-neutral-400">
          2017/05 - 2018/09
        </div>
      </div>
      <div class="my-2">
        前端开发工程师，综合能源事业部
      </div>
      <ul class="my-2 text-neutral-500 dark:text-neutral-400">
        <li>负责 Web 前端 MIS 系统代码框架、小程序代码框架开发，向各项目提供技术支持、Code Review</li>
        <li>参与具体项目的 Web 端、移动端、小程序开发</li>
        <li>从 0 搭建 Gitlab + Gitlab CI + Docker 版本控制与持续集成环境。</li>
      </ul>
    </div>
    <div class="py-2 avoid-page-break">
      <div class="flex items-baseline justify-between">
        <div class="font-bold text-lg">
          中山大学网络与信息技术中心
        </div>
        <div class="font-mono text-sm text-neutral-500 dark:text-neutral-400">
          2015/07 - 2017/04
        </div>
      </div>
      <div class="my-2">
        研发工程师（全栈）
      </div>
      <ul class="my-2 text-neutral-500 dark:text-neutral-400">
        <li>负责中山大学校务信息系统的设计、开发工作（因公出访系统、房地产信息系统、迎新系统等）</li>
      </ul>
    </div>
  </div>
</template>
