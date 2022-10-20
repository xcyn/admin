var pointRightMenuPointData = [{
    text: "测点信息",
    func: function() {
		var mes;
   	 	var currentSelectedPoint = $(this).attr('dt') ;
   	 	if(currentSelectedPoint){
			var  tt=$(this).find("text:eq(0)").attr('name');
		 	mes=tt.split(',');
		}else if( $(this).attr('kt')){
			currentSelectedPoint = $(this).attr('kt');
			var  tt=$(this).attr('name');
		 	mes=tt.split(',');
		}
		var rtm_point=mes[0];
		var desc=mes[1];
		var value=mes[2];
		var time=mes[3];
		/*  if(currentSelectedPoint=='undefined'||currentSelectedPoint==null){
			currentSelectedPoint =$(this).attr('title')+':'+ $(this).attr('kt');
			//currentSelectedPoint =$(this).attr('kt');
		}
		else {
			//currentSelectedPoint=currentSelectedPoint+':'+$(this).attr('title');
		} */
	  	layer.open({
	  	  type: 1,
	  	  skin: layerSkin, //样式类名
	  	  title: '测点信息',
	  	  area: ['500px', '400px'],
	  	  content: '<form class="layui-form" action="" onsubmit="return false;"> '+
	  		 ' <div class="layui-form-item"> <label class="layui-form-label">测点描述:</label> <div class="layui-input-block" style="line-height:36px;">'+desc+'</div> </div> '+
	  		 '<div class="layui-form-item"> <label class="layui-form-label">测点编码:</label> <div class="layui-input-block" style="line-height:36px;">'+currentSelectedPoint+'</div> </div>'+
	  		'<div class="layui-form-item"> <label class="layui-form-label">采集编码:</label> <div class="layui-input-block" style="line-height:36px;">'+rtm_point+'</div> </div>'+
	  		 '<div class="layui-form-item"> <label class="layui-form-label">测点时间:</label> <div class="layui-input-block" style="line-height:36px;">'+time+'</div> </div>'+
	  		 '<div class="layui-form-item"> <label class="layui-form-label">测点值:</label> <div class="layui-input-block" style="line-height:36px;">'+value+'</div> </div>'+
	  		'</form>'
	  	});
    }
}];

/**
 * 页面右键配置
 */
var bodyRightMenuData = [
    [{
        text: "过程回放",
        func: function() {
        	showProcessPlaybackDialog();//显示过程回放弹出框
        }
    }, {
        text: "刷新页面",
        func: function() {
        	location.href=location.href;
        }
    }]/* ,[{
        text: "页面缩放",
        data: [[{
            text: "放大",
            func: function() {
            	zoom(1);
            }
        }, {
            text: "缩小",
            func: function() {
            	zoom(-1);
            }
        }, {
            text: "还原",
            func: function() {
            	zoom(0);
            }
        }]]
    }] */,[{
        text: "在新窗口打开",
        func: function() {
			//alert(append_url);
		  	window.open(window.location.href+append_url, '_blank');
        }
    }],[{
        text: "帮助",
        func: function() {
		  	var index = layer.open({
		  	  type: 2,
		  	  skin: layerSkin, //样式类名
		  	  title: '帮助',
		  	  area: ['600px', '400px'],
		  	  content: sisRootPath+'help.html'
		  	});
        }
    }]
];

