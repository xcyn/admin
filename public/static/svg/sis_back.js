﻿var reqUrl = "../sis/diagram/showPointsValue.jhtml";//测点值请求地址
var checkUpdatePointUrl = "../sis/diagram/checkUpdatePoint.jhtml";//检测修改测点权限
var updatePointUrl = "../sis/diagram/updateSvgPoint.jhtml";//修改测点
var checkUpdatePointFlag = false;//是否需要检查修改测点权限 true:需要检查权限 false:不需要检查权限
var hasUpdatePointFlag = false;//是否有修改测点权限 true:有修改权限 false：无修改权限
var pointObjs = [];//测点jquery对象集
var noValidValue = -9999.0;//无效值

//默认参数
var defaultParams = {
		pointJsons: '',//测点json集合
		fronts:[],//测点前景样式 
		bgs:[]//测点背景样式
};

var rightMenu;//右键菜单对象
var updatePointBox;//修改测点窗口对象
var interval = 5;//定时数值，默认1秒
var sisInterval;//sis定时器
var pointnum = "2";//保留小数点位数
var fontSize = '10px';//字体大小 如果为空则默认为设计时的大小
var layerSkin = 'layui-layer-molv';//弹出框主题

/**
 * 获取测点数据并展示在页面上
 * 0：当前实时数据 1：快进 -1：后退
 */
function sis(res){	
	var dataJsonStr = '';
	if (res == null || res == 0) {//当前实时数据参数
		dataJsonStr = "json=" + defaultParams.pointJsons + "&res=" + res;
	} else if (res == 1) {//快进查询历史数据参数
		getHisTim();//获取快进时间
		dataJsonStr = "json=" + defaultParams.pointJsons + "&res=" + res + "&histemptim=" + histemptim;
	} else if (res == -1) {//后退查询历史数据参数
		getHisTim1();//获取后退时间
		dataJsonStr = "json=" + defaultParams.pointJsons + "&res=1" + "&histemptim=" + histemptim;
	}
	
	$.ajax({
		   type: "POST",
		   url: reqUrl + "?" + rnd(),
		   data: dataJsonStr,
		   dataType: "json",
		   success: function(json){	
			   console.log(json);
			   render(json);
		   },
		   error: function() {
			   render(null);
			   new jBox('Notice').setContent('<font color=red>服务器断开了,请联系管理员!</font>');
		   }
	});
}

/**
 * 将测点数据显示在页面上
 * @param pointValues 测点数据集
 */
