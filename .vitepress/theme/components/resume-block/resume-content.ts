export interface ResumeProfile {
  name: string
  school: string
  phone: string
  email: string
}

export interface SubProjectData {
  title: string
  tags?: string[]
  link?: string
  description?: string
  items?: string[]
}

export interface ResumeProject {
  title: string
  time?: string
  tags?: string[]
  link?: string
  images?: string[]
  description?: string
  items?: string[]
  subProjects?: SubProjectData[]
}

export interface ResumeJob {
  title: string
  time: string
  position: string
  items: string[]
}

export const profile: ResumeProfile = {
  name: '崔兆威',
  school: '中山大学 信息科学与技术学院 通信工程 2011 级',
  phone: '(+86) 13660321734',
  email: 'cuizhaowei92@gmail.com',
}

export const skills: string[] = [
  '熟练掌握 HTML/CSS/JavaScript，熟悉 <em fancy>TypeScript</em>',
  '熟悉 <em fancy>Vue3</em>/<em fancy>Vue2</em> 框架，了解实现原理；熟练使用常见的 UI 框架，如 ElementPlus, Ant Design Vue, Naive UI 等；了解 React/Angular 等其他 MVVM 框架',
  '熟练使用 Sass/Less 等 CSS 预处理器，熟练使用 <em fancy>TailwindCSS/UnoCSS</em> 等 Atomic CSS 框架',
  '熟悉 npm, pnpm, <em fancy>vite</em>, unplugin 等构建工具的配置使用，并了解其原理',
  '熟练使用 Web 开发中常用的工具与工作流，如 whistle, Postman, Chrome Devtools 等；熟悉图形可视化相关库，如 ECharts, D3.js 等',
  '熟悉 Web 开发技术，如 HTTP 协议、常用 Linux 命令、<em fancy>Nginx 配置</em>、<em fancy>Node.js</em>、<em fancy>K8s/Docker</em> 等；有 Sonarcude/Sentry 等监控、日志工具的使用经验',
]

export const mainProjects: ResumeProject[] = [
  {
    title: '矩阵管家',
    time: '2025.04 - 至今',
    tags: ['Electron', 'Vue 3', 'Element Plus'],
    images: [
      'https://ebefa3b.webp.li/20250730155217339.png',
      'https://ebefa3b.webp.li/20250730155544692.png',
    ],
    description:
      '矩阵管家是一个基于 Electron 的桌面应用，智能生成素材，迅速发布各社交平台，精准分析运营数据，高效管理账号。',
    items: [
      '使用 <em fancy>electron-vite</em> 框架搭建跨平台桌面应用',
      '通过 electron <code>&lt;webview&gt;</code> 获取社交平台账号的 Cookie 并通过 API 进行社交平台发布',
      '用 AI 进行社媒素材文章、图片、视频创作',
    ],
  },
  {
    title: '数据探索 Data Exploration',
    time: '2023.08 - 2025.01',
    tags: ['Vue 3', 'D3', 'Naive UI', '高性能 Excel-like 表格'],
    link: 'https://exp.datastory.com.cn',
    images: [
      'https://ebefa3b.webp.li/20250728115040961.png',
      'https://ebefa3b.webp.li/20250728120031068.png',
    ],
    description:
      '通过大模型对数据的某些列进行 Embedding, 然后降维至二维平面，可以从中洞察数据之间的分组、归类情况，并对数据打上对应的标签。',
    items: [
      '<em fancy>百万级散点</em>的渲染，支持拖拽、缩放等交互（D3/WebGL）',
      '类似 Excel 的千万级数据的在线表格，支持排序、筛选、列移动、显示隐藏等（前端：基于 React Virtual Scroll 改写的 Vue 3 虚拟滚动；后端 DuckDB）',
    ],
  },
  {
    title: '小智 Insight',
    time: '2023.07 - 2023.10',
    tags: ['Vue 3', 'ChatBot', 'AI', 'UnoCSS', '多端适配', 'SSE', 'RAG'],
    link: 'https://sdx.datastory.com.cn',
    images: [
      'https://ebefa3b.webp.li/20250728152959530.png',
      'https://ebefa3b.webp.li/20250728160500513.png',
    ],
    description:
      '基于 RAG 的对话式产品，可基于企业内部数据、互联网全量数据、联网查询（百度搜索）对问题进行总结回答。',
    items: [
      '仿 ChatGPT 的对话式产品，支持多轮对话、上下文记忆（<em fancy>UnoCSS 实现，无组件库</em>）',
      '对接 <em fancy>SSE</em> 返回结构化数据，可展示成表格、图表等（@microsoft/fetch-event-source）',
      '独立完成产品交互设计、UI 设计等工作',
    ],
    subProjects: [
      {
        title: '人工标注工具',
        tags: ['Vue 3', 'Naive UI'],
        description:
          '针对企业内部 PDF 文档进行人工标注，构建向量数据库，可视化框选对应的数据类型（标题、文本、表格、图表等）进行 OCR. 为小智 Insight 提供数据支持。',
        items: ['DOM 画布框选操作，mousedown/mousemove/mouseup/scroll 事件处理'],
      },
    ],
  },
  {
    title: 'Enlightening AI',
    time: '2023.04 - 2023.08',
    tags: ['Vue 3', 'Naive UI', 'AI', '复杂页面状态管理'],
    link: 'https://enlighteningai.datastory.com.cn',
    images: ['https://ebefa3b.webp.li/20250728161507347.png'],
    description:
      '一个可以创建 AI Embedding，AI Skill 并对多种 Prompt、多种模型，效果进行对比、调试；可以创建回归 Test Suite 的平台。最终 Skill 可以开放成可访问的 API 供业务侧调用。',
    items: ['类似 Dify/Vellum 等 AI 一站式开发平台'],
  },
  {
    title: '数说方舟',
    time: '2019.09 - 2023.08',
    tags: ['Vue 2', 'Vue 3', 'ECharts', 'qiankun 乾坤', 'Node.js', 'Chrome Extension', 'CLI Tool'],
    link: 'https://xdp.datastory.com.cn',
    images: [
      'https://ebefa3b.webp.li/20250728163746392.png',
      'https://ebefa3b.webp.li/20250728163909061.png',
      'https://ebefa3b.webp.li/20250728164510336.png',
    ],
    description:
      '一个整合数据源、分析、图表页面搭建的低代码可视化建站系统，支持从实际业务<em fancy>数据源接入 → 筛选分析逻辑 → 页面搭建 → 图表呈现 → API 发布</em>的完整闭环。平台提供组件、脚本、插件等一整套低代码生态支持，广泛应用于公司多个业务部门的数据呈现场景。',
    items: [
      '采用 <em fancy>qiankun 乾坤</em> 微前端架构，将每个大模块独立维护',
      '参与组件系统、画布渲染、交互机制、自定义组件的架构设计与技术选型，推动平台整体架构演进。',
      '推出 <em fancy>async-component 动态解耦方案</em>，支持组件异步加载，提升平台性能与组件灵活性。',
      '画布渲染采用同一套 div DOM 完成编辑、预览态',
    ],
    subProjects: [
      {
        title: 'dsv-cli 脚手架',
        tags: ['Node.js', 'webpack', 'Koa'],
        description:
          '自研 dsv-cli，用于初始化方舟自定义组件，运行组件<em fancy>本地开发环境，管理组件、打包上传</em>等操作。',
        items: [
          '基于 Node.js + Commander.js 打造交互式 CLI，支持初始化、开发、打包上传等全流程组件管理。',
          '使用 webpack 搭建本地开发环境，支持 mock 与 iframe 沙箱隔离；构建产物为 bundle.js，供平台 async 加载使用。',
        ],
      },
      {
        title: 'XDP Devtools',
        tags: ['Chrome 插件', 'XHR 劫持', 'Vue 3'],
        description:
          '方便在浏览器（正式环境）上排查低代码页面的页面逻辑、内部变量等，类似 Vue Devtools',
        items: [
          '类似 Vue Devtools，针对平台页面支持组件调试与请求劫持功能。',
          '实现了<em fancy> XHR 拦截、Request/Response 动态改写</em>、脚本 Mock、组件 DOM 检查等能力，支持直接在浏览器中调试生产环境页面逻辑。',
        ],
      },
    ],
  },
  {
    title: '数说方舟 3.0 数据处理平台',
    time: '2023.03 - 2023.04',
    tags: ['Vue 3', 'MonacoEditor', 'IDE-like 界面', 'Dagster', 'DBT'],
    images: ['https://ebefa3b.webp.li/20250730150011898.png'],
    description:
      '支持用户通过类似 VS Code 的界面，编写 SQL、Python 等脚本，进行数据处理与分析。支持 Dagster、DBT 等数据处理框架。',
    items: [
      '通过 <em fancy>MonacoEditor</em> 支持代码的编写，支持 DBT API 的 hints；类型、语法错误提示',
      '将基于 React 的 Dagster UI 代码用 Vue 3 接入到系统中',
    ],
  },
]