var cameraRightMenuData = [
	[{
		text: "查看视频",
		func:function(){
			var _kt = $(this).attr('kt');
			var cameraCode ;
			if(_kt != null && _kt.indexOf(CAMERA_PREFIX) == 0 ){   //摄像头
				cameraCode = _kt.substr(7);
				_kt = null;
			}

			/* if(_kt != null && _kt.indexOf(VDS_PREFIX) == 0 ){   //视频
				cameraCode = _kt.substr(4);
				_kt = null;
			} */

			//alert('cameraCode = '+cameraCode);
			//if( getQueryString('api_url') == null || getQueryString('api_url') == undefined ){
			if(window.opener == null ){    //判断当前页面是否是 window.open 打开的
				var win = window.open(window.location.href+append_url, '_blank');  //不是新窗口打开的，就需要先打开新窗口， 因为视频插件不能放在iframe 下
				win.onload = function(){
					win.showVideo();
				}

				win.setTimeout(function(cameraCode){
					//win.alert('22='+cameraCode);
					//win.startPreview(cameraCode);
					win.initPlugin(1, {cameraCode:cameraCode});
				}, 3000, cameraCode);   //延迟加载，防止视频控件还没加载好

				/* win.onload = (function(cameraCode){
					//win.alert('init');
					//;
					//win.showVideo();
					win.showVideo3();
					//win.alert('00=');
					//win.alert('11='+cameraCode);
					win.setTimeout(function(cameraCode){
						//win.alert('22='+cameraCode);
						win.startPreview(cameraCode);
					}, 1500, cameraCode);   //延迟加载，防止视频控件还没加载好
					//win.alert('33='+cameraCode);

				})(cameraCode); */
			}else{
				showVideo();
				//startPreview(cameraCode);
				initPlugin(1, {cameraCode:cameraCode});
			}
		}
	}],[{
		text: "视频回放",
		func:function(){
			var _kt = $(this).attr('kt');
			var cameraCode ;
			if(_kt != null && _kt.indexOf(CAMERA_PREFIX) == 0 ){   //摄像头
				cameraCode = _kt.substr(7);
				_kt = null;
			}

			/* if(_kt != null && _kt.indexOf(VDS_PREFIX) == 0 ){   //视频
				cameraCode = _kt.substr(4);
				_kt = null;
			} */

			let endTime = resolvingDate(new Date());
			let date = new Date();
			date.setDate(date.getDate()-30);
			let startTime = resolvingDate(date);

			//alert('cameraCode = '+cameraCode);
			if( getQueryString('api_url') == null || getQueryString('api_url') == undefined ){
				var win = window.open(window.location.href+append_url, '_blank');  //不是新窗口打开的，就需要先打开新窗口， 因为视频插件不能放在iframe 下
				win.onload = function(){
					win.showBackVideo();
				}

				win.setTimeout(function(cameraCode){
					win.initPluginBack(1, {cameraCode:cameraCode, startTime:startTime, endTime:endTime});
				}, 3000, cameraCode);   //延迟加载，防止视频控件还没加载好

			}else{
				showBackVideo();
				//startPreview(cameraCode);
				initPluginBack(1, {cameraCode:cameraCode, startTime:startTime, endTime:endTime});
			}
		}
	}]
];

var vdsRightMenuData = [
	[{
		text: "查看视频",
		func:function(){
			let _kt = $(this).attr('kt');
			let cameraCode ;

			if(_kt != null && _kt.indexOf(VDS_PREFIX) == 0 ){   //视频
				cameraCode = _kt.substr(4);
				_kt = null;
				parent.openCamera(cameraCode);
			}


		}
	}],[{
		text: "视频回放",
		func:function(){
			let endTime = resolvingDate(new Date());
			let date = new Date();
			date.setDate(date.getDate()-30);
			let startTime = resolvingDate(date);

			let _kt = $(this).attr('kt');
			let cameraCode ;

			if(_kt != null && _kt.indexOf(VDS_PREFIX) == 0 ){   //视频
				cameraCode = _kt.substr(4);
				_kt = null;
				parent.openCameraBack(cameraCode, startTime, endTime);
			}

		}
	}],
	[{
		text: "查看告警",
		func:function(){
			let _kt = $(this).attr('kt');
			let cameraCode ;

			if(_kt != null && _kt.indexOf(VDS_PREFIX) == 0 ){   //视频
				cameraCode = _kt.substr(4);
				_kt = null;
				parent.openAlarmDraw(cameraCode);
			}

		}
	}]
];

function resolvingDate(d) {
	let month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
	let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
	let hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
	let min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
	let sec = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
	let times = d.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + sec;
	return times;
}