function render(pointValues) { 	
	if(pointValues){
		for(var i = 0; i < pointObjs.length; i++){
			var $pointObj = pointObjs[i];
			var _value = pointValues[i].pointValue;//测点值
			var _time = pointValues[i].time;//测点时间
			var disc=pointValues[i].disc;//测点描述
			var _dt = $pointObj.attr("dt");//模拟量
			var _kt = $pointObj.attr("kt");//开关量
			var _hct = $pointObj.attr("hct");//柱子-横向
			var _vct = $pointObj.attr("vct");//柱子-纵向
			if(_dt){//模拟量
				var _fontColor = usevsdcolor ? '' : '#000000';//前景色
				var _bgColor = '';//背景色
				
				if(_time == '0' || _time == '1970-01-01 08:00:00'){//无效值判断
					_bgColor = 'yellow';//黄色
				}else{
					if(parseInt(_value) === parseInt(noValidValue)){//无效测点判断
						_value ="***";
						_bgColor = 'red';//红色
					}else{
						_value = parseFloat(_value).toFixed(pointnum);
					}
				}
				
				//设置显示数据
				var $pointText = $($pointObj.find("text")[0]);
				//_value=0.01
				/*for(var i=0;i<5-_value.length;i++){
					_value=' '+_value;
				}*/
				
				$pointText.attr("textcontent", _value).text(_value);//设置显示内容
				//$pointObj.attr("dc","#000000");
				if(_fontColor == ''){//设置前景色
					_fontColor = defaultParams.fronts[i].fill;//设置成默认前景色
				}
				$pointText.attr("fill", _fontColor);//设置字体颜色
					
				if(fontSize != ''){
					$pointText.attr("font-size", fontSize);//设置字体大小
				}
				//$pointText.attr("font-size-adjust", "inherit");
				$pointText.attr("font-weight", "900");
				//$pointText.attr("font-family", "Times New Roman");//设置字体
				//$pointText.attr("title", '测点:'+_dt+' 值：'+ _value);//设置提示
				//$pointText.attr("title", '测点:'+disc+'_'+_dt+' 值：'+ _value);//设置提示
				$pointText.attr("title", '测点:'+disc+'_'+' 值：'+ _value);//设置提示
				
				//设置背景颜色
				var $pointRect = $($pointObj.find("rect")[0]);
				var $pointText = $($pointObj.find("text")[0]);
				if(_bgColor == ''){
					_bgColor = defaultParams.bgs[i].fill;//设置成默认背景色
				}
				//$pointRect.attr("fill", _bgColor);//设置背景颜色
				//$pointText.attr("bg-colur", _bgColor);//设置背景颜色
			}else if(_kt){//开关量
				var _kr = $pointObj.attr('kr');//值范围
				var jval = null;//开始值
				var kval = null;//结束值
				var flag = null;//是否显示标识
				if (_kr) {//获取范围
					var arrmp = (_kr).split(",");
					jval = arrmp[0];
					kval = arrmp[1];
				}
				var par = $pointObj[0];//当前节点
				var pointvalue = parseFloat(_value).toFixed(pointnum);
				//$pointObj.attr("title", '测点:'+disc+"_"+_kt+' 值：'+ pointvalue);//设置提示
				$pointObj.attr("title", '测点:'+disc+"_"+' 值：'+ pointvalue);//设置提示
				if (!isNaN(jval) == true && !isNaN(kval) == true) {
					if (pointvalue >= parseFloat(jval) && pointvalue <= parseFloat(kval)) {
						flag = true;
					} else {
						flag = false;
					}
				} else if (jval == "-" && !isNaN(kval) == true) {// -<pointvalue<=kval 即当前值在kval和负无穷的区间内
					if (pointvalue <= parseFloat(kval)) {
						flag = true;
					} else {
						flag = false;
					}
				}  else if (kval == "-" && !isNaN(jval) == true) {// jval<pointvalue<=- 即当前值在kval和正无穷的区间内
					if (pointvalue >= parseFloat(jval)) {
						flag = true;
					} else {
						flag = false;
					}
				} else if (!isNaN(jval) == true && !isNaN(kval) == false) {
					if (pointvalue == parseFloat(jval)) {
						flag = true;
					} else {
						flag = false;
					}
				} else if (!isNaN(jval) == false && !isNaN(kval) == true) {
					if (pointvalue == parseFloat(kval)) {
						flag = true;
					} else {
						flag = false;
					}
				} else if (!isNaN(jval) == false && !isNaN(kval) == false) {
					flag = false;
				}
				if (flag == true) {//显示
					par.style.display = "";
				} else {//隐藏
					par.style.display = "none";
				}
			}else if(_hct){
			//更新柱状图-横向

				var $rect = $pointObj.find('rect');

				// 保存初始值-横向,只保存宽度信息
				if($rect.attr('totalWidth')==undefined){
				    // 设置默认值
				    $rect.attr('totalWidth',$rect.attr('width'));
				    $rect.attr('totalX',$rect.attr('x'));
				}
				// 最新值
				var pointvalue = parseFloat(_value).toFixed(pointnum);
				//$pointObj.attr("title", '测点:'+disc+"_"+_hct+' 值：'+ pointvalue);//设置提示
				$pointObj.attr("title", '测点:'+disc+"_"+' 值：'+ pointvalue);//设置提示
				// 范围
				var range = $pointObj.attr('hrg');
				var lowerValue = Number(range.split(',')[0]);
				var upperValue = Number(range.split(',')[1]);
				//如果最小值比最大值大，则重新进行转换赋值
				//if(lowerValue > upperValue)
				//{
				//	var ll = upperValue;
				//	upperValue = lowerValue;
				//	lowerValue = ll;
				//}
				var percent = (pointvalue - lowerValue)/(upperValue - lowerValue);

				// 横向-根据值更改宽度
				var totalWidth = Number($rect.attr('totalWidth'));
				var totalX = Number($rect.attr('totalX'));

				// 宽度变换方向:0=>向右 1=>向左
				var direct = $pointObj.attr('hflip')+'';// String
				var toWidth = totalWidth * percent;

				if(direct == '0'){
					$rect.attr('x', totalX);
					$rect.attr('width', toWidth);
				}else{
					$rect.attr('x', totalX+totalWidth-toWidth);
					$rect.attr('width', toWidth);
				}
			}else if(_vct){
			//更新柱状图-纵向

				var $rect = $pointObj.find('rect');

				// 保存初始值-纵向,只保存高度信息
				if($rect.attr('totalHeight')==undefined){
				    // 设置默认值
				    $rect.attr('totalHeight',$rect.attr('height'));
				    $rect.attr('totalY',$rect.attr('y'));
				}
				// 最新值
				var pointvalue = parseFloat(_value).toFixed(pointnum);
				//$pointObj.attr("title", '测点:'+disc+"_"+_vct+' 值：'+ pointvalue);//设置提示
				$pointObj.attr("title", '测点:'+disc+"_"+' 值：'+ pointvalue);//设置提示
				// 范围
				var range = $pointObj.attr('vrg');
				var lowerValue = Number(range.split(',')[0]);
				var upperValue = Number(range.split(',')[1]);
				//如果最小值比最大值大，则重新进行转换赋值
				//if(lowerValue > upperValue)
				//{
					//var ll = upperValue;
					//upperValue = lowerValue;
					//lowerValue = ll;
				//}
				var percent = (pointvalue - lowerValue)/(upperValue - lowerValue);

				// 纵向-根据值更改高度
				var totalHeight = Number($rect.attr('totalHeight'));
				var totalY = Number($rect.attr('totalY'));

				// 高度变换方向:0=>向下 1=>向上
				var direct = $pointObj.attr('vflip')+'';// String
				var toHeight = totalHeight * percent;
				if(direct == '0'){
					$rect.attr('y', totalY);
					$rect.attr('height', toHeight);
				}else{
					$rect.attr('y', totalY+totalHeight-toHeight);
					$rect.attr('height', toHeight);
				}
			}
			
		}
	}else{//错误提示
		for(var i = 0; i < pointObjs.length; i++){
			var $pointObj = pointObjs[i];
			var _dt = $pointObj.attr("dt");//模拟量
			if(_dt){//模拟量
				var _value = '失去连接';
				//设置显示数据
				var $pointText = $($pointObj.find("text")[0]);
				$pointText.attr("textcontent", _value).text(_value);//设置显示内容
				$pointText.attr("fill", "#fff");//设置字体颜色
				if(fontSize != ''){
					$pointText.attr("font-size", fontSize);//设置字体大小
				}
				//$pointText.attr("font-family", "Times New Roman");//设置字体
				$pointText.attr("title", '测点：'+$pointObj.attr("dt"));//设置提示
				//设置背景颜色
				var $pointRect = $($pointObj.find("rect")[0]);
				$pointRect.attr("fill", "red");//设置背景颜色
			}
		}
	}
} 

