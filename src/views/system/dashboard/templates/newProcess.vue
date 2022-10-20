<template>
  <el-card :style="{height:cardHeight}" class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
      <ibps-desktop-toolbar
        ref="toolbar"
        :actions="[{ key: 'refresh' },{ key: 'more' },{ key: 'fullscreen' },{ key: 'collapse' }]"
        @action-event="handleActionEvent"
      />
    </div>
    <div ref="body" :style="{height:showHeight,width:'100%'}">
      <el-scrollbar
        :style="{height:needPage? '85%':'100%',width:'100%'}"
        wrap-class="ibps-scrollbar-wrapper trotting-scrollbar"
      >
        <ibps-trotting-horse-lamp v-if="data && data.length >0" :is-trotting-horse-lamp="isTrottingHorseLamp" :data="data" @click="d => handleFlowClick({defId:d.id})">
          <el-link slot="title" slot-scope="data" type="primary" :underline="false">{{ data.row.name|removeHtmlTag }}</el-link>
          <span slot="extra" slot-scope="data" style="width:100%;text-align:right;">{{ '版本：'+ data.row.version }}</span>
        </ibps-trotting-horse-lamp>
      </el-scrollbar>
    </div>
    <el-pagination
      v-if="!loading&&needPage"
      class="doshboard-page"
      :page-size="limit"
      small
      layout="prev, pager, next,jumper,total"
      :total="totalCount"
      @current-change="currentChange"
    />
  </el-card>

</template>
