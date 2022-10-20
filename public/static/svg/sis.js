//var CALCULATION_URL = parent.CALCULATION_URL();
//var businessRequest = parent.businessRequest;

var CALCULATION_URL;
var api_url;
var INSPECTION_URL;
var SAFEPRO_URL;

var append_url = '';
const CAMERA_PREFIX = "camera_";  //摄像头  camera_摄像头id
const VDS_PREFIX = "VDS_";  //视频  和上面的摄像头一个意思，摄像头编码是旧编码（兼容老程序）   VDS_摄像头id
const TP_PREFIX = "TP_" ; // 技术参数  TP_技术参数编码
const IND_PREFIX = "IND_"; //指标     IND_指标编码_周期编码
const IMEXP_PREFIX = "IMEXP_";  //指标表达式  IMEXP_表达式id     TODO：还未做
const AREA_PREFIX = "AREA_"; //区域
const DOOR_PREFIX = "DOOR_"; //门禁
const ALARM_PREFIX="ALARM_";  //告警区域

var isHasPoint = false;//是否有测点 默认没有
var isHasCamera = false;
var isHasTpPoint = false; // 是否有技术参数
var isHasIndPoint = false;
var isHasImexpPoint = false;
var isHasArea = false;
var isHasDoor = false;
var isHasAlarm = false;
var isHasPi = false;

var isHasChannelAlarm = false;


var locaNo = '';
var locaName = '';
var token ='';
var username = '';

$(function() {
	token = getToken();
	username = getUserName();
	api_url=localStorage.getItem('api_url');
	CALCULATION_URL=localStorage.getItem('CALCULATION_URL');
	INSPECTION_URL=localStorage.getItem('INSPECTION_URL');
	SAFEPRO_URL=localStorage.getItem('SAFEPRO_URL');
	locaNo=getQueryString('locaNo');
	locaName = getQueryString('locaName');
});

var reqUrl = "/api/diagram/showPointsValue";//测点值请求地址
var reqTpUrl = "/api/diagram/showTpValue";//技术参数请求地址
var reqIndUrl = "/api/diagram/showIndValue";//指标请求地址
var reqImexpUrl = "/api/diagram/showImexpValue";//指标表达式请求地址
var checkUpdatePointUrl = "/api/diagram/checkUpdatePoint";//检测修改测点权限   这个接口暂时不会被调用到
var updatePointUrl = "/api/diagram/updateSvgPoint";//修改测点 */  //需要重构该接口， 修改文件中的测点名（前台） 和 记录修改日志（后台）

var reqTpPointUrl = "/api/diagram/getTpPoint";  //技术参数获取测点列表

var reqAreaUrl="/iotAreaDevice/getDeviceAndAlarmByAreaNos";  //区域的告警、视频、门禁数量
var reqDoorUrl="/iotDoor/getDoorInAndOutNumByDoorCodes";  //门禁的 进出人数
var reqChannelAlarmUrl="/iotAlarm/getAlarmCountByChannelNos";  //视频、门禁等设备的告警数量

var checkUpdatePointFlag = false;//是否需要检查修改测点权限 true:需要检查权限 false:不需要检查权限
var hasUpdatePointFlag = false;//是否有修改测点权限 true:有修改权限 false：无修改权限
var pointObjs = [];//测点jquery对象集
var noValidValue = -9999.0;//无效值
var checkedPoint='';//选择测点
var newWindow=0;//新打开窗口
//默认参数
var defaultParams = {
		pointJsons: [],//测点json集合
		fronts:[],//测点前景样式
		bgs:[]//测点背景样式
};

var rightMenu;//右键菜单对象
var updatePointBox;//修改测点窗口对象
var interval = 1;//定时数值，默认1秒
var sisInterval;//sis定时器
var pointnum = "2";//保留小数点位数
var fontSize = '16px';//字体大小 如果为空则默认为设计时的大小
var layerSkin = 'layui-layer-molv';//弹出框主题

//技术参数 需要单独存相关数据
var tpPointObjs = [];//测点jquery对象集
//技术参数 默认参数
var tpDefaultParams = {
		tpPointJsons: [],//测点json集合
		tpFronts:[],//测点前景样式
		tpBgs:[]//测点背景样式
};


//指标 需要单独存相关数据
var indPointObjs = [];//测点jquery对象集
//指标 默认参数
var indDefaultParams = {
		indPointJsons: [],//测点json集合
		indFronts:[],//测点前景样式
		indBgs:[]//测点背景样式
};

//指标表达式 需要单独存相关数据
var imexpPointObjs = [];//测点jquery对象集
//指标 默认参数
var imexpDefaultParams = {
		imexpPointJsons: [],//测点json集合
		imexpFronts:[],//测点前景样式
		imexpBgs:[]//测点背景样式
};

//区域 需要单独存相关数据
var areaPointObjs = [];//测点jquery对象集
//区域 默认参数
var areaDefaultParams = {
		areaPointJsons: [],//区域json集合
		areaFronts:[],//区域前景样式
		areaBgs:[]//区域背景样式
};

//告警区域 需要单独存相关数据
var alarmPointObjs = [];//告警区域jquery对象集
//告警区域 默认参数
var alarmDefaultParams = {
	alarmPointJsons: [],//告警区域json集合
	alarmFronts:[],//告警区域前景样式
	alarmBgs:[]//告警区域背景样式
};

//门禁 需要单独存相关数据
var doorPointObjs = [];//门禁点jquery对象集
//门禁 默认参数
var doorDefaultParams = {
		doorPointJsons: [],//门禁json集合
		doorFronts:[],//门禁前景样式
		doorBgs:[]//门禁背景样式
};

//通道告警
var channelAlarmObjs=[];
var channelAlarmParams = {
	channelAlarmJsons: [],//通道json集合
	channelAlarmFronts:[],//通道前景样式
	channelAlarmBgs:[]//通道背景样式
};

//pi测点
var piPointObjs = [];//jquery对象集
//默认参数
var piDefaultParams = {
	piPointJsons: [],//告警区域json集合
	piFronts: [],//告警区域前景样式
	piBgs: []//告警区域背景样式
};


//获得当前页面token
function getToken(){
	var strcookie = document.cookie;
	var arrcookie = strcookie.split(";");
	for(var i=0;i< arrcookie.length;i++){
		var arr = arrcookie[i].split("=");
		if(arr[0].indexOf("token")!=-1){
			return arr[1];
		}
	}
}

//获得当前页面用户名
function getUserName(){
	let userinfo = JSON.parse(window.localStorage.getItem(
		'userinfo'));
		//alert('userinfo.account='+userinfo.account);
	return userinfo.account;
}

/**
 * 获取url参数
 * @param name
 * @returns
 */
 function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        //return unescape(r[2]);
		return decodeURI(r[2]);   //替换unescape 为 decodeURI   解决中文乱码问题
    }
    return null;
}
/**
 * 获取所有类型测点数据并展示在页面上
 * 0：当前实时数据 1：快进 -1：后退
 */
function sis(res){

	if(isHasPoint){//页面包含有测点
		sisPoint(res);
	}

	/* if(isHasCamera){//页面包含有摄像头
	} */

	if(isHasTpPoint){
		tp(res);
	}

	if(isHasIndPoint){
		ind(res);
	}

	if(isHasImexpPoint){
		imexp(res);
	}

	if(isHasArea){
		area(res);
	}

	if(isHasAlarm){
		alarm(res);
	}

	if(isHasDoor){
		door(res);
	}

	if(isHasChannelAlarm){
		channelAlarm(res);
	}

	if (isHasPi) {//页面包含有pi数据库风格的svg测点
		pi(res);
	}



}