/**
 * 检查修改测点权限并进行控制
 */
function checkUpdatePoint(){
	if(!checkUpdatePointFlag){//不需要控制测点修改权限
		hasUpdatePointFlag = true;
		return;
	}
	$.ajax({
		   type: "POST",
		   url: checkUpdatePointUrl,
		   data: {},
		   dataType: "json",
		   success: function(res){
			   if (res != null && res != undefined) {
				   if(res.flag == 1){//有修改权限
					   hasUpdatePointFlag = true;
				   }else{//没有修改权限
					   hasUpdatePointFlag = false;
				   }
				   
			   }
		   },
		   error: function() {
			   hasUpdatePointFlag = false;
		   }
	});
}

/**
 * 修改测点操作
 * @param nowpoint 当前测点
 * @param gId 当前测点所在节点id
 */
function updatePoint(nowpoint, gId){
	layer.confirm('你确定要修改吗？', {
	  skin: layerSkin, //样式类名
	  icon: 3, title:'提示',
	  btn: ['是', '否']
	}, function(index){
		$.ajax({
			   type: "POST",
			   url: updatePointUrl,
			   data: {oldPoint: nowpoint, newPoint:$('#newPointName').val(), gId: gId, htmlUrl:window.location.href},
			   dataType: "json",
			   success: function(data){
				   if(data.flag == 1){
					   layer.alert('修改成功!', {skin: layerSkin,icon: 1}, function(index){
						   if(window.location.href.indexOf("?") == -1){
							   window.location.href = window.location.href + "?r" + parseInt(Math.random()*100);
						   }else{
							   window.location.href = window.location.href + "&r" + parseInt(Math.random()*100);
						   }
					   });
				   }else if(data.flag == 2){
						layer.alert('源文件找不到旧测点,请刷新页面再进行操作!', {skin: layerSkin,icon: 0}, function(index){
							if(window.location.href.indexOf("?") == -1){
								   window.location.href = window.location.href + "?r" + parseInt(Math.random()*100);
							}else{
							   window.location.href = window.location.href + "&r" + parseInt(Math.random()*100);
							}
						});
				   }else{
						layer.alert('修改失败!', {skin: layerSkin,icon: 2}, function(index){
							layer.close(index);
						});
				   }
			   },
			   error: function() {
					layer.alert('修改异常!', {skin: layerSkin,icon: 2}, function(index){
						layer.close(index);
					});
			   }
		});
		
	  }
	,function(index){
		layer.close(index);
	});
}


