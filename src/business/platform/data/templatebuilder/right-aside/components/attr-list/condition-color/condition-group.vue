<template>
  <div class="condition-group-body">
    <el-container>
      <template v-for="(condition,c) in conditionData">
        <el-main v-if="condition.conditionData.length>0" :key="c">
          <el-link icon="el-icon-plus" :underline="false" type="primary" @click="addCondition(c)">添加</el-link>
          <el-main v-for="(interior,i) in condition.conditionData" :key="i">
            <el-select v-model="interior.selectField" placeholder="请选择字段" class="select-field" @change="value =>handelChange(value,c,i)">
              <el-option
                v-for="item in fields"
                :key="item.value"
                :label="item.label"
                :value="item.name"
              />
            </el-select>
            <el-select v-model="interior.selectCondition" placeholder="请选择" class="select-condition" @visible-change="visible =>handelVsibleChange(interior.selectField,c,i,visible)">
              <el-option
                v-for="item in conditionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <!-- ~~~~~~分割线~~~~~~ -->
            <!--  字符串 -->
            <el-input v-if="interior.dataType ==='varchar'" v-model="interior.conditionPrice" placeholder="请输入" class="select-condition-price" />
            <!--  日期 -->
            <el-date-picker
              v-else-if="interior.dataType ==='date'"
              v-model="interior.conditionPrice"
              placeholder="选择日期时间"
              type="date"
              value-format="yyyy-MM-dd"
              class="select-condition-price"
            />
            <!--  数字 -->
            <el-input v-else-if="interior.dataType ==='number'" v-model="interior.conditionPrice" type="number" placeholder="请输入" class="select-condition-price" />
            <!-- ~~~~~~分割线~~~~~~ -->
            <el-link type="danger" :underline="false" class="select-condition-remove" @click="removeInterior(c,i)">删除</el-link>
            <div v-if="condition.conditionData.length > i + 1" class="condition-logic">
              <el-select v-model="interior.logic" placeholder="请选择">
                <el-option
                  v-for="item in logicOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </el-main>
          <span class="select-condition-color">背景颜色为<el-color-picker v-model="condition.conditionColor" show-alpha /></span>
        </el-main>
      </template>
    </el-container>
  </div>
</template>
<script>
export default {
  props: {
    fields: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      conditionData: [],
      conditionOptions: [ // 初始化进入时的字段匹配展示
        {
          label: '等于',
          value: 'contains'
        }, {
          label: '不等于',
          value: 'not_contains'
        }, {
          label: '大于',
          value: 'greater'
        }, {
          label: '大于或等于',
          value: 'greater_contains'
        }, {
          label: '小于',
          value: 'unGreater'
        }, {
          label: '小于或等于',
          value: 'unGreater_contains'
        }, {
          label: '包含',
          value: 'include'
        }, {
          label: '不包含',
          value: 'unInclude'
        }],
      logicOptions: [{
        value: 'and',
        label: '且'
      }, {
        value: 'or',
        label: '或'
      }],
      defaultData: [{
        conditionData: [
          {
            selectField: '',
            selectCondition: '',
            conditionPrice: '',
            logic: 'or',
            dataType: 'varchar'
          }
        ],
        conditionColor: ''
      }]
    }
  },
  watch: {
    data: {
      handler: function(val) {
        this.conditionData = this.$utils.isNotEmpty(val) ? val : this.defaultData
      },
      deep: true,
      immediate: true
    },
    conditionData: {
      handler: function(val) {
        this.$emit('update:data', val)
      },
      deep: true,
      immediate: true
    }

  },
  methods: {
    handelChange(value, p, i) {
      const data = this.fields.filter(f => f.name === value)
      this.conditionData[p].conditionData[i].dataType = data[0].type || 'varchar'
      this.conditionData[p].conditionData[i].conditionPrice = ''
    },
    handelVsibleChange(value, p, i, vsible) {
      if (vsible) {
        this.conditionOptions = []
        const data = this.fields.filter(f => f.name === value)
        const type = value !== '' ? data[0].type : 'varchar'
        this.conditionData[p].conditionData[i].dataType = type
        switch (type) {
          case 'varchar':
            this.conditionOptions = [
              {
                label: '等于',
                value: 'contains'
              }, {
                label: '不等于',
                value: 'not_contains'
              }, {
                label: '包含',
                value: 'include'
              }, {
                label: '不包含',
                value: 'unInclude'
              }
            ]
            break
          case 'date':
          case 'number':
            this.conditionOptions = [
              {
                label: '等于',
                value: 'contains'
              }, {
                label: '不等于',
                value: 'not_contains'
              }, {
                label: '大于',
                value: 'greater'
              }, {
                label: '大于或等于',
                value: 'greater_contains'
              }, {
                label: '小于',
                value: 'unGreater'
              }, {
                label: '小于或等于',
                value: 'unGreater_contains'
              }
            ]
            break
        }
      }
    },
    addCondition(o) {
      const obj = {
        selectField: '',
        selectCondition: '',
        conditionPrice: '',
        logic: '',
        dataType: 'varchar'
      }
      this.conditionData[o].conditionData.push(obj)
    },
    removeInterior(p, c) {
      this.conditionData[p].conditionData.splice(c, 1)
      if (this.conditionData[p].conditionData.length === 0) {
        this.conditionData.splice(p, 1)
      }
    }
  }
}
</script>
<style lang="scss">
.condition-group-body{
  .el-container{
    display:block;
  }
  .el-main{
    border:1px solid #EBDFC6;
    padding: 10px 20px;
    border-radius: 3px;
    margin-bottom: 15px;
    .el-main{
      position: relative;
      padding: 5px 20px 5px 5px;
      margin-top: 5px;
      border-radius: 3px;
      width: 90%;
      overflow: initial;
    }
    .select-field{
      margin-left: 5px;
    }
    .select-condition{
      margin-left: 5px;
      width: 15%;
    }
    .select-condition-price{
      display: inline-block;
      width: 30%;
      margin-left: 5px;
    }
    .select-condition-remove{
      float: right;
    }
    .condition-logic{
      width: 60px;
      position: absolute;
      right: -82px;
      &::before{
        content: '';
        position: absolute;
        top: -15px;
        left: -21px;
        width: 55px;
        height: 15px;
        background: transparent;
        border-top: 1px solid #E1E1E1;
        border-right: 1px solid #E1E1E1;
      }
      &::after{
        content: '';
        position: absolute;
        top: 26px;
        left: -21px;
        width: 55px;
        height: 14px;
        background: transparent;
        border-right: 1px solid #E1E1E1;
        border-bottom: 1px solid #E1E1E1;
      }
    }
  }
  .select-condition-color{
    display: inline-block;
    position: relative;
    .el-color-picker{
      position: absolute;
      right: -35px;
    }
  }
}
</style>