export const otherProjects: ResumeProject[] = [
  {
    title: 'dsviews',
    time: '2021.08 - 2022.09',
    tags: ['Vue 2', 'Element UI', '组件库'],
    link: 'https://dsviews.datastory.com.cn',
    description: '一套基于 Element UI 改造的组件库，广泛应用于公司多个业务部门的数据呈现场景。',
    items: [
      '从 Element UI Fork 一份在公司内部进行开发与维护',
      '组件库文档搭建，组件 Demo 例子动态渲染；与设计紧密配合，应用公司内部的配色方案',
    ],
  },
  {
    title: '长安人群洞察系统',
    time: '2024.01 - 至今',
    tags: ['Vue 3', 'Element Plus', 'Pinia', 'BI Dashboard', 'ECharts'],
    description:
      '基于大数据的用户画像分析系统，提供用户画像、用户行为分析、用户分群等功能。可视化展示用户的年龄、性别、地域等信息，并对用户进行分群分析。',
  },
  {
    title: '数说开放平台',
    tags: ['Vue 2', 'Element UI'],
    link: 'https://open.datastory.com.cn/',
    description:
      '数说开放平台是供服务商、合作伙伴使用的开放平台，提供 API 服务、产品、产品商城等功能。',
    items: ['提供 OAuth 统一登录页面'],
  },
]

export const jobs: ResumeJob[] = [
  {
    title: '广州数说故事科技有限公司',
    time: '2018.09 - 至今',
    position: '高级前端开发工程师',
    items: ['平台产品前端技术侧负责人，制定技术方案，代码审核，带新人等'],
  },
  {
    title: '广州科腾信息技术有限公司',
    time: '2017.05 - 2018.09',
    position: '前端开发工程师',
    items: [
      '负责 Web 前端 MIS 系统代码框架、小程序代码框架开发，向各项目提供技术支持、Code Review',
      '参与具体项目的 Web 端、移动端、小程序开发',
      '从 0 搭建 Gitlab + Gitlab CI + Docker 版本控制与持续集成环境。',
    ],
  },
  {
    title: '中山大学网络与信息技术中心',
    time: '2015.07 - 2017.04',
    position: '（全栈）研发工程师',
    items: [
      '负责中山大学校务信息系统的设计、开发工作（因公出访系统、房地产信息系统、迎新系统等）',
    ],
  },
]
