<template>
  <ibps-container type="full" class="page">
    <!--顶部按钮 请根据实际添加-->
    <div class="dynamic-form">

      <!--表头-->
      <div class="form-header">
        <div class="title">Pure-测试生成代码-布局-标签</div>
      </div>
      <el-form
        ref="form"
        :model="models"

        :inline="inline"
        :label-suffix="labelSuffix"
        :label-width="labelWidth"
        :label-position="labelPosition"
        :status-icon="statusIcon"
        :size="size"
        :hide-required-asterisk="hideRequiredAsterisk"
        @submit.native.prevent
      >
        <el-tabs
          v-model="formLayout.tabs_1stcfrn"
          type="border-card"
          tab-position="top"
          :stretch="false"
          class="ibps-mb-10"
        >
          <el-tab-pane name="tab1">
            <span slot="label">标签页1</span>

            <el-form-item
              label="创建时间"

              prop="createTime"
            ><el-input
              v-model="models.createTime"
              placeholder="请输入"
              type="number"
              name="createTime"
              :autosize="autosize"
              :rows="3"
              :readonly="readonly"
              clearable
              :style="{width:width}"
              @keypress.native="channelInputLimit"
            />
            </el-form-item>

            <el-form-item
              label="计数器"

              prop="jiShuQi"
            ><el-input-number
              v-model="models.jiShuQi"
              :max="100"
              :min="0"
              :step="1"
              :controls="true"
              controls-position=""
              placeholder="请输入"
              :readonly="readonly"
              :style="{width:width}"
            />
            </el-form-item>

            <el-form-item
              label="多选框"

              prop="duoXuanKuang"
            ><el-checkbox-group
              v-model="models.duoXuanKuang"
              :disabled="readonly"
            >

              <component
                :is="'el-checkbox'"
                :label="'1'"
                class="ibps-pt-5"
              >
                选项一
              </component>
              <component
                :is="'el-checkbox'"
                :label="'2'"
                class="ibps-pt-5"
              >
                选项二
              </component>
            </el-checkbox-group>
            </el-form-item>

            <el-form-item
              label="日期控件"

              prop="riQiKongJian"
            ><el-date-picker
              v-model="models.riQiKongJian"
              type="date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              placeholder="请选择"
              :style="{width:width}"
              :readonly="readonly"
              :clearable="true"
            />
            </el-form-item>

            <el-form-item
              label="多行文本"

              prop="duoXingWenBen"
            ><el-input
              v-model="models.duoXingWenBen"
              placeholder="请输入"
              type="textarea"
              name="duoXingWenBen"
              :autosize="autosize"
              :rows="3"
              :readonly="readonly"
              clearable
              :style="{width:width}"
            />
            </el-form-item>

            <el-form-item
              label="滑块"

              prop="huaKuai"
            ><div style="width:99%;">
              <el-slider
                v-model="models.huaKuai"
                :show-input="false"
                :show-tooltip="true"
                :max="100"
                :min="0"
                :step="1"
                :disabled="readonly"
                :style="{width:width}"
              />
            </div>
            </el-form-item>

            <el-form-item
              label="图片"

              prop="tuPian"
            >
              <ibps-image
                v-model="models.tuPian"
                width=""
                height=""
                limit=""
                accept=".jpg,.jpeg,.png,.gif,.bmp,.tif"
                media=""
                tip=""
                size=""
                upload-type="attachment"
                :disabled="readonly"
              />

            </el-form-item>

            <el-form-item
              label="自定义对话框"

              prop="ziDingYiDuiHuaKuang"
            >
              <ibps-custom-dialog
                v-model="models.ziDingYiDuiHuaKuang"
                template-key="dhksj"
                placeholder="请选择"
                store="id"
                icon="ibps-icon-search-plus"
                type="dialog"
                :disabled="readonly"
                :readonly-text="readonlyText?'text':null"
                :style="{width:width}"
              />

            </el-form-item>

            <el-form-item
              label="数据字典"

              prop="shuJuZiDian"
            >
              <ibps-dictionary
                v-model="models.shuJuZiDian"
                type-key="fieldControl"
                :multiple="false"
                select-mode="leaf"
                display-mode="path"
                separator="/"
                placeholder="请选择"
                :disabled="readonly"
                :readonly="readonly"
                :readonly-text="readonlyText?'text':'original'"
                :clearable="true"
                :style="{width:width}"
              />

            </el-form-item>

          </el-tab-pane>
          <el-tab-pane name="tab2">
            <span slot="label">标签页2</span>

            <el-form-item
              label="单行文本"

              prop="danXingWenBen"
            ><el-input
              v-model="models.danXingWenBen"
              placeholder="请输入"
              type="text"
              name="danXingWenBen"
              :autosize="autosize"
              :rows="3"
              :readonly="readonly"
              clearable
              :style="{width:width}"
            />
            </el-form-item>

            <el-form-item
              label="下拉框"

              prop="xiaLaKuang"
            >
              <el-select
                v-model="models.xiaLaKuang"
                placeholder="请选择"
                name="xiaLaKuang"
                :disabled="readonly"
                :style="{width:width}"
                clearable
              >

                <el-option
                  key="1"
                  label="选项一"
                  value="1"
                />
                <el-option
                  key="2"
                  label="选项二"
                  value="2"
                />

              </el-select>
            </el-form-item>

            <el-form-item
              label="开关"

              prop="kaiGuan"
            >
              <el-switch
                v-model="models.kaiGuan"
                active-value="Y"
                inactive-value="N"
                active-text=""
                inactive-text=""
                active-color=""
                inactive-color=""
                :disabled="readonly"
              />
            </el-form-item>

            <el-form-item
              label="单选框"

              prop="danXuanKuang"
            ><el-radio-group
              v-model="models.danXuanKuang"
              :disabled="readonly"
            >

              <component
                :is="'el-radio'"
                :label="'1'"
                class="ibps-pt-5"
              >
                选项一
              </component>
              <component
                :is="'el-radio'"
                :label="'2'"
                class="ibps-pt-5"
              >
                选项二
              </component>
            </el-radio-group>
            </el-form-item>

            <el-form-item
              label="评分"

              prop="pingFen"
            ><el-rate
              v-model="models.pingFen"
              :max="5"
              :allow-half="false"

              :disabled="readonly"
              class="ibps-pt-10"
            />
            </el-form-item>

            <el-form-item
              label=""
              label-width="0"
              prop="zbdkjzy"
            >
              <div class="dynamic-form-table">

                <div class="dynamic-form-table__inner panel panel-info">
                  <div class="panel-heading ibps-clearfix">
                    <div class="ibps-fl dynamic-form-table__label">子表单控件专用</div>

                    <div class="ibps-fr hidden-print">
                      <el-button-group>

                        <el-button
                          :key="0"
                          type="primary"
                          icon="ibps-icon-add"
                          @click="handleActionEvent('add','zbdkjzy','zbdkjzy')"
                        >
                          添加
                        </el-button>
                        <el-button
                          :key="1"
                          type="danger"
                          icon="ibps-icon-remove"
                          @click="handleActionEvent('remove','zbdkjzy','zbdkjzy')"
                        >
                          删除
                        </el-button>
                      </el-button-group>
                    </div>

                  </div>
                  <div class="panel-body">
                    <el-table
                      ref="zbdkjzy"
                      :data="models.zbdkjzy"
                      border
                      stripe
                    >
                      <el-table-column
                        type="selection"
                        width="50"
                      />

                      <el-table-column
                        :key="2"
                        prop="createBy"
                      >
                        <template slot="header">
                          创建人

                        </template>
                        <template slot-scope="props">

                          <el-form-item
                            prop="createBy"

                            label-width="0px"
                            :class="{
                              'dynamic-form-table-item__readonly':readonly
                            }"
                          >
                            <el-input
                              v-model="props.row.createBy"
                              placeholder="请输入"
                              type="text"
                              name="createBy"
                              :autosize="autosize"
                              :rows="3"
                              :readonly="readonly"
                              clearable
                              :style="{width:width}"
                            />
                          </el-form-item>

                        </template>
                      </el-table-column>

                    </el-table>
                  </div>
                </div>

              </div>
            </el-form-item>

            <el-form-item
              label="富文本"

              prop="fuWenBen"
            >
              <ibps-ueditor
                v-model="models.fuWenBen"
                placeholder=""
                :config="ueditorConfig.fuWenBen"
                :readonly="readonly"
                destroy
              />
            </el-form-item>

            <el-form-item
              label="选择器"

              prop="xuanZeQi"
            >
              <ibps-user-selector
                v-model="models.xuanZeQi"
                placeholder="请选择"
                type="user"

                :multiple="true"
                store="id"
                :disabled="readonly"
                :readonly-text="readonlyText?'text':null"
                :style="{width:width}"
              />

            </el-form-item>

            <el-form-item
              label="上传附件"

              prop="shangChuanFuJian"
            >
              <ibps-attachment
                v-model="models.shangChuanFuJian"
                placeholder="请选择"
                :download="true"
                :readonly="readonly"

                accept="*"
                :multiple="true"
                upload-type="attachment"
                store="id"
                media-type=""
                media=""
                :style="{width:width}"
              />

            </el-form-item>

            <el-form-item
              label="数字"

              prop="shuZu"
            ><el-input
              v-model="models.shuZu"
              placeholder="请输入"
              type="number"
              name="shuZu"
              :autosize="autosize"
              :rows="3"
              :readonly="readonly"
              clearable
              :style="{width:width}"
              @keypress.native="channelInputLimit"
            />
            </el-form-item>

          </el-tab-pane>

        </el-tabs>

        <el-form-item class="ibps-tc">
          <ibps-toolbar
            ref="toolbar"
            :actions="actions"
            @action-event="handleButtonEvent"
          />
        </el-form-item>

      </el-form>
    </div>
  </ibps-container>