/**
 * 随机数
 * @returns {Number}
 */
function rnd(){
  return (new Date().getTime() * 9301 + 49297) % 233280 / (233280.0);
}

// 是否等比缩放
var uniformScale = false;
// 是否使用visio文件内配置的颜色
var usevsdcolor = true;
/**
 * 设置svg为全屏
 */
function fullScreenSvg(){
	if(uniformScale){
		// 填充整个界面为svg的背景色
		$($('body')[0]).css('backgroundColor',$($('rect')[0]).attr('fill'));
		// 背景边框设置为与背景色相同
		$($('rect')[0]).attr('stroke', $($('rect')[0]).attr('fill'));
		var _w = $(window).width(),
			_h = $(window).height();
		// $($('body')[0]).css('width', _w);
		// $($('body')[0]).css('height', _h);
		// 1:设置svg视区大小
		var svg = $('svg')[0];
		// svg.style.height = _w;
		// svg.style.width = _h;
		// 2:设置svg viewbox ，viewbox满足16:9缩放比例
		// 2.1:获取svg内容实际大小 
		var _svgw = $($('rect')[0]).attr('width'),
			_svgh = $($('rect')[0]).attr('height');

		$('svg')[0].setAttribute('viewBox','0 0 '+_svgw+' '+_svgh);
		// 2.2:判断svg内容实际的宽高比例与16:9比例的大小
		// 需要放大高度
		var fixHeight = _svgw / _svgh > 16 / 9;
		var scaleX = 1;
		var scaleY = 1;
		if(fixHeight){
			// 高度缩放比例
			scaleY = (_svgw * 9 / 16) / _svgh;
			$($('svg')[0]).css('-webkit-transform','scale(1,'+scaleY+')');
		}else{
			// 宽度缩放比例
			scaleX = (_svgh * 16 / 9) / _svgw;
			$($('svg')[0]).css('-webkit-transform','scale('+scaleX+',1)');
		}
		// SVG缩放后的宽高
		var widhtAfterScale = _svgw*scaleX;
		var heightAfterScale = _svgh*scaleY;

		$(svg).css('width',widhtAfterScale);
		svg.style.width=widhtAfterScale;

		$(svg).css('height',heightAfterScale);
		svg.style.height=heightAfterScale;

		var svgScale = Math.min(_w/widhtAfterScale, _h/heightAfterScale);
		//$($('svg')[0]).css('-webkit-transform','scale('+scaleX+',1)');
		$('#svgContainer').css('width', widhtAfterScale);
		$('#svgContainer').css('height', heightAfterScale);
		// $('#svgContainer').css('-webkit-transform','scale('+svgScale+','+svgScale+')');
		scaleSvgContianer(svgScale);
		// 设置页面默认缩放大小
		currentScaleFactor = 1;
		defaultScale = svgScale;

		defaultLeft = -widhtAfterScale*svgScale/2 + 'px';
		defaultTop = -heightAfterScale*svgScale/2 + 'px';
		$('#svgContainer').css('top',  '50%');
		$('#svgContainer').css('left', '50%');
		$('#svgContainer').css('margin-left',  defaultLeft);
		$('#svgContainer').css('margin-top', defaultTop);
	}else{
		var svg = $('svg')[0];
		//svg.style.height = document.body.clientHeight;
		//svg.style.width = document.body.clientWidth+15;
		$(svg).css('height',$(window).height());
		$(svg).css('width',$(window).width()+15);
		//svg.style.height = $(window).height();
		//svg.style.width = $(window).width()+15;
		svg.setAttribute('preserveAspectRatio', 'none');//拉伸模式，参考文章：http://www.w3cplus.com/html5/svg-coordinate-systems.html
	}
}
function scaleSvgContianer(scale){
	$('#svgContainer').css('transform', 'scale('+scale+','+scale+')');
	$('#svgContainer').css('-ms-transform', 'scale('+scale+','+scale+')');
	$('#svgContainer').css('-webkit-transform', 'scale('+scale+','+scale+')');
	$('#svgContainer').css('-moz-transform', 'scale('+scale+','+scale+')');
	$('#svgContainer').css('-o-transform', 'scale('+scale+','+scale+')');
}

