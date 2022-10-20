<template>
  <treeselect :options="options" :load-options="loadOptions" :disable-branch-nodes="true" v-model="selectId" />

</template>
<script>
import { LOAD_CHILDREN_OPTIONS, Treeselect } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import * as comnHttp from '@/api/cpApi/common/index';
export default {
  components: { Treeselect },
  data () {
    return {
      selectId: '10102001',
      options: []
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      let param = {
        parameters: [
          {
            key: "key",
            value: "gldxsx"
          }, {
            key: "Q^p_manage_obj_id^S",
            value: " "
          }
        ]
      }
      comnHttp.findDataByKey(param).then(res => {
        if (res.state == '200' && res.data != null && res.data.dataResult.length > 0) {
          res.data.dataResult.forEach(item => {
            var optionChildren = {
              id: item.manage_obj_id,
              label: item.manage_obj_name,
              children: null
            }
            this.options.push(optionChildren)
          })
        }
      })
    },
    loadOptions ({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        let param = {
          parameters: [
            {
              key: "key",
              value: "gldxsx"
            }, {
              key: "Q^p_manage_obj_id^S",
              value: parentNode.id
            }
          ]
        }
        comnHttp.findDataByKey(param).then(res => {
          if (res.state == '200' && res.data != null && res.data.dataResult.length > 0) {
            parentNode.children = []
            res.data.dataResult.forEach(item => {
              var optionChildren = {
                id: item.manage_obj_id,
                label: item.manage_obj_name,
                children: null
              }
              // if (item.leaf === true) {
              //   delete optionChildren.children; //有无子节点判断，树节点前面是否有箭头问题
              // }
              parentNode.children.push(optionChildren)
              callback()
            })
          }
        })
      }
    },
  },
}
</script>