var alarmMenuData = [{
	text: "查看告警",
	func:function(){

		var currentSelectedPoint = $(this).attr('dt');
		if(currentSelectedPoint=='undefined'||currentSelectedPoint==null){
			currentSelectedPoint = $(this).attr('kt');
		}
		//如果是技术参数，需要根据 技术参数编码和 设备编码反查测点信息（多个值）

		if(currentSelectedPoint != null && currentSelectedPoint.indexOf(TP_PREFIX) == 0){
			var _tp ; //技术参数
			_tp = currentSelectedPoint.substr(3);

			$.ajax({
				type: "POST",
				url: api_url+CALCULATION_URL +reqTpPointUrl,
			   // data: dataJsonStr,
				contentType: 'application/json',
				data: JSON.stringify({"tpNo":_tp,"locaNo":locaNo}),
				dataType: "json",
				success: function(response){
					let data =response.data;
					let points = "";
					for(let i=0; i<data.length;i++){
						if(i != 0){
							points +=",";
						}
						points+=data[i].mpNo;
					}
					window.parent.amAlarm(points);

				},
				error: function(e) {
					console.log(e);
				}
			 });

		}else if(currentSelectedPoint != null && currentSelectedPoint.indexOf(IND_PREFIX) ==0){
			var _ind; //指标
			_ind = currentSelectedPoint.substr(4);

			//如果是指标编码，需要链接到 指标告警页面
			window.parent.imAlarm(indicatorNo, timeTypeNo);

		}else if(currentSelectedPoint != null && currentSelectedPoint.indexOf(IMEXP_PREFIX) ==0){
			var _imexp; //指标表达式
			_imexp = currentSelectedPoint.substr(6);

			//根据指标表达式查询指标告警信息
			window.parent.imAlaramByExpressId(_imexp);
		}else if(currentSelectedPoint != null && currentSelectedPoint.indexOf(AREA_PREFIX) ==0){
			var _area; //区域
			_area = currentSelectedPoint.substr(5);

			//根据区域编码查询区域告警信息
			window.parent.openAreaDraw(_area);
		}else if(currentSelectedPoint != null && currentSelectedPoint.indexOf(ALARM_PREFIX) ==0){
			var _alarm; //区域告警
			_alarm = currentSelectedPoint.substr(6);

			//根据区域编码查询区域告警信息
			window.parent.openAreaDraw(_alarm);
		}else if(currentSelectedPoint != null && currentSelectedPoint.indexOf(DOOR_PREFIX) ==0){
			var _door; //门禁告警
			_door = currentSelectedPoint.substr(5);

			//根据门禁编码查询区域告警信息
			window.parent.openAlarmDraw(_door);
		}else{
			//测点
			window.parent.amAlarm(currentSelectedPoint);
		}


	}
}]

var  trendMenuData = [{
	text: "过程趋势",
	data: [[{
		text: "查看趋势",
		func: function() {
		   var currentSelectedPoint = $(this).attr('dt');
		   if(currentSelectedPoint=='undefined'||currentSelectedPoint==null){
			   currentSelectedPoint = $(this).attr('kt');
		   }
		   //如果是技术参数，需要根据 技术参数编码和 设备编码反查测点信息（多个值）

		   if(currentSelectedPoint != null && currentSelectedPoint.indexOf(TP_PREFIX) == 0){
			   var _tp ; //技术参数
			   _tp = currentSelectedPoint.substr(3);

			   $.ajax({
				   type: "POST",
				   url: api_url+CALCULATION_URL +reqTpPointUrl,
				  // data: dataJsonStr,
				   contentType: 'application/json',
				   data: JSON.stringify({"tpNo":_tp,"locaNo":locaNo}),
				   dataType: "json",
				   success: function(response){
					   let data =response.data;
					   let points = "";
					   let point = "";
					   for(let i=0; i<data.length;i++){
						   if(i ==0){
							   point = data[i].mpNo;
						   }
						   if(i != 0){
							   points +=";";
						   }
						   points+=data[i].mpNo;
					   }
					   //localStorage.setItem('CALCULATION_URL',CALCULATION_URL1);
					   //localStorage.setItem('api_url',api_url);
					   //从localStorage获取缓存数据,前面vue页面已经设置过了
					  // window.open('/static/trend/index.html?nowpoint='+points, '_blank');
					   //window.open('../trend/index.html?nowpoint='+points+'&CALCULATION_URL='+CALCULATION_URL+'&api_url='+api_url, '_blank', 'alwaysRaised=yes,z-look=yes');
					   window.parent.mpAnalysis(point);  //新版 测点趋势，传入一个测点
				   },
				   error: function(e) {
					   console.log(e);
				   }
				});

		   }else if(currentSelectedPoint != null && currentSelectedPoint.indexOf(IND_PREFIX) ==0){
			   var _ind; //指标
			   _ind = currentSelectedPoint.substr(4);

			   //如果是指标编码，需要链接到 单指标分析页面
			   window.parent.indicatChart();
			   //window.parent.postMessage({},'*');

		   }else if(currentSelectedPoint != null && currentSelectedPoint.indexOf(IMEXP_PREFIX) ==0){
			   var _imexp; //指标表达式
			   _imexp = currentSelectedPoint.substr(6);

			   //TODO:
		   }else{
			   //测点
			   //window.open('../trend/index.html?nowpoint='+currentSelectedPoint+'&CALCULATION_URL='+CALCULATION_URL+'&api_url='+api_url, '_blank', 'alwaysRaised=yes,z-look=yes');
			  // window.open('../trend/index.html?nowpoint='+currentSelectedPoint, '_blank', 'z-look=yes');

			   window.parent.mpAnalysis(currentSelectedPoint);
		   }

		}
	}]]
}]