/**
 * 创建火图片
 **/
function createFires(){
	// 查找火图形
	var fires = $('g[name^="火"]');
	$.each(fires,function(k,v){
		var fire = $(v);
		console.log(fire);
		var fireId = fire.attr('id');
		var transform = fire.attr('transform');
		var properties = transform.split(" ");
		var fireX = properties[1];
		var fireY = properties[2].split(')')[0];
		var fireRotate = properties[0].split('(')[1];
		// 添加对应图片
		appendFireImage(fireId, fireX, fireY, fireRotate);

	});
}

/**
 * 添加图片
 **/
function appendFireImage(fireId, fireX, fireY, fireRotate){
	var img = document.createElementNS('http://www.w3.org/2000/svg','image');
		img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'pattern-fire.png');
		img.setAttribute('id','fireImage-'+fireId);
		img.setAttribute('x',fireX-50/2);
		img.setAttribute('y',fireY-50/2);
		img.setAttribute('width','50');
		img.setAttribute('height','50');
		img.setAttribute('transform','rotate('+(fireRotate-45)+' '+(fireX+50/2)+' '+(fireY+50/2)+')');
		img.setAttribute('d-rotate',fireRotate);
		document.getElementsByTagName('svg')[0].appendChild(img);
}

window.onresize = function(){
	fullScreenSvg();//设置svg为全屏
}

/**
 * 设置字体为0
 **/
