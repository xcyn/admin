<template>
  <vxe-modal v-model="visible" :title="title" :width="width" :height="height" resize remember>
	<slot />
  </vxe-modal>
</template>

<script>
import 'vxe-table/lib/style.css';
import Vue from 'vue';
import 'xe-utils';
import VXETable from 'vxe-table';

Vue.use(VXETable);

export default {
    name: '录入弹出框',
	props: {
	    title: {
	        type: String,
	        default: ''
	    },
		height:{
			type:String
		},
		width:{
			type:String
		}
	},
	data() {
	  return {
		 visible:false
	  }
	},mounted() {
		
	},methods:{
		close(){
			this.visible = false;
		},
		open(){
			this.visible = true;
		}
	}
}
</script>

<style>
</style>
