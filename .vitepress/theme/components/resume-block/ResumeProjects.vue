<script setup lang="ts">
import SubProject from './SubProject.vue'
import MainProject from './MainProject.vue'
</script>

<template>
  <MainProject
    title="矩阵管家"
    :tags="['Electron', 'Vue 3', 'Element Plus']"
    :images="[
      'https://ebefa3b.webp.li/20250730155217339.png',
      'https://ebefa3b.webp.li/20250730155544692.png',
    ]"
    time="2025.04 - 至今"
  >
    <template #description>
      矩阵管家是一个基于 Electron 的桌面应用，智能生成素材，迅速发布各社交平台，精准分析运营数据，高效管理账号。
    </template>
    <ul>
      <li>使用 <em fancy>electron-vite</em> 框架搭建跨平台桌面应用</li>
      <li>通过 electron <code>&lt;webview&gt;</code> 获取社交平台账号的 Cookie 并通过 API 进行社交平台发布</li>
      <li>用 AI 进行社媒素材文章、图片、视频创作</li>
    </ul>
  </MainProject>
  <MainProject
    title="数据探索 Data Exploration"
    :tags="['Vue 3', 'D3', 'Naive UI', '高性能 Excel-like 表格']"
    link="https://exp.datastory.com.cn"
    :images="[
      'https://ebefa3b.webp.li/20250728115040961.png',
      'https://ebefa3b.webp.li/20250728120031068.png',
    ]"
    time="2023.08 - 2025.01"
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
    time="2023.07 - 2023.10"
  >
    <template #description>
      基于 RAG 的对话式产品，可基于企业内部数据、互联网全量数据、联网查询（百度搜索）对问题进行总结回答。
    </template>
    <ul>
      <li>仿 ChatGPT 的对话式产品，支持多轮对话、上下文记忆（<em fancy>UnoCSS 实现，无组件库</em>）</li>
      <li>对接 <em fancy>SSE</em> 返回结构化数据，可展示成表格、图表等（@microsoft/fetch-event-source）</li>
      <li>独立完成产品交互设计、UI 设计等工作</li>
    </ul>
    <SubProject title="人工标注工具" :tags="['Vue 3', 'Naive UI']">
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
    time="2023.04 - 2023.08"
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
    :tags="['Vue 2', 'Vue 3', 'ECharts', 'qiankun 乾坤', 'Node.js', 'Chrome Extension', 'CLI Tool']"
    link="https://xdp.datastory.com.cn"
    :images="[
      'https://ebefa3b.webp.li/20250728163746392.png',
      'https://ebefa3b.webp.li/20250728163909061.png',
      'https://ebefa3b.webp.li/20250728164510336.png',
    ]"
    time="2019.09 - 2023.08"
  >
    <template #description>
      一个整合数据源、分析、图表页面搭建的低代码可视化建站系统，支持从实际业务<em fancy>数据源接入 → 筛选分析逻辑 → 页面搭建 → 图表呈现 → API 发布</em>的完整闭环。平台提供组件、脚本、插件等一整套低代码生态支持，广泛应用于公司多个业务部门的数据呈现场景。
    </template>
    <ul>
      <li>采用 <em fancy>qiankun 乾坤</em> 微前端架构，将每个大模块独立维护</li>
      <li>参与组件系统、画布渲染、交互机制、自定义组件的架构设计与技术选型，推动平台整体架构演进。</li>
      <li>推出 <em fancy>async-component 动态解耦方案</em>，支持组件异步加载，提升平台性能与组件灵活性。</li>
      <li>画布渲染采用同一套 div DOM 完成编辑、预览态</li>
    </ul>
    <SubProject title="dsv-cli 脚手架" :tags="['Node.js', 'webpack', 'Koa']">
      <div>
        自研 dsv-cli，用于初始化方舟自定义组件，运行组件<em fancy>本地开发环境，管理组件、打包上传</em>等操作。
      </div>
      <ul>
        <li>
          基于 Node.js + Commander.js 打造交互式 CLI，支持初始化、开发、打包上传等全流程组件管理。
        </li>
        <li>
          使用 webpack 搭建本地开发环境，支持 mock 与 iframe 沙箱隔离；构建产物为 bundle.js，供平台 async 加载使用。
        </li>
      </ul>
    </SubProject>
    <SubProject title="XDP Devtools" :tags="['Chrome 插件', 'XHR 劫持', 'Vue 3']">
      <div>
        方便在浏览器（正式环境）上排查低代码页面的页面逻辑、内部变量等，类似 Vue Devtools
      </div>
      <ul>
        <li>
          类似 Vue Devtools，针对平台页面支持组件调试与请求劫持功能。
        </li>
        <li>
          实现了<em fancy> XHR 拦截、Request/Response 动态改写</em>、脚本 Mock、组件 DOM 检查等能力，支持直接在浏览器中调试生产环境页面逻辑。
        </li>
      </ul>
    </SubProject>
  </MainProject>
  <MainProject
    title="数说方舟 3.0 数据处理平台"
    :tags="['Vue 3', 'MonacoEditor', 'IDE-like 界面', 'Dagster', 'DBT']"
    :images="['https://ebefa3b.webp.li/20250730150011898.png']"
    time="2023.03 - 2023.04"
  >
    <template #description>
      支持用户通过类似 VS Code 的界面，编写 SQL、Python 等脚本，进行数据处理与分析。支持 Dagster、DBT 等数据处理框架。
    </template>
    <ul>
      <li>通过 <em fancy>MonacoEditor</em> 支持代码的编写，支持 DBT API 的 hints；类型、语法错误提示</li>
      <li>将基于 React 的 Dagster UI 代码用 Vue 3 接入到系统中</li>
    </ul>
  </MainProject>
</template>