var areaRightMenuData = [
	[{
		text: "测点管理",
		data: [pointRightMenuPointData]
	}],[{
		text: "复制测点",
		func:function(){
			var currentSelectedPoint = $(this).attr('dt');
//        	 copyToClipboard(currentSelectedPoint);
			copyToClip(currentSelectedPoint);
		}
	}]
	,alarmMenuData
];

var alarmRightMenuData = [
	[{
		text: "测点管理",
		data: [pointRightMenuPointData]
	}],[{
		text: "复制测点",
		func:function(){
			var currentSelectedPoint = $(this).attr('dt');
//        	 copyToClipboard(currentSelectedPoint);
			copyToClip(currentSelectedPoint);
		}
	}]
	,alarmMenuData
];

var doorRightMenuData = [
	[{
		text: "测点管理",
		data: [pointRightMenuPointData]
	}],[{
		text: "复制测点",
		func:function(){
			var currentSelectedPoint = $(this).attr('dt');
//        	 copyToClipboard(currentSelectedPoint);
			copyToClip(currentSelectedPoint);
		}
	}]
	,alarmMenuData
];

let piRightMenuData = [
	[{
		text: "测点信息",
		func: function() {
			var mes;
			var currentSelectedPoint;
			if ($(this).attr('PBD:PtTagName')){
				let _pi = $(this).attr('PBD:PtTagName');
				currentSelectedPoint = _pi.replace("\\\\172.28.0.18\\", "")
				var tt = $(this).find("text:eq(0)").attr('name');
				mes = tt.split(',');
			}
			var rtm_point=mes[0];
			var desc=mes[1];
			var value=mes[2];
			var time=mes[3];
			  layer.open({
				type: 1,
				skin: layerSkin, //样式类名
				title: '测点信息',
				area: ['500px', '400px'],
				content: '<form class="layui-form" action="" onsubmit="return false;"> '+
				   ' <div class="layui-form-item"> <label class="layui-form-label">测点描述:</label> <div class="layui-input-block" style="line-height:36px;">'+desc+'</div> </div> '+
				   '<div class="layui-form-item"> <label class="layui-form-label">测点编码:</label> <div class="layui-input-block" style="line-height:36px;">'+currentSelectedPoint+'</div> </div>'+
				  '<div class="layui-form-item"> <label class="layui-form-label">采集编码:</label> <div class="layui-input-block" style="line-height:36px;">'+rtm_point+'</div> </div>'+
				   '<div class="layui-form-item"> <label class="layui-form-label">测点时间:</label> <div class="layui-input-block" style="line-height:36px;">'+time+'</div> </div>'+
				   '<div class="layui-form-item"> <label class="layui-form-label">测点值:</label> <div class="layui-input-block" style="line-height:36px;">'+value+'</div> </div>'+
				  '</form>'
			  });
		}
	}],[{
		text: "复制测点",
		func:function(){
			var currentSelectedPoint = $(this).attr('PBD:PtTagName');
//        	 copyToClipboard(currentSelectedPoint);
			copyToClip(currentSelectedPoint);
		}
	}]
	,[{
		text: "查看趋势",
		func: function() {
		    var currentSelectedPoint = $(this).attr('PBD:PtTagName');
			currentSelectedPoint = currentSelectedPoint.replace("\\\\172.28.0.18\\", "")
			window.parent.mpAnalysis(currentSelectedPoint);

		}
	}],
	[{
		text: "查看告警",
		func:function(){

			var currentSelectedPoint = $(this).attr('dt');
			var currentSelectedPoint = $(this).attr('PBD:PtTagName');
			currentSelectedPoint = currentSelectedPoint.replace("\\\\172.28.0.18\\", "")
			//测点
			window.parent.amAlarm(currentSelectedPoint);
		}
	}]
]
/**
 * 测点右键菜单配置
 */
