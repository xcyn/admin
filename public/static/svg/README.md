基于svg组态图产品

核心js：sis.js


【已完成】
	组态图展示
	实时数据显示
	测点信息
	历史回放
	放大/缩小
	选取测点
	支持多个测点选取和一键清除功能

【未完成】
	弹出框IE9兼容性问题
	
	
【遗留问题】
	一、IE9兼容性问题
		1、弹出框无法显示问题
			解决方案：
				在页面末尾加上如下代码(此方法比较拙劣，不知道为什么需要这样处理)：
				<script src="../svg/plugins/layui/layui.js" charset="utf-8"></script>
				<script>
				layui.use(['form'], function(){});
				</script>
		2、右键显示超过页面问题