function sisPoint(res){
	var json = {};
	if (res == null || res == 0) {//当前实时数据参数
		//dataJsonStr = "json=" + defaultParams.pointJsons + "&res=" + res;
		json = {json:defaultParams.pointJsons};
	} else if (res == 1) {//快进查询历史数据参数
		getHisTim();//获取快进时间
		json ={json:defaultParams.pointJsons, res: res, histemptim:histemptim};
	//	dataJsonStr = "json=" + defaultParams.pointJsons + "&res=" + res + "&histemptim=" + histemptim;
	} else if (res == -1) {//后退查询历史数据参数
		getHisTim1();//获取后退时间
		json = {json:defaultParams.pointJsons, res: res, histemptim:histemptim};
	//	dataJsonStr = "json=" + defaultParams.pointJsons + "&res=1" + "&histemptim=" + histemptim;
	}
	$.ajax({
		type: "POST",
		url: api_url+CALCULATION_URL +reqUrl,
	   // data: dataJsonStr,
	    contentType: 'application/json',
		data: JSON.stringify({json:defaultParams.pointJsons, res: res, histemptim:histemptim}),
		dataType: "json",
		success: function(response){
//			   console.log(json);
			renderPoint(response.data.records);
		},
		error: function() {
			renderPoint(null);
			new jBox('Notice').setContent('<font color=red>Server disconnected, please contact the administrator!</font>');
		}
 	});

}

function tp(res){
	var json = {};
	json["locaNo"]=locaNo;
	json["json"]=tpDefaultParams.tpPointJsons;
	if (res == null || res == 0) {//当前实时数据参数
	//	json = {json:tpDefaultParams.tpPointJsons};

	} else if (res == 1) {//快进查询历史数据参数
		getHisTim();//获取快进时间
	//	json ={json:tpDefaultParams.tpPointJsons, res: res, histemptim:histemptim};
		json["res"]=res;
		json["histemptim"]=histemptim;
	} else if (res == -1) {//后退查询历史数据参数
		getHisTim1();//获取后退时间
		json["res"]=res;
		json["histemptim"]=histemptim;
	//	json = {json:tpDefaultParams.tpPointJsons, res: res, histemptim:histemptim};
	}
	$.ajax({
		type: "POST",
		url: api_url+CALCULATION_URL +reqTpUrl,
	   // data: dataJsonStr,
	    contentType: 'application/json',
		data: JSON.stringify(json),
		dataType: "json",
		success: function(response){
//			   console.log(json);
			renderTp(response.data);
		},
		error: function() {
			renderTp(null);
			new jBox('Notice').setContent('<font color=red>Server disconnected, please contact the administrator!</font>');
		}
 	});

}


function ind(res){
	var json = {};
	json["locaNo"]=locaNo;
	json["json"]=indDefaultParams.indPointJsons;
	if (res == null || res == 0) {//当前实时数据参数
	//	json = {json:tpDefaultParams.tpPointJsons};

	} else if (res == 1) {//快进查询历史数据参数
		getHisTim();//获取快进时间
	//	json ={json:tpDefaultParams.tpPointJsons, res: res, histemptim:histemptim};
		json["res"]=res;
		json["histemptim"]=histemptim;
	} else if (res == -1) {//后退查询历史数据参数
		getHisTim1();//获取后退时间
		json["res"]=res;
		json["histemptim"]=histemptim;
	//	json = {json:tpDefaultParams.tpPointJsons, res: res, histemptim:histemptim};
	}
	$.ajax({
		type: "POST",
		url: api_url+CALCULATION_URL +reqIndUrl,
	   // data: dataJsonStr,
	    contentType: 'application/json',
		data: JSON.stringify(json),
		dataType: "json",
		success: function(response){
//			   console.log(json);
			renderInd(response.data);
		},
		error: function() {
			renderInd(null);
			new jBox('Notice').setContent('<font color=red>Server disconnected, please contact the administrator!</font>');
		}
 	});
}

function imexp(res){
	//TODO:
}

function area(res){
	let json = [];
	json = areaDefaultParams.areaPointJsons;
	$.ajax({
		type: "POST",
		url: api_url+SAFEPRO_URL +reqAreaUrl,
	   // data: dataJsonStr,
	    contentType: 'application/json',
		data: JSON.stringify(json),
		dataType: "json",
		headers: {
			'X-Authorization-access_token': token,
			'username':username
		  },
		success: function(response){
//			   console.log(json);
			renderArea(response.data);
		},
		error: function() {
			renderArea(null);
			new jBox('Notice').setContent('<font color=red>Server disconnected, please contact the administrator!</font>');
		}
 	});
}

//区域告警，  根据区域编码获取告警数量
function alarm(res){
	let json = [];
	json = alarmDefaultParams.alarmPointJsons;
	$.ajax({
		type: "POST",
		url: api_url+SAFEPRO_URL +reqAreaUrl,
	   // data: dataJsonStr,
	    contentType: 'application/json',
		data: JSON.stringify(json),
		dataType: "json",
		headers: {
			'X-Authorization-access_token': token,
			'username':username
		  },
		success: function(response){
//			   console.log(json);
			renderAlarm(response.data);

		},
		error: function() {
			renderAlarm(null);
			new jBox('Notice').setContent('<font color=red>Server disconnected, please contact the administrator!</font>');
		}
 	});
}

function door(res){
	let json = [];
	json = doorDefaultParams.doorPointJsons;
	$.ajax({
		type: "POST",
		url: api_url+SAFEPRO_URL +reqDoorUrl,
	   // data: dataJsonStr,
	    contentType: 'application/json',
		data: JSON.stringify(json),
		dataType: "json",
		headers: {
			'X-Authorization-access_token': token,
			'username':username
		  },
		success: function(response){
//			   console.log(json);
			renderDoor(response.data);
		},
		error: function() {
			renderDoor(null);
			new jBox('Notice').setContent('<font color=red>Server disconnected, please contact the administrator!</font>');
		}
 	});
}

//根据门禁或视频编码获取告警数量--简称 通道告警
function channelAlarm(res){
	let json = {};
	json.channelNos = channelAlarmParams.channelAlarmJsons;

	let curDate = new Date();
	json.alarmDate = curDate.getFullYear() + '-' + (curDate.getMonth() + 1) + '-'+ curDate.getDate() ;
	/* if (res == null || res == 0) {//当前实时数据参数
		json.alarmDate = '2022-03-01';
	} else if (res == 1) {
		json.alarmDate = histemptim;
	} */

	$.ajax({
		type: "POST",
		url: api_url+SAFEPRO_URL +reqChannelAlarmUrl,
	   // data: dataJsonStr,
	    contentType: 'application/json',
		data: JSON.stringify(json),
		dataType: "json",
		headers: {
			'X-Authorization-access_token': token,
			'username':username
		  },
		success: function(response){
//			   console.log(json);
			renderChannelAlarm(response.data);
		},
		error: function() {
			renderChannelAlarm(null);
			new jBox('Notice').setContent('<font color=red>Server disconnected, please contact the administrator!</font>');
		}
 	});
}

