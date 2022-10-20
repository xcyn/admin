(function($) {
	$.getUrlParam = function(name){
		try{
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.dialogArguments.value.substr(1).match(reg);
			if (r != null) {
				//return unescape(r[2]);
				return decodeURI(r[2]);   //替换unescape 为 decodeURI   解决中文乱码问题 
			}
		}catch(e) {
			return null;
		}
		
		return null;
	};
})(jQuery);