var pointRightMenuData = [
     [{
         text: "测点管理",
         data: [pointRightMenuPointData]
     }],[{
         text: "复制测点",
         func:function(){
        	 var currentSelectedPoint = $(this).attr('dt');
//        	 copyToClipboard(currentSelectedPoint);
        	 copyToClip(currentSelectedPoint);
         }
     }]
     ,alarmMenuData
	 ,trendMenuData
 ];
function copyToClip(content, message) {
    var aux = document.createElement("input");
    aux.setAttribute("value", content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
   /* if (message == null) {
        alert("复制成功");
    } else{
        alert(message);
    }*/
}
/**
 * 放大缩小
 * 缩放插件：http://www.internetke.com/effects/layer/2016/0624/1931.html
 * @param flag 0:还原 1:放大 -1:缩小
 */
/*var bigflag = 1;//缩放倍数
var topHeight = 0;//顶部高度
function zoom(flag) {
	// var svg = $("svg")[0];
	var svg = $("#svgContainer")[0];
//	var $main = $('#main');
	if (flag == 1) {//放大
		bigflag = bigflag + 1;
		svg.style.width = document.body.clientWidth * bigflag;
		svg.style.height = (document.body.clientHeight - topHeight) * bigflag;
	} else if (flag == -1) {//缩小
		if (bigflag > 1) {
			bigflag = bigflag - 1;
			svg.style.width = document.body.clientWidth * bigflag;
			svg.style.height = (document.body.clientHeight - topHeight) * bigflag;
			svg.style.top = 0;
			svg.style.left = 0;
			$(svg).css({'position':'absolute'});
		}
//		else{
//			window.location.href=window.location.href;//刷新整个页面
//		}
	}else if(flag == 0){//还原
		//window.location.href=window.location.href;//刷新整个页面
		bigflag = 1;
		svg.style.width = document.body.clientWidth * bigflag;
		svg.style.height = (document.body.clientHeight - topHeight) * bigflag;
		svg.style.top = 0;
		svg.style.left = 0;
		$(svg).css({'position':'absolute'});
	}

//	$main.height(svg.style.height);
//	$main.width(svg.style.width);

	if(flag != 0)$("svg").drag();//设置页面可拖动
}*/

var currentScaleFactor = 1;
var defaultScale;
var defaultLeft;
var defaultTop;
function zoom(flag){

	var svg = $("#svgContainer");
	if(defaultScale== NaN){
		defaultScale = svg.css('-webkit-transform').split('(')[1].split(',')[0]*1;
		currentScaleFactor = 1;
	}
	if (flag == 1) {//放大
		currentScaleFactor += 1;
		var scaleTo = currentScaleFactor > 0 ? ( defaultScale * currentScaleFactor) : (Math.pow(2,currentScaleFactor)/2 * defaultScale);
		scaleSvgContianer(scaleTo);// Reference : sis.js
		svg.css('top', '0px');
		svg.css('left', '0px');
		svg.css('margin-left',  '0px');
		svg.css('margin-top', '0px');
	} else if (flag == -1) {//缩小
		currentScaleFactor -= 1;
		var scaleTo = currentScaleFactor > 0 ? ( defaultScale * currentScaleFactor) : (Math.pow(2,currentScaleFactor)/2 * defaultScale);
		scaleSvgContianer(scaleTo);// Reference : sis.js
		svg.css('top', '0px');
		svg.css('left', '0px');
		svg.css('margin-left',  '0px');
		svg.css('margin-top', '0px');
	} else {
		currentScaleFactor = 1;
		var scaleTo = currentScaleFactor > 0 ? ( defaultScale * currentScaleFactor) : (Math.pow(2,currentScaleFactor)/2 * defaultScale);
		scaleSvgContianer(scaleTo);// Reference : sis.js
		svg.css('top',  '50%');
		svg.css('left', '50%');
		svg.css('margin-left',  defaultLeft);
		svg.css('margin-top', defaultTop);
	}

	// svg.css('-webkit-transform','scale('+currentScale+','+currentScale+')');

	if(flag != 0)svg.drag();//设置页面可拖动
}

/**
 * 初始化右键菜单
 */
function initRightMenuPlugin(){
	//判断是否有修改测点权限
	if(hasUpdatePointFlag){
		//如果有修改测点权限，则增加右键菜单
		pointRightMenuPointData.push({
	        text: "修改测点",
	        func: function() {
	       	 	var currentSelectedPoint = $(this).attr('dt');
				if(!currentSelectedPoint){
					currentSelectedPoint= $(this).attr('kt');
				}
	       	 	var gId = $(this).attr('id');
			  	layer.open({
			  	  type: 1,
			  	  skin: layerSkin, //样式类名
			  	  title: '修改测点',
			  	  area: ['400px', '300px'],
			  	  content: '<form class="layui-form"  action="" onsubmit="updatePoint(\''+currentSelectedPoint+'\', \''+gId+'\');return false;" > '+
							'	<div class="layui-form-item"> <label class="layui-form-label">当前测点：</label> <div class="layui-input-block" style="line-height:36px;"> '+currentSelectedPoint+'</div> </div> '+
							'	<div class="layui-form-item"> <label class="layui-form-label">新测点：</label> <div class="layui-input-inline"> <input type="text" id="newPointName" name="newPointName" required lay-verify="required" placeholder="请输入新测点" autocomplete="off" class="layui-input"> </div>'+
							'	<div class="layui-form-mid layui-word-aux"></div> </div> <div class="layui-form-item"> <div class="layui-input-block"> '+
							'		<button class="layui-btn" lay-submit lay-filter="formDemo">修改</button> '+
							'		<button type="reset" class="layui-btn layui-btn-primary">重置</button>'+
			  	 			' 		<button type="button" onclick="viewLog(\''+currentSelectedPoint+'\',\''+gId+'\')" class="layui-btn layui-btn-primary">查看修改日志</button>  </div> </div> </form>'
			  	});
		     }
	    });
	}

	$("body").smartMenu(bodyRightMenuData, {name: "body"});//页面右键菜单


	if(isHasPoint){
		$("g[class=point]").smartMenu(pointRightMenuData, {name: "g_point"});//测点右键菜单
	}

	if(isHasCamera){
		$("g[kt^='camera_']").smartMenu(cameraRightMenuData, {name: "g_kt_camera"});//摄像头右键菜单
		$("g[kt^='VDS_']").smartMenu(vdsRightMenuData, {name: "g_kt_VDS"});//视频右键菜单   新版本的视频功能
	}

	if(isHasTpPoint){
		$("g[class=tp]").smartMenu(pointRightMenuData, {name: "g_kt_TP"});//技术参数右键菜单
	}

	if(isHasIndPoint){
		$("g[class=ind]").smartMenu(pointRightMenuData, {name: "g_kt_IND"});//指标右键菜单 TODO:
	}

	if(isHasImexpPoint){
		//$("g[kt^='IMEXP_']").smartMenu(pointRightMenuData, {name: "g_kt_IMEXP"});//指标表达式右键菜单 TODO:
	}

	if(isHasArea){
		$("g[class=area]").smartMenu(areaRightMenuData, {name: "g_kt_AREA"});//区域右键菜单
	}

	if(isHasAlarm){
		$("g[class=alarm]").smartMenu(alarmRightMenuData, {name: "g_kt_ALARM"});//区域告警右键菜单
	}

	if(isHasDoor){
		$("g[class=door]").smartMenu(doorRightMenuData, {name: "g_kt_DOOR"});//门禁右键菜单
	}

	if (isHasPi) {
		$("g[class=pi]").smartMenu(piRightMenuData, { name: "g_pi" });//pi测点右键菜单
	}



	zoom(0);//还原页面
}
function viewLog(point,gid){//theme/FixCS-cpeam/main_h.html
	//var hurl=window.location.href;
	//var name=hurl.substring(hurl.lastIndexOf('/')+1,hurl.lastIndexOf('.'));
	//var title=gid+"_"+name;
	/* var url='/DMS/forms/RTM/SVG_POINT_LOG/log_mod.htm?_viewId=log_list&'+
		'_menuId=41dd0afe2dff39de0133ce76a09df33f&objName=SVG_POINT_LOG&_useType=modify&_pk=ID&_pkValue='+title+'';
	var obj = {};
	var id='41dd0afe2dff39de0133ce76a09df33';
	obj.name ='测点修改日志明细';
	obj.url =url;
	obj.id = id;
	obj.scrolling = "no";
	top.Fix.Manager.createTabInMainTab(obj, function() {
	}, this); */

	//alert(window.location.href);
	var location = window.location.href.indexOf('?')>-1?window.location.href.substr(0,window.location.href.indexOf('?')):window.location.href;
	//alert(location);
	var name = location.substring(location.lastIndexOf('/')+1,location.lastIndexOf('.'));
	window.open(location+'/../../trend/modify_log.html?1=1&pointId='+gid+'&fileName='+name);
;}