/**
 * 将通道告警数据显示在页面上 ， 支持开关量和模拟量
 * @param channelAlarmValues 测点数据集
 */
 function renderChannelAlarm(channelAlarmValues) {
	if(channelAlarmValues){
		for(var i = 0; i < channelAlarmObjs.length; i++){
			var $channelAlarmObj = channelAlarmObjs[i];
			var _value = channelAlarmValues[i].alarmCount;//告警数量
			var _channelNo =channelAlarmValues[i].channelNo;
			var _alarmDate = channelAlarmValues[i].alarmDate;

			var _dt = $channelAlarmObj.attr("dt");//模拟量
			var _kt = $channelAlarmObj.attr("kt");//开关量

			if(_dt){//模拟量   //暂无需要 未开发
				/* var _fontColor = usevsdcolor ? '' : '#000000';//前景色
				var _bgColor = '';//背景色

				//设置显示数据
				var $pointText = $($channelAlarmObj.find("text")[0]);

				$pointText.attr("textcontent", _value).text(_value);//设置显示内容
				//$pointObj.attr("dc","#000000");
				if(_fontColor == ''){//设置前景色
					_fontColor = defaultParams.fronts[i].fill;//设置成默认前景色
				}
				$pointText.attr("fill", _fontColor);//设置字体颜色

				if(fontSize != ''){
					$pointText.attr("font-size", fontSize);//设置字体大小
				}
				$pointText.attr("font-weight", "900");
				$pointText.attr("title", '描述:'+disc+" "+',值:'+ _value+",时间:"+_time);//设置提示
				$pointText.attr('name',rtm_code+','+disc+','+_value+','+_time);  // 测点信息 中会读取该数值
				//设置背景颜色
				var $pointRect = $($pointObj.find("rect")[0]);
				var $pointText = $($pointObj.find("text")[0]);
				if(_bgColor == ''){
					_bgColor = defaultParams.bgs[i].fill;//设置成默认背景色
				} */
			}else if(_kt){//开关量
				var _kr = $channelAlarmObj.attr('kr');//值范围
				var jval = null;//开始值
				var kval = null;//结束值
				var flag = null;//是否显示标识
				if (_kr) {//获取范围
					var arrmp = (_kr).split(",");
					jval = arrmp[0];
					kval = arrmp[1];
				}
				var par = $channelAlarmObj[0];//当前节点
				var pointvalue = _value;
				//var pointvalue = parseFloat(_value).toFixed(pointnum);
				//$pointObj.attr("title", '测点:'+disc+"_"+_kt+' 值：'+ pointvalue);//设置提示
				//$pointObj.attr("title", 'point:'+_kt+'_desc:'+disc+'_value:'+ pointvalue);//设置提示
				$channelAlarmObj.attr("title", '描述:'+_channelNo+"告警数  "+',值:'+ pointvalue+",时间:"+_alarmDate);//设置提示

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
			}

		}
	}else{//错误提示
		for(var i = 0; i < channelAlarmObjs.length; i++){
			var $pointObj = channelAlarmObjs[i];
			var _dt = $pointObj.attr("dt");//模拟量
			if(_dt){//模拟量
				var _value = 'Lost connection';
				//设置显示数据
				var $pointText = $($pointObj.find("text")[0]);
				$pointText.attr("textcontent", _value).text(_value);//设置显示内容
				$pointText.attr("fill", "#fff");//设置字体颜色
				if(fontSize != ''){
					$pointText.attr("font-size", fontSize);//设置字体大小
				}
				//$pointText.attr("font-family", "Times New Roman");//设置字体
				$pointText.attr("title", 'point:'+$pointObj.attr("dt"));//设置提示
				//设置背景颜色
				var $pointRect = $($pointObj.find("rect")[0]);
				$pointRect.attr("fill", "red");//设置背景颜色
			}
		}
	}
}


/**
 * 将测点数据显示在页面上
 * @param pointValues 测点数据集
 */
