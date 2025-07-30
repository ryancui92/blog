<script setup lang="ts">
import MainProject from './MainProject.vue'
</script>

<template>
  <MainProject
    title="dsviews"
    :tags="['Vue 2', 'Element UI', '组件库']"
    link="https://dsviews.datastory.com.cn"
    time="2021.08 - 2022.09"
  >
    <template #description>
      一套基于 Element UI 改造的组件库，广泛应用于公司多个业务部门的数据呈现场景。
    </template>
    <ul>
      <li>从 Element UI Fork 一份在公司内部进行开发与维护</li>
      <li>组件库文档搭建，组件 Demo 例子动态渲染；与设计紧密配合，应用公司内部的配色方案</li>
    </ul>
  </MainProject>
  <MainProject
    title="长安人群洞察系统"
    :tags="['Vue 3', 'Element Plus', 'Pinia', 'BI Dashboard', 'ECharts']"
    time="2024.01 - 至今"
  >
    <template #description>
      基于大数据的用户画像分析系统，提供用户画像、用户行为分析、用户分群等功能。可视化展示用户的年龄、性别、地域等信息，并对用户进行分群分析。
    </template>
  </MainProject>
  <MainProject
    title="数说开放平台"
    :tags="['Vue 2', 'Element UI']"
    link="https://open.datastory.com.cn/"
  >
    <template #description>
      数说开放平台是供服务商、合作伙伴使用的开放平台，提供 API 服务、产品、产品商城等功能。
    </template>
    <ul>
      <li>提供 OAuth 统一登录页面</li>
    </ul>
  </MainProject>
</template>
