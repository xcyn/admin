<template>
  <el-cascader :props="props" :show-all-levels="false" v-model="selectId" clearable @change="handleChange"></el-cascader>
</template>
<script>
import * as comnHttp from '@/api/cpApi/common/index';
import * as utils from '@/utils/cpUtils/index'
export default {
  name: 'dep-tree-select',
  data () {
    return {
      selectId: '',
      props: {
        checkStrictly: true,
        lazy: true,
        lazyLoad (node, resolve) {
          setTimeout(() => {
            const id = node.value
            if (node.level == 0) {
              let param = {
                parameters: [
                  {
                    key: "key",
                    value: "bm"
                  }, {
                    key: "Q^DEPTH_^S",
                    value: 2
                  }, {
                    key: "Q^PARTY_TYPE_^S",
                    value: "org"
                  }, {
                    key: "Q^PARENT_ID_^S",
                    value: utils.getDepName().id
                  }
                ]
              }
              comnHttp.findDataByKey(param).then(res => {
                console.log(res);
                const depts = res.data.dataResult.map((value, i) => ({
                  value: value.ID_,
                  label: value.NAME_,
                  leaf: node.level >= 2
                }));
                // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                resolve(depts);
              }).catch(err => {
                console.log(err);
              });
            }
            if (node.level == 1) {
              let param = {
                parameters: [
                  {
                    key: "key",
                    value: "bm"
                  }, {
                    key: "Q^DEPTH_^S",
                    value: 3
                  }, {
                    key: "Q^PARTY_TYPE_^S",
                    value: "org"
                  }, {
                    key: "Q^PARENT_ID_^S",
                    value: id
                  }
                ]
              }
              comnHttp.findDataByKey(param).then(res => {
                const depts = res.data.dataResult.map((value, i) => ({
                  value: value.ID_,
                  label: value.NAME_,
                  leaf: node.level >= 2
                }));
                // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                resolve(depts);
              }).catch(err => {
                console.log(err);
              });
            }
            if (node.level >= 2) {
              let param = {
                parameters: [
                  {
                    key: "key",
                    value: "bm"
                  }, {
                    key: "Q^DEPTH_^S",
                    value: 4
                  }, {
                    key: "Q^PARTY_TYPE_^S",
                    value: "org"
                  }, {
                    key: "Q^PARENT_ID_^S",
                    value: id
                  }
                ]
              }
              comnHttp.findDataByKey(param).then(res => {
                const depts = res.data.dataResult.map((value, i) => ({
                  value: value.ID_,
                  label: value.NAME_,
                  leaf: node.level >= 2
                }));
                // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                resolve(depts);
              }).catch(err => {
                console.log(err);
              });
            }
          }, 1000);

        }
      }
    };
  },
  methods: {
    handleChange (e) {
      this.$emit('selectHandle', e);
    }
  }
}
</script>