function renderPoint(pointValues) {
	if(pointValues){
		for(var i = 0; i < pointObjs.length; i++){
			var $pointObj = pointObjs[i];
			var _value = pointValues[i].pointValue;//测点值
			var pointname=pointValues[i].pointName;//测点名
			var _time = pointValues[i].time;//测点时间
			var disc=pointValues[i].pointDesc;//测点描述
			var rtm_code=pointValues[i].rtmPoint;
			var isAlarm = pointValues[i].isAlarm; // 是否告警  1 告警

			var _dt = $pointObj.attr("dt");//模拟量
			var _kt = $pointObj.attr("kt");//开关量
			/* var _camera ;
			if(_kt != null && _kt.indexOf(CAMERA_PREFIX) == 0 ){   //摄像头
				_camera = _kt.substr(7);
				_kt = null;
			}

			if(_kt != null && _kt.indexOf(VDS_PREFIX) == 0 ){   //视频
				_camera = _kt.substr(4);
				_kt = null;
			}


			var _tp ; //技术参数    //目前主要是模拟量技术参数
			if(_dt != null && _dt.indexOf(TP_PREFIX)){
				_tp = _dt.substr(3);
				_dt = null ;
			}
 */
			var _hct = $pointObj.attr("hct");//柱子-横向
			var _vct = $pointObj.attr("vct");//柱子-纵向
			if(_dt){//模拟量
				var _fontColor = usevsdcolor ? '' : '#000000';//前景色
				var _bgColor = '';//背景色

				if('1' == isAlarm){
					_fontColor = 'red';
				}

				if(_time == '0' || _time == '1970-01-01 08:00:00'  ){//无效值判断
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
				//$pointText.attr("title", 'point:'+_dt+'_desc:'+disc+'_value:'+ _value);//设置提示
				$pointText.attr("title", '描述:'+disc+" "+',值:'+ _value+",时间:"+_time);//设置提示
				$pointText.attr('name',rtm_code+','+disc+','+_value+','+_time);  // 测点信息 中会读取该数值
				//设置背景颜色
				var $pointRect = $($pointObj.find("rect")[0]);
				var $pointText = $($pointObj.find("text")[0]);
				if(_bgColor == ''){
					_bgColor = defaultParams.bgs[i].fill;//设置成默认背景色
				}
				//$pointRect.attr("fill", _bgColor);//设置背景颜色
				//$pointText.attr("bg-colur", _bgColor);//设置背景颜色
			}/* else if(_camera){  //摄像头


			} */else if(_kt){//开关量
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

				/**通讯状态开关量 绑定了室外温度测点  特殊处理begin   中豪能源*/
				var index=pointname.indexOf('_',0);
				var str=pointname.substr(index,3);
				//alert(str);
				if(str=='_S7'||str=='_S1'){
					var lastDate=new Date(_time);
					var curDate=new Date();
					var dis=curDate-lastDate;
					if((dis/60000)>10){
						pointvalue=-1;
					}
					else {
						pointvalue=1;
					}
				}
				/**通讯状态开关量 绑定了室外温度测点  特殊处理end 中豪能源*/

				//$pointObj.attr("title", '测点:'+disc+"_"+_kt+' 值：'+ pointvalue);//设置提示
				//$pointObj.attr("title", 'point:'+_kt+'_desc:'+disc+'_value:'+ pointvalue);//设置提示
				$pointObj.attr("title", '描述:'+disc+" "+',值:'+ pointvalue+",时间:"+_time);//设置提示
				$pointObj.attr('name',rtm_code+','+disc+','+pointvalue+','+_time);  // 测点信息 中会读取该数值

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
				$pointObj.attr("title", 'point:'+_hct+'_desc:'+disc+'_value:'+ pointvalue);//设置提示
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
				$pointObj.attr("title", 'point:'+_vct+'_desc:'+disc+'_value:'+ pointvalue);//设置提示
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
				var _value = 'Lost connection';
				//设置显示数据
				var $pointText = $($pointObj.find("text")[0]);
				$pointText.attr("textcontent", _value).text(_value);//设置显示内容
				$pointText.attr("fill", "#fff");//设置字体颜色
				if(fontSize != ''){
					$pointText.attr("font-size", fontSize);//设置字体大小
				}
				//$pointText.attr("font-family", "Times New Roman");//设置字体
				$pointText.attr("title", 'point:'+$pointObj.attr("dt"));//设置提示
				//设置背景颜色
				var $pointRect = $($pointObj.find("rect")[0]);
				$pointRect.attr("fill", "red");//设置背景颜色
			}
		}
	}
}

/**
 * 将技术参数数据显示在页面上
 * @param pointValues 技术参数数据集
 */
 function renderTp(pointValues) {
	if(pointValues){
		for(var i = 0; i < tpPointObjs.length; i++){
			var $pointObj = tpPointObjs[i];
			//存在一个点对应多个数据的情况

			var _value = pointValues[i].firstValue;//第一个测点值
			var _time = pointValues[i].firstTime;//第一个测点时间
			var pointname=pointValues[i].tpPoint;//测点名
			var _firstIsAlarm = pointValues[i].firstIsAlarm; // 第一个测点是否告警
			var _firstPointDesc = pointValues[i].firstPointDesc; // 第一个测点描述
			var cnt = pointValues[i].cnt;//测点数据量
			var detailInfo=pointValues[i].detailInfo;//测点详细信息
			//var rtm_code=pointValues[i].rtmPoint;
			//var _dt = $pointObj.attr("dt");//模拟量
			var _dt = $pointObj.attr("dt");//模拟量
			var _kt = $pointObj.attr("kt");//开关量

			var _title =  '描述:'+_firstPointDesc+" "+',值:'+ _value+",时间:"+_time;   //title 不能为空，因此第一行不放到循环里面去
			for(var k = 0 ; k < detailInfo.length;k++){
				var d = detailInfo[k];
				let pValue =d.pointValue;
				if(parseInt(pValue) === parseInt(noValidValue)){
					pValue ="***";
				}
				if(k>0){
					_title += '<br>';  //增加换行
					_title += '描述:'+d.pointDesc+" "+',值:'+ pValue+",时间:"+d.time;
					//_title += '&#10';  //增加换行
				}
			}

			if(_dt){//模拟量
				var _fontColor = usevsdcolor ? '' : '#000000';//前景色
				var _bgColor = '';//背景色

				if('1' == _firstIsAlarm){
					_fontColor = 'red';
				}
				if(_time == '0' || _time == '1970-01-01 08:00:00' ){//无效值判断
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

				$pointText.attr("textcontent", _value).text(_value);//设置显示内容
				if(_fontColor == ''){//设置前景色
					_fontColor = tpDefaultParams.tpFronts[i].fill;//设置成默认前景色
				}
				$pointText.attr("fill", _fontColor);//设置字体颜色

				if(fontSize != ''){
					$pointText.attr("font-size", fontSize);//设置字体大小
				}
				$pointText.attr("font-weight", "900");
				//$pointText.attr("font-family", "Times New Roman");//设置字体
				//$pointText.attr("title", '测点:'+_dt+' 值：'+ _value);//设置提示
				//$pointText.attr("title", '测点:'+disc+'_'+_dt+' 值：'+ _value);//设置提示
				//$pointText.attr("title", 'point:'+_dt+'_desc:'+disc+'_value:'+ _value);//设置提示
				//$pointText.attr("title", '描述:'+disc+" "+',值:'+ _value+",时间:"+_time);//设置提示
				$pointText.attr("title", _title);//设置提示
				$pointText.attr('name',''+','+_firstPointDesc+','+_value+','+_time); // 测点信息 中会读取该数值
				//设置背景颜色
				var $pointRect = $($pointObj.find("rect")[0]);
				var $pointText = $($pointObj.find("text")[0]);
				if(_bgColor == ''){
					_bgColor = tpDefaultParams.tpBgs[i].fill;//设置成默认背景色
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

				/**通讯状态开关量 绑定了室外温度测点  特殊处理begin   中豪能源*/
				//alert(str);
				if(pointname=='TEMP_VAL'){
					var lastDate=new Date(_time);
					var curDate=new Date();
					var dis=curDate-lastDate;
					if((dis/60000)>10){
						pointvalue=-1;
					}
					else {
						pointvalue=1;
					}
				}
				/**通讯状态开关量 绑定了室外温度测点  特殊处理end 中豪能源*/

				//$pointObj.attr("title", '测点:'+disc+"_"+_kt+' 值：'+ pointvalue);//设置提示
				//$pointObj.attr("title", 'point:'+_kt+'_desc:'+disc+'_value:'+ pointvalue);//设置提示
				$pointObj.attr("title", '描述:'+_firstPointDesc+" "+',值:'+ pointvalue+",时间:"+_time);//设置提示

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

			}
		}
	}else{//错误提示
		for(var i = 0; i < tpPointObjs.length; i++){
			var $pointObj = tpPointObjs[i];
			var _dt = $pointObj.attr("dt");//模拟量
			//if(_dt){//模拟量
				var _value = 'Lost connection';
				//设置显示数据
				var $pointText = $($pointObj.find("text")[0]);
				$pointText.attr("textcontent", _value).text(_value);//设置显示内容
				$pointText.attr("fill", "#fff");//设置字体颜色
				if(fontSize != ''){
					$pointText.attr("font-size", fontSize);//设置字体大小
				}
				//$pointText.attr("font-family", "Times New Roman");//设置字体
				$pointText.attr("title", 'point:'+$pointObj.attr("dt"));//设置提示
				//设置背景颜色
				var $pointRect = $($pointObj.find("rect")[0]);
				$pointRect.attr("fill", "red");//设置背景颜色
			//}
		}
	}
}

/**
 * 将指标数据显示在页面上
 * @param pointValues 技术参数数据集
 */
 function renderInd(pointValues) {
	if(pointValues){
		for(var i = 0; i < indPointObjs.length; i++){
			var $pointObj = indPointObjs[i];
			//存在一个点对应多个数据的情况

			var _value = pointValues[i].dataValue;//指标值
			var _time = pointValues[i].dataTime;//指标时间
			var _isAlarm = pointValues[i].isAlarm; //是否告警


			//if(_dt){//模拟量
				var _fontColor = usevsdcolor ? '' : '#000000';//前景色
				var _bgColor = '';//背景色

				if('1' == _isAlarm){
					_fontColor = 'red';
				}

				if(_time == '0' || _time == '1970-01-01 08:00:00'){//无效值判断
					_bgColor = 'yellow';//黄色
				}else{
					if(parseInt(_value) === parseInt(noValidValue)){//无效测点判断
						_value ="***";
						_bgColor = 'red';//红色
					}else{
						//_value = parseFloat(_value).toFixed(pointnum);   //指标 里面有天数，取消小数点格式化
						_value = parseFloat(_value);
					}
				}

				var _title = '描述:'+pointValues[i].indicatorName+" "+',值:'+ _value+",时间:"+_time;

				//设置显示数据
				var $pointText = $($pointObj.find("text")[0]);

				$pointText.attr("textcontent", _value).text(_value);//设置显示内容
				if(_fontColor == ''){//设置前景色
					_fontColor = indDefaultParams.indFronts[i].fill;//设置成默认前景色
				}
				$pointText.attr("fill", _fontColor);//设置字体颜色

				if(fontSize != ''){
					$pointText.attr("font-size", fontSize);//设置字体大小
				}
				$pointText.attr("font-weight", "900");
				//$pointText.attr("font-family", "Times New Roman");//设置字体
				//$pointText.attr("title", '测点:'+_dt+' 值：'+ _value);//设置提示
				//$pointText.attr("title", '测点:'+disc+'_'+_dt+' 值：'+ _value);//设置提示
				//$pointText.attr("title", 'point:'+_dt+'_desc:'+disc+'_value:'+ _value);//设置提示
				//$pointText.attr("title", '描述:'+disc+" "+',值:'+ _value+",时间:"+_time);//设置提示
				$pointText.attr("title", _title);//设置提示
				$pointText.attr('name',''+','+pointValues[i].indicatorName+','+_value+','+_time); // 测点信息 中会读取该数值
				//设置背景颜色
				var $pointRect = $($pointObj.find("rect")[0]);
				var $pointText = $($pointObj.find("text")[0]);
				if(_bgColor == ''){
					_bgColor = indDefaultParams.indBgs[i].fill;//设置成默认背景色
				}
				//$pointRect.attr("fill", _bgColor);//设置背景颜色
				//$pointText.attr("bg-colur", _bgColor);//设置背景颜色
			//}
		}
	}else{//错误提示
		for(var i = 0; i < indPointObjs.length; i++){
			var $pointObj = indPointObjs[i];
			var _dt = $pointObj.attr("dt");//模拟量
			//if(_dt){//模拟量
				var _value = 'Lost connection';
				//设置显示数据
				var $pointText = $($pointObj.find("text")[0]);
				$pointText.attr("textcontent", _value).text(_value);//设置显示内容
				$pointText.attr("fill", "#fff");//设置字体颜色
				if(fontSize != ''){
					$pointText.attr("font-size", fontSize);//设置字体大小
				}
				//$pointText.attr("font-family", "Times New Roman");//设置字体
				$pointText.attr("title", 'point:'+$pointObj.attr("dt"));//设置提示
				//设置背景颜色
				var $pointRect = $($pointObj.find("rect")[0]);
				$pointRect.attr("fill", "red");//设置背景颜色
			//}
		}
	}
}


function renderArea(pointValues){
	if(pointValues){
		for(var i = 0; i < areaPointObjs.length; i++){
			let $pointObj = areaPointObjs[i];
			//存在一个点对应多个数据的情况

			let doorCnt = pointValues[i].doorCount;//门禁数量
			let alarmCnt = pointValues[i].alarmCount;//告警数量
			let videoCnt = pointValues[i].cameraCount; //摄像头数量

			//let doorCnt = 3;//门禁数量
			//let alarmCnt = 2;//告警数量
			//let videoCnt = 1; //摄像头数量

			let _value = alarmCnt;
			if(alarmCnt == "0"){
				_value = "";
			}

			//if(_dt){//模拟量
				var _fontColor = usevsdcolor ? '' : '#000000';//前景色
				var _bgColor = '';//背景色


				/* if('1' == _isAlarm){
					_fontColor = 'red';
				}

				if(_time == '0' || _time == '1970-01-01 08:00:00'){//无效值判断
					_bgColor = 'yellow';//黄色
				}else{
					if(parseInt(_value) === parseInt(noValidValue)){//无效测点判断
						_value ="***";
						_bgColor = 'red';//红色
					}else{
						//_value = parseFloat(_value).toFixed(pointnum);   //指标 里面有天数，取消小数点格式化
						_value = parseFloat(_value);
					}
				} */

				var _title = '摄像头:'+videoCnt+"\n"+'门禁:'+ doorCnt+"\n告警数:"+alarmCnt;

				//设置显示数据
				var $pointText = $($pointObj.find("text")[0]);

				$pointText.attr("textcontent", _value).text(_value);//设置显示内容
				if(_fontColor == ''){//设置前景色
					_fontColor = areaDefaultParams.areaFronts[i].fill;//设置成默认前景色
				}
				$pointText.attr("fill", _fontColor);//设置字体颜色

				if(fontSize != ''){
					$pointText.attr("font-size", fontSize);//设置字体大小
				}
				$pointText.attr("font-weight", "900");
				//$pointText.attr("font-family", "Times New Roman");//设置字体
				//$pointText.attr("title", '测点:'+_dt+' 值：'+ _value);//设置提示
				//$pointText.attr("title", '测点:'+disc+'_'+_dt+' 值：'+ _value);//设置提示
				//$pointText.attr("title", 'point:'+_dt+'_desc:'+disc+'_value:'+ _value);//设置提示
				//$pointText.attr("title", '描述:'+disc+" "+',值:'+ _value+",时间:"+_time);//设置提示
				$pointText.attr("title", _title);//设置提示
				//$pointObj.attr("title", _title);  //

				if($pointObj.find("title").length >0){
					$title = $($pointObj.find("title")[0]);
					$title.text(_title);
				}else{
					var node=document.createElementNS("http://www.w3.org/2000/svg", "title");
					/* node.setContent(_title);
					document.createTextNode() */
					var textnode=document.createTextNode(_title);
					node.appendChild(textnode);
					$pointObj[0].appendChild(node);
				}




				$pointText.attr('name',pointValues[i].areaNo+','+pointValues[i].areaName+','+_value+','+''); // 测点信息 中会读取该数值
				$pointObj.attr('name',pointValues[i].areaNo+','+pointValues[i].areaName+','+_value+','+'');
				//设置背景颜色
				var $pointRect = $($pointObj.find("rect")[0]);
				var $pointText = $($pointObj.find("text")[0]);
				if(_bgColor == ''){
					_bgColor = areaDefaultParams.areaBgs[i].fill;//设置成默认背景色
				}
				//$pointRect.attr("fill", _bgColor);//设置背景颜色
				//$pointText.attr("bg-colur", _bgColor);//设置背景颜色
			//}
		}
	}else{//错误提示
		for(var i = 0; i < areaPointObjs.length; i++){
			var $pointObj = areaPointObjs[i];
			var _dt = $pointObj.attr("dt");//模拟量
			//if(_dt){//模拟量
				var _value = 'Lost connection';
				//设置显示数据
				var $pointText = $($pointObj.find("text")[0]);
				$pointText.attr("textcontent", _value).text(_value);//设置显示内容
				$pointText.attr("fill", "#fff");//设置字体颜色
				if(fontSize != ''){
					$pointText.attr("font-size", fontSize);//设置字体大小
				}
				//$pointText.attr("font-family", "Times New Roman");//设置字体
				$pointText.attr("title", 'point:'+$pointObj.attr("dt"));//设置提示
				//设置背景颜色
				var $pointRect = $($pointObj.find("rect")[0]);
				$pointRect.attr("fill", "red");//设置背景颜色
			//}
		}
	}
}


function renderAlarm(pointValues){
	if(pointValues){
		for(var i = 0; i < alarmPointObjs.length; i++){
			let $pointObj = alarmPointObjs[i];
			//存在一个点对应多个数据的情况

			let alarmCnt = pointValues[i].alarmCount;//告警数量

			//let alarmCnt = 2;//告警数量

			let _value = alarmCnt;
			if(alarmCnt == 0){
				_value = "";
			}

			//if(_dt){//模拟量
				var _fontColor = usevsdcolor ? '' : '#000000';//前景色
				var _bgColor = '';//背景色

				//<animate  attributeType="CSS" attributeName="r" from="50" to="0" dur="5s" repeatCount="indefinite"/>

				/* if('1' == _isAlarm){
					_fontColor = 'red';
				}

				if(_time == '0' || _time == '1970-01-01 08:00:00'){//无效值判断
					_bgColor = 'yellow';//黄色
				}else{
					if(parseInt(_value) === parseInt(noValidValue)){//无效测点判断
						_value ="***";
						_bgColor = 'red';//红色
					}else{
						//_value = parseFloat(_value).toFixed(pointnum);   //指标 里面有天数，取消小数点格式化
						_value = parseFloat(_value);
					}
				} */

				var _title = ' 告警数:'+alarmCnt;

				//设置显示数据
				var $pointText = $($pointObj.find("text")[0]);

				$pointText.attr("textcontent", _value);//设置显示内容
				//查找节点类型 text的 ，然后修改值
				let textNode = $pointText.contents().filter(function(){return this.nodeType==3});
				if(textNode.length > 0){
					textNode[0].nodeValue = _value;
				}
				//$pointText[0].nodeValue = _value;
				//$pointText[0].childNodes[2].nodeValue = _value;
				if(_fontColor == ''){//设置前景色
					_fontColor = alarmDefaultParams.alarmFronts[i].fill;//设置成默认前景色
				}
				//alert(_fontColor);
				$pointText.attr("fill", _fontColor);//设置字体颜色

				/* var motion=document.createElementNS("http://www.w3.org/2000/svg","animate");
				motion.setAttributeNS("http://www.w3.org/2000/svg", "attributeType", "CSS");
				motion.setAttributeNS("http://www.w3.org/2000/svg", "attributeName", "fill");
				motion.setAttributeNS("http://www.w3.org/2000/svg", "from", "#ff0000");
				motion.setAttributeNS("http://www.w3.org/2000/svg", "to", "#000000");
				motion.setAttributeNS("http://www.w3.org/2000/svg", "begin", "0.5s");
				motion.setAttributeNS("http://www.w3.org/2000/svg", "dur", "1s");
				motion.setAttributeNS("http://www.w3.org/2000/svg", "repeatCount", "indefinite");


				$pointText[0].appendChild(motion); */


		//		$pointText.append('<animate  attributeType="CSS" attributeName="fill" from="#ff0000" to="#ffffff"  begin="0.5s" dur="1s" repeatCount="indefinite"/>');
				//$('svg').html($('svg').html());   //需要重新渲染svg  才会有动图效果,  这段代码放到循环外了
				//$pointText.animate({attributeType:"CSS", attributeName:"fill", from:"#ff0000", to:"#000000", begin:"0.5s",dur:"0.5s", repeatCount:"indefinite"});
				//$pointText.animate({fill:"#000000"}, "fast");
				if(fontSize != ''){
					$pointText.attr("font-size", fontSize);//设置字体大小
				}
				$pointText.attr("font-weight", "900");
				$pointText.attr("title", _title);//设置提示
				$pointText.attr('name',pointValues[i].areaNo+','+pointValues[i].areaName+','+_value+','+''); // 测点信息 中会读取该数值
				//设置背景颜色
				var $pointRect = $($pointObj.find("rect")[0]);
				//var $pointText = $($pointObj.find("text")[0]);
				if(_bgColor == ''){
					_bgColor = alarmDefaultParams.alarmBgs[i].fill;//设置成默认背景色
				}
				//$pointRect.attr("fill", _bgColor);//设置背景颜色
				//$pointText.attr("bg-colur", _bgColor);//设置背景颜色
			//}
		}
	}else{//错误提示
		for(var i = 0; i < alarmPointObjs.length; i++){
			var $pointObj = alarmPointObjs[i];
			var _dt = $pointObj.attr("dt");//模拟量
			//if(_dt){//模拟量
				var _value = 'Lost connection';
				//设置显示数据
				var $pointText = $($pointObj.find("text")[0]);
				$pointText.attr("textcontent", _value).text(_value);//设置显示内容
				$pointText.attr("fill", "#fff");//设置字体颜色
				if(fontSize != ''){
					$pointText.attr("font-size", fontSize);//设置字体大小
				}
				//$pointText.attr("font-family", "Times New Roman");//设置字体
				$pointText.attr("title", 'point:'+$pointObj.attr("dt"));//设置提示
				//设置背景颜色
				var $pointRect = $($pointObj.find("rect")[0]);
				$pointRect.attr("fill", "red");//设置背景颜色
			//}
		}
	}
}


function renderDoor(pointValues){
	if(pointValues){
		for(var i = 0; i < doorPointObjs.length; i++){
			let $pointObj = doorPointObjs[i];
			let inCnt = pointValues[i].doorInCount;//进 人数   //TODO:
			let outCnt = pointValues[i].doorOutCount;//出 人数

			//if(_dt){//模拟量
				var _fontColor = usevsdcolor ? '' : '#000000';//前景色
				var _bgColor = '';//背景色



				var _title = '入:'+inCnt+"人\n"+'出:'+ outCnt+"人";

				//设置显示数据
				var $pointText = $($pointObj.find("text")[0]);

				$pointText.attr("textcontent", _value).text(_value);//设置显示内容
				if(_fontColor == ''){//设置前景色
					_fontColor = doorDefaultParams.doorFronts[i].fill;//设置成默认前景色
				}
				$pointText.attr("fill", _fontColor);//设置字体颜色

				if(fontSize != ''){
					$pointText.attr("font-size", fontSize);//设置字体大小
				}
				$pointText.attr("font-weight", "900");
				//$pointText.attr("font-family", "Times New Roman");//设置字体
				//$pointText.attr("title", '测点:'+_dt+' 值：'+ _value);//设置提示
				//$pointText.attr("title", '测点:'+disc+'_'+_dt+' 值：'+ _value);//设置提示
				//$pointText.attr("title", 'point:'+_dt+'_desc:'+disc+'_value:'+ _value);//设置提示
				//$pointText.attr("title", '描述:'+disc+" "+',值:'+ _value+",时间:"+_time);//设置提示
				$pointText.attr("title", _title);//设置提示
				$pointText.attr('name',''+','+pointValues[i].channelName+','+''+','+''); // 测点信息 中会读取该数值
				//设置背景颜色
				var $pointRect = $($pointObj.find("rect")[0]);
				var $pointText = $($pointObj.find("text")[0]);
				if(_bgColor == ''){
					_bgColor = doorDefaultParams.doorBgs[i].fill;//设置成默认背景色
				}
				//$pointRect.attr("fill", _bgColor);//设置背景颜色
				//$pointText.attr("bg-colur", _bgColor);//设置背景颜色
			//}
		}
	}else{//错误提示
		for(var i = 0; i < doorPointObjs.length; i++){
			var $pointObj = doorPointObjs[i];
			var _dt = $pointObj.attr("dt");//模拟量
			//if(_dt){//模拟量
				var _value = 'Lost connection';
				//设置显示数据
				var $pointText = $($pointObj.find("text")[0]);
				$pointText.attr("textcontent", _value).text(_value);//设置显示内容
				$pointText.attr("fill", "#fff");//设置字体颜色
				if(fontSize != ''){
					$pointText.attr("font-size", fontSize);//设置字体大小
				}
				//$pointText.attr("font-family", "Times New Roman");//设置字体
				$pointText.attr("title", 'point:'+$pointObj.attr("dt"));//设置提示
				//设置背景颜色
				var $pointRect = $($pointObj.find("rect")[0]);
				$pointRect.attr("fill", "red");//设置背景颜色
			//}
		}
	}
}


/**
 * 将pi测点数据显示在页面上
 * @param pointValues 测点数据集
 */
function renderPi(pointValues) {
	if (pointValues) {
		for (var i = 0; i < piPointObjs.length; i++) {
			var $pointObj = piPointObjs[i];
			var _value = pointValues[i].pointValue;//测点值
			var pointname = pointValues[i].pointName;//测点名
			var _time = pointValues[i].time;//测点时间
			var disc = pointValues[i].pointDesc;//测点描述
			var rtm_code = pointValues[i].rtmPoint;
			var isAlarm = pointValues[i].isAlarm; // 是否告警  1 告警

			var _pi = $pointObj.attr("PBD:PtTagName");//pi测点

			if (_pi) {//模拟量
				var _fontColor = usevsdcolor ? '' : '#000000';//前景色
				var _bgColor = '';//背景色

				if ('1' == isAlarm) {
					_fontColor = 'red';
				}

				if (_time == '0' || _time == '1970-01-01 08:00:00') {//无效值判断
					_bgColor = 'yellow';//黄色
				} else {
					if (parseInt(_value) === parseInt(noValidValue)) {//无效测点判断
						_value = "***";
						_bgColor = 'red';//红色
					} else {
						_value = parseFloat(_value).toFixed(pointnum);
					}
				}

				//设置显示数据
				var $pointText = $($pointObj.find("text")[0]);

				$pointText.attr("textcontent", _value).text(_value);//设置显示内容
				if (_fontColor == '') {//设置前景色
					_fontColor = piDefaultParams.piFronts[i].fill;//设置成默认前景色
				}
				$pointText.attr("fill", _fontColor);//设置字体颜色

				if (fontSize != '') {
					$pointText.attr("font-size", fontSize);//设置字体大小
				}
				$pointText.attr("font-weight", "900");
				$pointText.attr("title", '描述:' + disc + " " + ',值:' + _value + ",时间:" + _time);//设置提示
				$pointText.attr('name', rtm_code + ',' + disc + ',' + _value + ',' + _time);  // 测点信息 中会读取该数值
				//设置背景颜色
				var $pointRect = $($pointObj.find("rect")[0]);
				var $pointText = $($pointObj.find("text")[0]);
				if (_bgColor == '') {
					_bgColor = piDefaultParams.piBgs[i].fill;//设置成默认背景色
				}
			}

		}
	} else {//错误提示
		for (var i = 0; i < piPointObjs.length; i++) {
			var $pointObj = piPointObjs[i];
			var _dt = $pointObj.attr("dt");//模拟量
			if (_dt) {//模拟量
				var _value = 'Lost connection';
				//设置显示数据
				var $pointText = $($pointObj.find("text")[0]);
				$pointText.attr("textcontent", _value).text(_value);//设置显示内容
				$pointText.attr("fill", "#fff");//设置字体颜色
				if (fontSize != '') {
					$pointText.attr("font-size", fontSize);//设置字体大小
				}
				//$pointText.attr("font-family", "Times New Roman");//设置字体
				$pointText.attr("title", 'point:' + $pointObj.attr("dt"));//设置提示
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
	//后台接口无法获取用户, 因此不使用如下判断
	/* $.ajax({
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
	}); */
}


function pi(res) {
	var json = {};
	if (res == null || res == 0) {//当前实时数据参数
		//dataJsonStr = "json=" + defaultParams.pointJsons + "&res=" + res;
		json = { json: piDefaultParams.piPointJsons };
	} else if (res == 1) {//快进查询历史数据参数
		getHisTim();//获取快进时间
		json = { json: piDefaultParams.piPointJsons, res: res, histemptim: histemptim };
		//	dataJsonStr = "json=" + defaultParams.pointJsons + "&res=" + res + "&histemptim=" + histemptim;
	} else if (res == -1) {//后退查询历史数据参数
		getHisTim1();//获取后退时间
		json = { json: piDefaultParams.piPointJsons, res: res, histemptim: histemptim };
		//	dataJsonStr = "json=" + defaultParams.pointJsons + "&res=1" + "&histemptim=" + histemptim;
	}
	$.ajax({
		type: "POST",
		url: api_url + CALCULATION_URL + reqUrl,
		// data: dataJsonStr,
		contentType: 'application/json',
		data: JSON.stringify({ json: piDefaultParams.piPointJsons, res: res, histemptim: histemptim }),
		dataType: "json",
		success: function (response) {
			//			   console.log(json);
			renderPi(response.data.records);
		},
		error: function () {
			renderPi(null);
			new jBox('Notice').setContent('<font color=red>Server disconnected, please contact the administrator!</font>');
		}
	});

}

/**
 * 修改测点操作
 * @param nowpoint 当前测点
 * @param gId 当前测点所在节点id
 */
function updatePoint(nowpoint, gId){
	//alert(gId);
	layer.confirm('你确定要修改吗？', {
	  skin: layerSkin, //样式类名
	  icon: 3, title:'提示',
	  btn: ['是', '否']
	}, function(index){
		$.ajax({
			   type: "POST",
			   url: api_url+CALCULATION_URL+updatePointUrl,
	    		contentType: 'application/json',
			   data: JSON.stringify({oldPoint: nowpoint, newPoint:$('#newPointName').val(), gId: gId, htmlUrl:decodeURI(window.location.href)}),
			   dataType: "json",
			   success: function(response){
				   var data = response.data;
				   console.log(data);
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

		//pi 组态图的 viewBox 设置值 和rect[0] 不一致，重新设置下
		var _svgw = $($('rect')[0]).attr('width'),
			_svgh = $($('rect')[0]).attr('height');

		$('svg')[0].setAttribute('viewBox','0 0 '+_svgw+' '+_svgh);
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
//		console.log(fire);
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

//入口
$(function(){
		if (uniformScale)
			$('svg').wrap('<div id="svgContainer"></div>');
		fullScreenSvg();//设置svg为全屏 ,
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

		//遍历所有节点并找出所有的测点
		let ifMotion = false
		$("g").each(function (i) {
			var $g = $(this);
			var _dt = $g.attr("dt");//模拟量

			var _kt = $g.attr("kt");//开关量
			let _alarm;  //告警区域
			if (_kt != null && _kt.indexOf(ALARM_PREFIX) == 0) {
				_alarm = _kt.substr(6);
				_kt = null;
			}
			if (_dt != null && _dt.indexOf(ALARM_PREFIX) == 0) {
				_alarm = _dt.substr(6);
				_dt = null;
			}
			if (_alarm) {  //告警区域
				var $pointText = $($g.find("text")[0]);
				if ($pointText.length > 0) {
					var motion = document.createElementNS("http://www.w3.org/2000/svg", "animate");
					motion.setAttributeNS("http://www.w3.org/2000/svg", "attributeType", "CSS");
					motion.setAttributeNS("http://www.w3.org/2000/svg", "attributeName", "fill");
					motion.setAttributeNS("http://www.w3.org/2000/svg", "from", "#ff0000");
					motion.setAttributeNS("http://www.w3.org/2000/svg", "to", "#000000");
					motion.setAttributeNS("http://www.w3.org/2000/svg", "begin", "0.5s");
					motion.setAttributeNS("http://www.w3.org/2000/svg", "dur", "1s");
					motion.setAttributeNS("http://www.w3.org/2000/svg", "repeatCount", "indefinite");

					$pointText[0].appendChild(motion);
					ifMotion = true
				}
			}
		});
		if (ifMotion){
			$('svg').html($('svg').html());
		}

		//遍历所有节点并找出所有的测点
		$("g").each(function (i) {
			 var $g = $(this);
			var _dt = $g.attr("dt");//模拟量

			var _kt = $g.attr("kt");//开关量

			let _pi = $g.attr("PBD:PtTagName");  //pi 数据库的组态图转换而来的

			if (_dt == 'TP_TITLE') {
				//设置显示数据
				var $pointText = $($g.find("text")[0]);
				let _value = locaName;
				$pointText.attr("textcontent", _value).text(_value);//设置显示内容
				$pointText.attr("fill", '#000000');
				$pointText.attr("font-weight", "bold");
				$pointText.attr("font-size", "40px");
				$pointText.attr("text-anchor", 'middle');   //start middle end
				return;

			}

			var _channelAlarm;  //通道告警   主要是视频和门禁，需要查询安全管控模块的告警记录信息。

			var _camera; //摄像头
			if (_kt != null && _kt.indexOf(CAMERA_PREFIX) == 0) {   //摄像头
				_camera = _kt.substr(7);
				//alert("camera ="+_camera);
				_kt = null;
			}

			if (_kt != null && _kt.indexOf(VDS_PREFIX) == 0) {   //视频
				_camera = _kt.substr(4);
				_channelAlarm = _kt.substr(4);
				_kt = null;
			}

			var _tp; //技术参数
			if (_dt != null && _dt.indexOf(TP_PREFIX) == 0) {
				_tp = _dt.substr(3);
				_dt = null;
			}
			if (_kt != null && _kt.indexOf(TP_PREFIX) == 0) {
				_tp = _kt.substr(3);
				_kt = null;
			}

			var _ind; //指标
			if (_dt != null && _dt.indexOf(IND_PREFIX) == 0) {
				_ind = _dt.substr(4);
				_dt = null;
			}

			var _imexp; //指标表达式
			if (_dt != null && _dt.indexOf(IMEXP_PREFIX) == 0) {
				_imexp = _dt.substr(6);
				_dt = null;
			}


			let _area;  //区域
			if (_kt != null && _kt.indexOf(AREA_PREFIX) == 0) {
				_area = _kt.substr(5);
				_kt = null;
			}
			if (_dt != null && _dt.indexOf(AREA_PREFIX) == 0) {
				_area = _dt.substr(5);
				_dt = null;
			}

			let _alarm;  //告警区域
			if (_kt != null && _kt.indexOf(ALARM_PREFIX) == 0) {
				_alarm = _kt.substr(6);
				_kt = null;
			}
			if (_dt != null && _dt.indexOf(ALARM_PREFIX) == 0) {
				_alarm = _dt.substr(6);
				_dt = null;
			}

			let _door;  //门禁
			if (_dt != null && _dt.indexOf(DOOR_PREFIX) == 0) {
				_door = _dt.substr(5);
				_dt = null;
			}
			if (_kt != null && _kt.indexOf(DOOR_PREFIX) == 0) {
				_door = _kt.substr(5);
				_channelAlarm = _kt.substr(5);
				_kt = null;
			}


			var _url = $g.attr('url');//链接
			var _hct = $g.attr("hct");//柱子-横向
			var _vct = $g.attr("vct");//柱子-纵向
			if (_dt) {//模拟量
				$g.dblclick(function () {
					var currentSelectedPoint = $(this).attr('dt');
					if (newWindow == 0 || newWindow.closed)
						checkedPoint = currentSelectedPoint + ';';
					else
						checkedPoint += currentSelectedPoint + ';';
					showChild(currentSelectedPoint);
				});
				pointObjs.push($g);
				$g.attr("class", 'point');
				//测点前景默认样式
				var $pointText = $($g.find("text")[0]);
				$pointText.attr('class', 'tooltipx');//设置提示样式
				$pointText.attr('dt', _dt);//设置测点
				defaultParams.fronts.push({ fill: $pointText.attr("fill") });
				//测点背景默认样式
				var $pointRect = $($g.find("rect")[0]);
				$pointRect.attr('dt', _dt);//设置测点
				defaultParams.bgs.push({ fill: $pointRect.attr("fill") });

				var p = { pointName: _dt };
				defaultParams.pointJsons.push(p);
				//defaultParams.pointJsons += "{\"pointname\":\"" + _dt + "\"},";
				isHasPoint = true;
			} else  if (_camera) {
				isHasCamera = true;
				$g.attr("class", 'vds');
				$g.click(function () {
					parent.openCamera(_camera);
				})

			} else if (_tp) {
				$g.attr("class", 'tp');
				tpPointObjs.push($g);
				//测点前景默认样式
				var $pointText = $($g.find("text")[0]);
				$pointText.attr('class', 'tooltipx');//设置提示样式
				$pointText.attr('dt', _dt);//设置测点
				tpDefaultParams.tpFronts.push({ fill: $pointText.attr("fill") });
				//测点背景默认样式
				var $pointRect = $($g.find("rect")[0]);
				$pointRect.attr('dt', _dt);//设置测点
				tpDefaultParams.tpBgs.push({ fill: $pointRect.attr("fill") });

				var p = { pointName: _tp };
				tpDefaultParams.tpPointJsons.push(p);

				isHasTpPoint = true;

			} else if (_ind) {
				$g.attr("class", 'ind');
				indPointObjs.push($g);
				//测点前景默认样式
				var $pointText = $($g.find("text")[0]);
				$pointText.attr('class', 'tooltipx');//设置提示样式
				$pointText.attr('dt', _dt);//设置测点
				indDefaultParams.indFronts.push({ fill: $pointText.attr("fill") });
				//测点背景默认样式
				var $pointRect = $($g.find("rect")[0]);
				$pointRect.attr('dt', _dt);//设置测点
				indDefaultParams.indBgs.push({ fill: $pointRect.attr("fill") });

				var p = { pointName: _ind };
				indDefaultParams.indPointJsons.push(p);

				isHasIndPoint = true;
			} else if (_imexp) {
				$g.attr("class", 'imexp');
				imexpPointObjs.push($g);
				//测点前景默认样式
				var $pointText = $($g.find("text")[0]);
				$pointText.attr('class', 'tooltipx');//设置提示样式
				$pointText.attr('dt', _dt);//设置测点
				imexpDefaultParams.imexpFronts.push({ fill: $pointText.attr("fill") });
				//测点背景默认样式
				var $pointRect = $($g.find("rect")[0]);
				$pointRect.attr('dt', _dt);//设置测点
				imexpDefaultParams.imexpBgs.push({ fill: $pointRect.attr("fill") });

				var p = { pointName: _ind };
				imexpDefaultParams.imexpPointJsons.push(p);

				isHasImexpPoint = true;
			} else if (_area) {  //区域
				$g.attr("class", 'area');
				areaPointObjs.push($g);

				//设置显示数据
				let $pointText = $($g.find("text")[0]);

				//测点前景默认样式
				//var $pointText = $($g.find("text")[0]);
				$pointText.attr('class', 'tooltipx');//设置提示样式
				$pointText.attr('dt', _dt);//设置测点
				areaDefaultParams.areaFronts.push({ fill: $pointText.attr("fill") });
				//测点背景默认样式
				var $pointRect = $($g.find("rect")[0]);
				$pointRect.attr('dt', _dt);//设置测点
				areaDefaultParams.areaBgs.push({ fill: $pointRect.attr("fill") });

				var p = _area;
				areaDefaultParams.areaPointJsons.push(p);

				isHasArea = true;

				$g.click(function () {
					parent.openAreaDraw(_area);
				})

			} else if (_alarm) {  //告警区域
				$g.attr("class", 'alarm');
				alarmPointObjs.push($g);

				var $pointText = $($g.find("text")[0]);

				//测点前景默认样式

				$pointText.attr('class', 'tooltipx');//设置提示样式
				$pointText.attr('dt', _dt);//设置测点
				alarmDefaultParams.alarmFronts.push({ fill: $pointText.attr("fill") });
				//测点背景默认样式
				var $pointRect = $($g.find("rect")[0]);
				$pointRect.attr('dt', _dt);//设置测点
				alarmDefaultParams.alarmBgs.push({ fill: $pointRect.attr("fill") });

				var p = _alarm;
				alarmDefaultParams.alarmPointJsons.push(p);

				isHasAlarm = true;


			} else if (_door) {  //门禁
				$g.attr("class", 'door');
				doorPointObjs.push($g);
				//测点前景默认样式
				var $pointText = $($g.find("text")[0]);
				$pointText.attr('class', 'tooltipx');//设置提示样式
				$pointText.attr('dt', _dt);//设置测点
				doorDefaultParams.doorFronts.push({ fill: $pointText.attr("fill") });
				//测点背景默认样式
				var $pointRect = $($g.find("rect")[0]);
				$pointRect.attr('dt', _dt);//设置测点
				doorDefaultParams.doorBgs.push({ fill: $pointRect.attr("fill") });

				var p = _door;
				doorDefaultParams.doorPointJsons.push(p);

				isHasDoor = true;

				$g.click(function () {
					parent.openDoorDraw(_door);
				})

			} else if (_kt) {//开关量
				pointObjs.push($g);
				$g.css({ cursor: 'pointer' }).click(function () {
					new jBox('Notice').setContent($(this).attr('title'));
				});
				//$g.attr('class', 'tooltipx');//设置提示样式
				$g.attr("class", 'point');
				defaultParams.fronts.push({ fill: null });
				defaultParams.bgs.push({ fill: null });

				var p = { pointName: _kt };
				defaultParams.pointJsons.push(p);

				//defaultParams.pointJsons += "{\"pointname\":\"" + _kt + "\"},";
				isHasPoint = true;
			} else if (_url) {//链接
				$g.css({ cursor: 'pointer' }).click(function () {
					window.location.href = $(this).attr('url');
				});
			} else if (_hct) {//柱子-横向
				pointObjs.push($g);
				$g.attr('class', 'tooltipx');//设置提示样式
				defaultParams.fronts.push({ fill: null });
				defaultParams.bgs.push({ fill: null });

				var p = { pointName: _hct };
				defaultParams.pointJsons.push(p);
				//defaultParams.pointJsons += "{\"pointname\":\"" + _hct + "\"},";
				isHasPoint = true;

			} else if (_vct) {//柱子-纵向
				pointObjs.push($g);
				$g.attr('class', 'tooltipx');//设置提示样式
				defaultParams.fronts.push({ fill: null });
				defaultParams.bgs.push({ fill: null });
				var p = { pointName: _vct };
				defaultParams.pointJsons.push(p);
				//defaultParams.pointJsons += "{\"pointname\":\"" + _vct + "\"},";
				isHasPoint = true;

			} else if (_pi) {
				$g.attr("class", 'pi');
				piPointObjs.push($g);

				//设置显示数据
				let $pointText = $($g.find("text")[0]);

				//测点前景默认样式
				//var $pointText = $($g.find("text")[0]);
				$pointText.attr('class', 'tooltipx');//设置提示样式
				$pointText.attr('pi', _pi);//设置测点
				piDefaultParams.piFronts.push({ fill: $pointText.attr("fill") });
				//测点背景默认样式
				var $pointRect = $($g.find("rect")[0]);
				$pointRect.attr('dt', _dt);//设置测点
				piDefaultParams.piBgs.push({ fill: $pointRect.attr("fill") });

				let point = _pi.replace("\\\\172.28.0.18\\", "");  //替换 \\172.28.0.18\dcs01pc121   为   dcs01pc121
				var p = { pointName: point };
				piDefaultParams.piPointJsons.push(p);

				isHasPi = true;

			}

			if (_channelAlarm) {
				isHasChannelAlarm = true;

				channelAlarmObjs.push($g);
				$g.css({ cursor: 'pointer' }).click(function () {
					new jBox('Notice').setContent($(this).attr('title'));
				});
				$g.attr('class', 'tooltipx');//设置提示样式
				channelAlarmParams.channelAlarmFronts.push({ fill: null });
				channelAlarmParams.channelAlarmBgs.push({ fill: null });

				channelAlarmParams.channelAlarmJsons.push(_channelAlarm);

			}
		});


	/* if(isHasPoint){//页面包含有测点

	} */

	if(isHasCamera){//页面包含有摄像头
		//initPlayPlugin();//初始化播放组件   这是回放组件，不是视频的
	}

	/* if(isHasTpPoint){
	}

	if(isHasIndPoint){
	}

	if(isHasImexpPoint){
	}
 */
	if(isHasPoint || isHasCamera || isHasTpPoint || isHasIndPoint || isHasImexpPoint || isHasPi){
		sis();//获取测点数据
	   // sisInterval = window.setInterval('sis()', parseInt(interval) *5000);//启动定时器,间隔调用获取测点数据

		checkUpdatePoint();//检查修改测点权限并进行控制
		$('.tooltipx').jBox('Tooltip');//设置测点提示
		initRightMenuPlugin();//初始化右键菜单，请注意该初始化必须放到遍历节点之后

		initPlayPlugin();  //初始化播放组件   这是回放组件，不是视频的
	}
});
//返回当前选择测点
function loadSelectedPoint(){
	//alert(checkedPoint);
	return checkedPoint;
}
//打开子页面
function showChild(currentSelectedPoint) {
   // EV_modeAlert();//弹出遮罩层 window.open('../trend/index.html?nowpoint='+currentSelectedPoint, '_blank');
    window.childWindow = window.open("../trend/index.html?nowpoint="+currentSelectedPoint, "child");
    newWindow=window.childWindow;
    window.childWindow.focus();//子窗口获取焦点

	//window.parent.mpAnalysis(currentSelectedPoint)
}
