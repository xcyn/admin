<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
      <ibps-desktop-toolbar ref="toolbar" :actions="[{ key: 'refresh' }, { key: 'more' }, { key: 'fullscreen' }, { key: 'collapse' }]" @action-event="handleActionEvent" />
    </div>
    <div ref="body" :style="{height:showHeight,width:'100%'}">
      <el-scrollbar
        :style="{height:needPage? '85%':'100%',width:'100%'}"
        wrap-class="ibps-scrollbar-wrapper  trotting-scrollbar"
      >
        <ibps-trotting-horse-lamp v-if="data && data.length >0" :data="data" @click="d => handleFlowClick({instanceId:d.id})">
          <div slot="title" slot-scope="data">
            <el-row :gutter="20">
              <el-col :span="2">
                <el-avatar style="width:40px;margin:10px 0;" :src="getPhoto(data.row.creatorPhoto)" icon="el-icon-user-solid" @error="errorAvatarHandler">{{ data.row.creator }}</el-avatar>
              </el-col>
              <el-col :span="22">
                <el-link type="primary" :underline="false">{{ data.row.subject|removeHtmlTag }}</el-link>
                <p style="line-height:10px;margin:0;">{{ data.row.createTime|dateFormat }}</p>
              </el-col>
            </el-row>
          </div>
          <div slot="extra" slot-scope="data" style="width:100%;text-align:right;padding:10px 0;">
            <ibps-icon name="dot-circle-o" style="color:#36c6d3" />
            {{ data.row.status | filterStatus('already') }}
          </div>
        </ibps-trotting-horse-lamp>
        <el-alert
          v-else
          :title="$t('common.noData')"
          :closable="false"
          type="warning"
        />
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