</template>
<script>

import IbpsImage from '@/business/platform/file/image'
import IbpsCustomDialog from '@/business/platform/data/templaterender/custom-dialog'
import IbpsDictionary from '@/business/platform/cat/dictionary/select'
import IbpsUeditor from '@/components/ibps-ueditor'
import IbpsUserSelector from '@/business/platform/org/selector'
import IbpsAttachment from '@/business/platform/file/attachment/selector'
export default {

  components: {
    'ibps-image': IbpsImage,
    'ibps-custom-dialog': IbpsCustomDialog,
    'ibps-dictionary': IbpsDictionary,
    'ibps-ueditor': IbpsUeditor,
    'ibps-user-selector': IbpsUserSelector,
    'ibps-attachment': IbpsAttachment
  },
  data() {
    return {
      dynamicForm: this,
      models: { 'id': '', 'createTime': '', 'jiShuQi': '', 'duoXuanKuang': [], 'riQiKongJian': '', 'duoXingWenBen': '', 'yinCangYu': '', 'huaKuai': 0, 'tuPian': '', 'ziDingYiDuiHuaKuang': '', 'shuJuZiDian': '', 'danXingWenBen': '', 'xiaLaKuang': '', 'kaiGuan': 'N', 'danXuanKuang': '', 'pingFen': 0, 'zbdkjzy': [{ 'id': '', 'parentId': '', 'createBy': '' }], 'fuWenBen': '', 'xuanZeQi': '', 'shangChuanFuJian': '', 'shuZu': '' },
      inline: false,
      labelSuffix: '',
      labelWidth: '100px',
      labelPosition: 'right',
      statusIcon: false,
      size: '',
      hideRequiredAsterisk: false,

      readonly: false,
      readonlyText: true,
      multiple: false,
      autosize: '',
      width: '',
      actions: [
        {
          key: 'submit',
          label: '提交',
          type: 'primary'
        },
        {
          key: 'reset',
          label: '重置'
        }
      ],
      formLayout: { tabs_1stcfrn: 'tab1' },

      ueditorConfig: { 'fuWenBen': { 'initialContent': '', 'toolbars': [['source', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'pasteplain', '|', 'forecolor', 'backcolor', 'selectall', 'cleardoc', 'fontfamily', 'fontsize']] }}
    }
  },

  methods: {

    channelInputLimit(e) {
      if (e.key === 'e') {
        e.returnValue = false
        return false
      }
      return true
    },

    handleSave() {
      console.info(this.models)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleButtonEvent(button, data) {
      console.info(button, data)
      switch (button.key) {
        case 'submit':
          this.submitForm('form')
          break
        case 'reset':
          this.resetForm('form')
          break
        default:
          break
      }
    },

    handleActionEvent(type, name, tableName) {
      // console.info(this.$refs[tableName].selection)
      // todo
      // 修改、删除可根据this.$refs[tableName].selection获取选中行的数据
      switch (type) {
        case 'add':
          console.info('添加')
          // 为表格增加数据
          if (!(this.models[name] && Array.isArray(this.models[name]))) {
            this.models[name] = []
          }
          this.models[name].push({
            id: '',
            parentId: '',
            createBy: ''
          })

          break
        case 'edit':
          console.info('修改')
          break
        case 'remove':
          console.info('删除')
          // eslint-disable-next-line no-case-declarations
          const _temps = this.$refs[tableName].selection
          if (_temps && _temps.length > 0) {
            this.$confirm('确定删除?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.models[name] = this.models[name].filter(item => {
                return !_temps.includes(item)
              })
              this.$message({
                message: '批量删除成功',
                type: 'success'
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
          } else {
            this.$message({
              message: '当前没有选择数据，请先选择数据',
              type: 'warning'
            })
          }
          break
        case 'import':
          console.info('导入')
          break
        case 'export':
          console.info('导出')
          break
        case 'custom':
          // 添加自定义对话框按钮
          break
        default:
          break
      }
    }

  }
}
</script>
<style lang="scss">
.dynamic-form {
  .el-input{
    width: 100%;
  }
  .el-select{
    width: 100%;
  }

  .el-collapse-item__header.is-active{
    border-bottom: 1px solid #EBEEF5;
    margin-bottom: 5px;
  }
  .form-header {
    border-bottom: 1px solid #2b34410d;
    margin-bottom: 5px;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #222;
      text-align: left;
      padding: 8px 10px 10px;
      margin: 0;
    }
    .desc {
      word-wrap: break-word;
      word-break: normal;
      text-indent: 0;
      line-height: 1.6;
      margin: 0 0 11px;
      padding: 3px 30px 8px;
    }
  }
  .dynamic-form-table-item__readonly{
    margin-bottom: 0;
  }

//===================border-form====================
  .ibps-border-form {
    border: 1px solid #cfd7e5;

    .el-form-item{
      border-top: 1px solid #cfd7e5;
    }

    .el-form-item__content:before {
      width: 1px;
      background: #cfd7e5;
      display: block;
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom:-20px;
    }

    .el-form-item__content .el-form-item__error {
      left: 5px
    }

    .el-form--label-top .el-form-item__content:before,
    .no-label-form-item .el-form-item__content:before {
      background: transparent
    }

    .el-row+.el-row {
      border-top: 1px solid #cfd7e5
    }

    .el-col+.el-col {
      border-left: 1px solid #cfd7e5
    }

    .el-col {
      overflow: hidden
    }

    .el-form-item__content {
      padding: 5px;
      padding-bottom: 0
    }

    .el-form-item__label {
      padding: 5px
    }

    .el-table{
      .el-form-item{
          border-top: 0;
      }
      .el-form-item__content:before {
        width: 0;
      }
      .el-form-item__content {
        padding: 0;
      }

    }

  }
  .machine_direction{
    display: flex;
    flex-direction: column;
  }
  .edui-editor{
    z-index: 1000!important;
  }

}

  .dynamic-form-table{
    .panel-heading{
      border-bottom:0;
      border-left: 1px solid #dde7ee;
      border-right: 1px solid #dde7ee;
    }
    .dynamic-form-table__inner{
      .panel-body{
        padding: 0;
      }
    }
    .dynamic-form-table__block{
      padding-bottom:10px;
      .panel-body{
        border: 1px solid #dde7ee;
      }
    }
  }
  .is-error{
    .dynamic-form-table{
      border: 1px solid #F56C6C;
    }
  }

  .is-required:not(.is-no-asterisk){
    .dynamic-form-table__label:before {
      content: '*';
      color: #F56C6C;
      margin-right: 4px;
    }
  }

</style>