function miniDom(){
	$('*').each(function(k,v){
		var fontSize = Number($(v).attr('font-size'));
		if(fontSize<4){
			$(v).attr('font-size','0');
		}
	})
}
function setWidth(){
	
}
//入口
$(function(){
	if(uniformScale)
		$('svg').wrap('<div id="svgContainer"></div>');
	fullScreenSvg();//设置svg为全屏
	
	createFires();//创建火图片

	//处理关于会出现多余符号的原因
	miniDom();
	//var fixitems = $("[font-size='1']");
	//$.each(fixitems,function(k,v){
	//    $(v).attr('font-size','0');
	//});
	//var fixitems = $("[font-size='2']");
	//$.each(fixitems,function(k,v){
	//    $(v).attr('font-size','0');
	//});
	
	var isHasPoint = false;//是否有测点 默认没有
	//遍历所有节点并找出所有的测点
	$("g").each(function(i){
		var $g = $(this);
		var _dt = $g.attr("dt");//模拟量
		var _kt = $g.attr("kt");//开关量
		var _url = $g.attr('url');//链接
		var _hct = $g.attr("hct");//柱子-横向
		var _vct = $g.attr("vct");//柱子-纵向
		if(_dt){//模拟量
			/*$g.css({cursor: 'pointer'}).click(function(){
				new jBox('Notice').setContent($($(this).find("text")[0]).attr('title'));
				alert("test");
			});*/
			$g.css({cursor: 'pointer'}).click(function(){
				 var currentSelectedPoint = $(this).attr('dt');
            	 var cookiePointNames = $.cookie("cookiePointNames");//已选取的测点   
    	    	  if(cookiePointNames == null || cookiePointNames.indexOf(currentSelectedPoint+";") == -1){
    	    		  cookiePointNames = (cookiePointNames==null?'':cookiePointNames)+currentSelectedPoint+';';
    	    		  $.cookie("cookiePointNames",cookiePointNames , {path: '/'} );//将测点放置cookie
    	    	  }
    	    	  new jBox('Notice').setContent('你选取了测点：'+currentSelectedPoint);
    	    	 // alert("test");
			});
			pointObjs.push($g);
			$g.attr("class", 'point');
			//测点前景默认样式
			var $pointText = $($g.find("text")[0]);
			$pointText.attr('class', 'tooltipx');//设置提示样式
			$pointText.attr('dt', _dt);//设置测点
			defaultParams.fronts.push({fill:$pointText.attr("fill")});
			//测点背景默认样式
			var $pointRect = $($g.find("rect")[0]);
			$pointRect.attr('dt', _dt);//设置测点
			defaultParams.bgs.push({fill:$pointRect.attr("fill")});
			
			defaultParams.pointJsons += "{\"pointname\":\"" + _dt + "\"},";
			isHasPoint = true;
		}else if(_kt){//开关量
			pointObjs.push($g);
			$g.css({cursor: 'pointer'}).click(function(){
				new jBox('Notice').setContent($(this).attr('title'));
			});
			$g.attr('class', 'tooltipx');//设置提示样式
			defaultParams.fronts.push({fill:null});
			defaultParams.bgs.push({fill:null});
			defaultParams.pointJsons += "{\"pointname\":\"" + _kt + "\"},";
			isHasPoint = true;
		}else if(_url){//链接
			$g.css({cursor: 'pointer'}).click(function(){
				window.location.href=$(this).attr('url');
			});
		} else if(_hct){//柱子-横向
			pointObjs.push($g);
			$g.attr('class', 'tooltipx');//设置提示样式
			defaultParams.fronts.push({fill:null});
			defaultParams.bgs.push({fill:null});
			defaultParams.pointJsons += "{\"pointname\":\"" + _hct + "\"},";
			isHasPoint = true;

		}else if(_vct){//柱子-纵向
			pointObjs.push($g);
			$g.attr('class', 'tooltipx');//设置提示样式
			defaultParams.fronts.push({fill:null});
			defaultParams.bgs.push({fill:null});
			defaultParams.pointJsons += "{\"pointname\":\"" + _vct + "\"},";
			isHasPoint = true;

		}
	});
	
	if(isHasPoint){//页面包含有测点
		
		defaultParams.pointJsons = "[" + defaultParams.pointJsons.substring(0, defaultParams.pointJsons.length - 1) + "]";
		if (defaultParams.pointJsons.length <= 10){
			defaultParams.pointJsons = "[{pointname\":\"pointname\"}]";
		}
		
		sis();//获取测点数据
	    sisInterval = window.setInterval('sis()', parseInt(interval) *1000);//启动定时器,间隔调用获取测点数据
		
		initPlayPlugin();//初始化播放组件
		checkUpdatePoint();//检查修改测点权限并进行控制
		$('.tooltipx').jBox('Tooltip');//设置测点提示
		initRightMenuPlugin();//初始化右键菜单，请注意该初始化必须放到遍历节点之后
	}
	
});
