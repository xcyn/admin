var histemptim;//历史时间


var buffflag = 1;
var buffreflag = 1;
var isbuff = "";
var histim;

var histmpdate;//需要查询的历史时间点
var nowtim;
var lastim;
var onspeed;
var buttonplayflag = "begin";
var buttonreplayflag = "begin";
var buttonspflag = "begin";
var buttonstopflag = "begin";
var buttonreflag = "first";
var buttonreverflag = "first";
var buttonsetflag = "close";
var timebefore = "";
var reflagbefore = "";
var onspeedbefore = "";
var bigflag = 1;//缩放倍数
var playtim = '';
var topHeight = 0;//顶部高度

/**************播放********************/

/**
 * 显示过程回放弹出框
 */
function showProcessPlaybackDialog() {
	document.getElementById("processPlaybackDialog").style.display = "";
}

/**
 * 获取快进时间
 */
function getHisTim() {
	var timup = histmpdate.getTime() + parseInt(onspeed) * parseInt(buffflag)
			* 1000;//取得进度条的值
	histemptim = new Date(timup).getFullYear() + ",";
	histemptim = histemptim + (new Date(timup).getMonth() + 1) + ",";
	histemptim = histemptim + new Date(timup).getDate() + ",";
	histemptim = histemptim + new Date(timup).getHours() + ",";
	histemptim = histemptim + new Date(timup).getMinutes() + ",";
	histemptim = histemptim + new Date(timup).getSeconds();
	var arrmphis = histemptim.split(",");
	var arrmpnow = nowtim.split(",");
	var arrmplas = lastim.split(",");
	var arrmphisdate = new Date(arrmphis[0], parseInt(arrmphis[1].toString().replace(/\b(0+)/gi,"")) - 1,
			arrmphis[2], arrmphis[3], arrmphis[4], arrmphis[5]);
	var arrmpnowdate = new Date(arrmpnow[0], parseInt(arrmpnow[1].toString().replace(/\b(0+)/gi,"")) - 1,
			arrmpnow[2], arrmpnow[3], arrmpnow[4], arrmpnow[5]);
	var arrmplasdate = new Date(arrmplas[0], parseInt(arrmplas[1].toString().replace(/\b(0+)/gi,"")) - 1,
			arrmplas[2], arrmplas[3], arrmplas[4], arrmplas[5]);
	var nowtimstr = "";
	nowtimstr = new Date().getFullYear() + ",";
	nowtimstr = nowtimstr + (new Date().getMonth() + 1) + ",";
	nowtimstr = nowtimstr + new Date().getDate() + ",";
	nowtimstr = nowtimstr + new Date().getHours() + ",";
	nowtimstr = nowtimstr + new Date().getMinutes() + ",";
	nowtimstr = nowtimstr + new Date().getSeconds();
	var arrmnowstr = nowtimstr.split(",");
	var nowdate = new Date(arrmnowstr[0], parseInt(arrmnowstr[1].toString().replace(/\b(0+)/gi,"")) - 1,
			arrmnowstr[2], arrmnowstr[3], arrmnowstr[4], arrmnowstr[5]);
	if (arrmphisdate < nowdate) {//比当前时间小
		var histmparry = histim.split(',');
		var hispdate = new Date(histmparry[0], parseInt(histmparry[1].toString().replace(/\b(0+)/gi,"")) - 1,
				histmparry[2], histmparry[3], histmparry[4], histmparry[5]);
		var reg = (arrmphisdate.getTime() - arrmplasdate.getTime())
				/ (arrmpnowdate.getTime() - arrmplasdate.getTime());
		//设置当前查询的时间
		document.getElementById("setbegin").value = maketwo(arrmphis[0]) + '-'
				+ maketwo(parseInt(arrmphis[1].toString().replace(/\b(0+)/gi,""))) + '-' + maketwo(arrmphis[2])
				+ ' ' + maketwo(arrmphis[3]) + ':' + maketwo(arrmphis[4]) + ':'
				+ maketwo(arrmphis[5]);
		var setbegin = document.getElementById("setbegin").value;
		document.getElementById("nowtim").value = setbegin.substring(0, 10);//年月日
		document.getElementById("nowtim1").value = setbegin.substring(11, 19);//时分秒
		histmpdate = arrmphisdate;//设置查询历史时间点
	} else {//比当前时间大,就取当前时间
		buttonreflag = "first";
		window.clearInterval(sisInterval);
		document.getElementById("buffshow").value = "real-time";
		sisInterval = window.setInterval('nowsettim()', parseInt(interval) * 1000);//定时取得当前时间
	}
}

//获取当前时间
function nowsettim() {
	document.getElementById("setbegin").value = maketwo(new Date().getFullYear())
			+ '-' + maketwo(new Date().getMonth() + 1) + '-'
			+ maketwo(new Date().getDate()) + ' '
			+ maketwo(new Date().getHours()) + ':'
			+ maketwo(new Date().getMinutes()) + ':'
			+ maketwo(new Date().getSeconds());
	var nowtimstr = "";
	nowtimstr = new Date().getFullYear() + ",";
	nowtimstr = nowtimstr + (new Date().getMonth() + 1) + ",";
	nowtimstr = nowtimstr + new Date().getDate() + ",";
	nowtimstr = nowtimstr + new Date().getHours() + ",";
	nowtimstr = nowtimstr + new Date().getMinutes() + ",";
	nowtimstr = nowtimstr + new Date().getSeconds();
	var arrmnowstr = nowtimstr.split(",");
	var nowdate = new Date(arrmnowstr[0], parseInt(arrmnowstr[1].toString().replace(/\b(0+)/gi,"")) - 1, arrmnowstr[2], arrmnowstr[3], arrmnowstr[4], arrmnowstr[5]);
	histmpdate = nowdate;//当前时间
	var setbegin = document.getElementById("setbegin").value;
	document.getElementById("nowtim").value = setbegin.substring(0, 10);//年月日
	document.getElementById("nowtim1").value = setbegin.substring(11, 19);//时分秒
	sis(0);//获得当前实时数据
}

//获取快退时间
function getHisTim1() {
	var timup = histmpdate.getTime() - parseInt(onspeed) * parseInt(buffreflag) * 1000;
	histemptim = new Date(timup).getFullYear() + ",";
	histemptim = histemptim + (new Date(timup).getMonth() + 1) + ",";
	histemptim = histemptim + new Date(timup).getDate() + ",";
	histemptim = histemptim + new Date(timup).getHours() + ",";
	histemptim = histemptim + new Date(timup).getMinutes() + ",";
	histemptim = histemptim + new Date(timup).getSeconds();
	var arrmphis = histemptim.split(",");
	var arrmpnow = nowtim.split(",");
	var arrmplas = lastim.split(",");
	var arrmphisdate = new Date(arrmphis[0], parseInt(arrmphis[1].toString().replace(/\b(0+)/gi,"")) - 1, arrmphis[2], arrmphis[3], arrmphis[4], arrmphis[5]);
	var arrmpnowdate = new Date(arrmpnow[0], parseInt(arrmpnow[1].toString().replace(/\b(0+)/gi,"")) - 1, arrmpnow[2], arrmpnow[3], arrmpnow[4], arrmpnow[5]);
	var arrmplasdate = new Date(arrmplas[0], parseInt(arrmplas[1].toString().replace(/\b(0+)/gi,"")) - 1, arrmplas[2], arrmplas[3], arrmplas[4], arrmplas[5]);
	var histmparry = histim.split(',');
	var hispdate = new Date(histmparry[0], parseInt(histmparry[1]) - 1, histmparry[2], histmparry[3], histmparry[4], histmparry[5]);
	if (arrmphisdate.getFullYear() > 1999) {//年份大于1999
		document.getElementById("setbegin").value = maketwo(arrmphis[0]) + '-' + maketwo(parseInt(arrmphis[1].toString().replace(/\b(0+)/gi,""))) + '-' + maketwo(arrmphis[2]) + ' ' + maketwo(arrmphis[3]) + ':' + maketwo(arrmphis[4]) + ':' + maketwo(arrmphis[5]);
		var setbegin = document.getElementById("setbegin").value;
		document.getElementById("nowtim").value = setbegin.substring(0, 10);
		document.getElementById("nowtim1").value = setbegin.substring(11, 19);
		histmpdate = arrmphisdate;
	} else {
		document.getElementById("button_sp").click();
	}
}

function reflagout() {
	document.getElementById("reflag").blur();
	var reflagval = document.getElementById("reflag").value;
	if (isNaN(reflagval) || reflagval == "") {
		alert("请填入数字");
		document.getElementById("reflag").value = reflagbefore;
	} else {
		reflagbefore = reflagval;
	}
}

function reflagover() {
	document.getElementById("reflag").focus();// ???????
	var reflagval = document.getElementById("reflag").value;
	document.getElementById("reflag").value = reflagval;
	reflagbefore = reflagval;
}

function onspeedout() {
	document.getElementById("onspeed").blur();//reflagbefore
	var onspeedval = document.getElementById("onspeed").value;
	if (isNaN(onspeedval) || onspeedval == "") {
		alert("请填入数字");
		document.getElementById("onspeed").value = onspeedbefore;
	} else {
		onspeedbefore = onspeedval;
	}
}

function onspeedover() {
	document.getElementById("onspeed").focus();// ???????
	var onspeedval = document.getElementById("onspeed").value;
	document.getElementById("onspeed").value = onspeedval;
	onspeedbefore = onspeedval;
}

function setbeginout() {
	document.getElementById("setbegin").blur();
	var setbeginval = document.getElementById("setbegin").value;
	if (/^(?:(?:(?:(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(\/|-)(?:0?2\1(?:29)))|(?:(?:(?:1[6-9]|[2-9]\d)?\d{2})(\/|-)(?:(?:(?:0?[13578]|1[02])\2(?:31))|(?:(?:0?[1,3-9]|1[0-2])\2(29|30))|(?:(?:0?[1-9])|(?:1[0-2]))\2(?:0?[1-9]|1\d|2[0-8])))))\s(?:([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d)$/m.test(setbeginval)) {
		timebefore = setbeginval;
	} else {
		alert("日期格式不正确" + "!");
		document.getElementById("setbegin").value = timebefore;

	}
}

function setbeginover() {
	document.getElementById("setbegin").focus();
	var setbeginval = document.getElementById("setbegin").value;
	timebefore = setbeginval;
	document.getElementById("setbegin").value = setbeginval;
}

function playPlugin_replaymouseover() {
	if (buttonreplayflag == "begin") {
		document.getElementById("button_replay").src = sisRootPath+"plugins/play/images/button_back_hover.gif";
	}
}

function playPlugin_replaymouseout() {
	if (buttonreplayflag == "begin") {
		document.getElementById("button_replay").src = sisRootPath+"plugins/play/images/button_back.gif";
	}
}

function playPlugin_playmouseover() {
	if (buttonplayflag == "begin") {
		document.getElementById("button_play").src = sisRootPath+"plugins/play/images/button_play_hover.gif";
	}
}

function playPlugin_playmouseout() {
	if (buttonplayflag == "begin") {
		document.getElementById("button_play").src = sisRootPath+"plugins/play/images/button_play.gif";
	}
}

function playPlugin_spmouseover() { //alert(1);
	if (buttonspflag == "begin") {
		document.getElementById("button_sp").src = sisRootPath+"plugins/play/images/button_sp_hover.gif";
	}
}

function playPlugin_spmouseout() {
	if (buttonspflag == "begin") {
		document.getElementById("button_sp").src = sisRootPath+"plugins/play/images/button_sp.gif";
	}
}

function playPlugin_stopmouseover() { //alert(1);
	if (buttonstopflag == "begin") {
		document.getElementById("button_stop").src = sisRootPath+"plugins/play/images/button_stop_hover.gif";
	}
}

function playPlugin_stopmouseout() {
	if (buttonstopflag == "begin") {
		document.getElementById("button_stop").src = sisRootPath+"plugins/play/images/button_stop.gif";
	}
}

function playPlugin_fastreplaymouseover() {
	document.getElementById("button_fastreplay").src = sisRootPath+"plugins/play/images/button_backd_hover.gif";
}

function playPlugin_fastreplaymousedown() {
	document.getElementById("button_fastreplay").src = sisRootPath+"plugins/play/images/button_backd_active.gif";
}

function playPlugin_fastreplaymouseup() {
	document.getElementById("button_fastreplay").src = sisRootPath+"plugins/play/images/button_backd.gif";
}

function playPlugin_fastreplaymouseout() {
	document.getElementById("button_fastreplay").src = sisRootPath+"plugins/play/images/button_backd.gif";
}

/**
 * 快进重放
 */
function playPlugin_fastreplayclick() {
	document.getElementById("button_replay").click();
	if (isbuff == 1) {
		if (buffreflag <= 32) {
			buffreflag = parseInt(buffreflag) * 2;
		} else {
			buffreflag = 1;
		}
	} else {
		if (buffreflag <= 32) {
			buffreflag = parseInt(buffreflag) * 2;
		} else {
			buffreflag = 1;
		}
		buffflag = 1;
	}
	document.getElementById("buffshow").value = buffreflag + " X " + document.getElementById("onspeed1").value;
}

function playPlugin_fastplaymousedown() {
	document.getElementById("button_fastplay").src = sisRootPath+"plugins/play/images/button_gogod_active.gif";
}

function playPlugin_fastplaymouseover() {
	document.getElementById("button_fastplay").src = sisRootPath+"plugins/play/images/button_gogod_hover.gif";
}

function playPlugin_fastplaymouseup() {
	document.getElementById("button_fastplay").src = sisRootPath+"plugins/play/images/button_gogod.gif";
}

function playPlugin_fastplaymouseout() {
	document.getElementById("button_fastplay").src = sisRootPath+"plugins/play/images/button_gogod.gif";
}

/**
 * 快进
 */
function playPlugin_fastplayclick() {
	document.getElementById("button_play").click();
	if (isbuff == 0) {
		if (buffflag <= 32) {
			buffflag = parseInt(buffflag) * 2;
		} else {
			buffflag = 1;
		}
	} else {
		if (buffflag <= 32) {
			buffflag = parseInt(buffflag) * 2;
		} else {
			buffflag = 1;
		}
		buffreflag = 1;
	}
	document.getElementById("buffshow").value = buffflag + " X " + document.getElementById("onspeed1").value;
}

/**
 * 设置鼠标覆盖时操作
 */
function playPlugin_setmouseover() { //alert(1);
	document.getElementById("button_set").src = sisRootPath+"plugins/play/images/button_set_hover.gif";
}

/**
 * 设置鼠标移除时操作
 */
function playPlugin_setmouseout() {
	if (buttonsetflag == 'close') {
		document.getElementById("button_set").src = sisRootPath+"plugins/play/images/button_set.gif";
	} else if (buttonsetflag == 'open') {
		document.getElementById("button_set").src = sisRootPath+"plugins/play/images/button_set_active.gif";
	}
}

/**
 * 关闭
 */
function playPlugin_close() {
	clearInterval(sisInterval);
	playPlugin_stop();
	var mydiv = document.getElementById("processPlaybackDialog");
	mydiv.style.display = "none";
	tiannetHideControl();
	sisInterval = window.setInterval('sis(0)', parseInt(interval) * 1000);
}

/**
 * 设置打开或关闭时是否显示
 */
function playPlugin_set() {
	if (buttonsetflag == 'close') {
		document.getElementById("dis1").style.display = "";
		document.getElementById("dis2").style.display = "";
		document.getElementById("table0").style.width = "293px";
		buttonsetflag = "open";
		document.getElementById("button_set").src = sisRootPath+"plugins/play/images/button_set_active.gif";
	} else if (buttonsetflag == 'open') {
		document.getElementById("dis1").style.display = "none";
		document.getElementById("dis2").style.display = "none";
		document.getElementById("table0").style.width = "293px";
		buttonsetflag = "close";
		document.getElementById("button_set").src = sisRootPath+"plugins/play/images/button_set.gif";
	}
}

/**
 * 隐藏
 */
function playPlugin_disable() {
	if (buttonspflag == "begin") {
		document.getElementById("i").style.display = "none";
		document.getElementById("ii").style.display = "none";
		document.getElementById("iii").style.display = "none";
		document.getElementById("ino").style.display = "";
		document.getElementById("iino").style.display = "";
		document.getElementById("iiino").style.display = "";
	} else if (buttonspflag == "beclick") {
		document.getElementById("i").style.display = "";
		document.getElementById("ii").style.display = "";
		document.getElementById("iii").style.display = "";
		document.getElementById("ino").style.display = "none";
		document.getElementById("iino").style.display = "none";
		document.getElementById("iiino").style.display = "none";
	}
}

/**
 * 播放
 */
function playPlugin_play() {
	clearInterval(sisInterval);
	window.clearInterval(sisInterval);
	onspeed = '';
	buttonspflag = "begin";
	document.getElementById("button_sp").src = sisRootPath+"plugins/play/images/button_sp.gif";
	document.getElementById("button_replay").src = sisRootPath+"plugins/play/images/button_back.gif";
	buffreflag = 1;
	isbuff = 0;
	document.getElementById("buffshow").value = buffflag + " X " + document.getElementById("onspeed1").value;
	var setbeginval = document.getElementById("setbegin").value;
	playtim = setbeginval;
	histim = '';
	histim = histim + setbeginval.substring(0, 4) + ",";
	histim = histim + setbeginval.substring(5, 7) + ",";
	histim = histim + setbeginval.substring(8, 10) + ",";
	histim = histim + setbeginval.substring(11, 13) + ",";
	histim = histim + setbeginval.substring(14, 16) + ",";
	histim = histim + setbeginval.substring(17, 19) + ",";
	histemptim = histim;
	var histmparry = histim.split(',');
	histmpdate = new Date(histmparry[0], parseInt(histmparry[1].toString().replace(/\b(0+)/gi,"")) - 1, histmparry[2], histmparry[3], histmparry[4], histmparry[5]);
	nowtim = '';
	nowtim = nowtim + new Date().getFullYear() + ",";
	nowtim = nowtim + maketwo(new Date().getMonth() + 1) + ",";
	nowtim = nowtim + maketwo(new Date().getDate()) + ",";
	nowtim = nowtim + maketwo(new Date().getHours()) + ",";
	nowtim = nowtim + maketwo(new Date().getMinutes()) + ",";
	nowtim = nowtim + maketwo(new Date().getSeconds());
	var datendarry = nowtim.split(',');
	var datend = new Date(datendarry[0], parseInt(datendarry[1].toString().replace(/\b(0+)/gi,"")) - 1, datendarry[2], datendarry[3], datendarry[4], datendarry[5]);
	var counttim = datend.getTime() - histmpdate.getTime();
	var lascounttim = datend.getTime() - 2 * counttim;
	lastim = '';
	lastim = lastim + new Date(lascounttim).getFullYear() + ",";
	lastim = lastim + maketwo(new Date(lascounttim).getMonth() + 1) + ",";
	lastim = lastim + maketwo(new Date(lascounttim).getDate()) + ",";
	lastim = lastim + maketwo(new Date(lascounttim).getHours()) + ",";
	lastim = lastim + maketwo(new Date(lascounttim).getMinutes()) + ",";
	lastim = lastim + maketwo(new Date(lascounttim).getSeconds());
	buttonplayflag = "beclick";
	document.getElementById("button_play").src = sisRootPath+"plugins/play/images/button_play_active.gif";
	onspeed = document.getElementById("onspeed").value;
	var reflag = document.getElementById("reflag").value;
	playPlugin_disable();
	sisInterval = window.setInterval('sis(1)', parseInt(reflag) * 1000);

}

/**
 * 重放
 */
function playPlugin_replay() {
	clearInterval(sisInterval);
	window.clearInterval(sisInterval);
	onspeed = '';
	buttonspflag = "begin";
	document.getElementById("button_sp").src = sisRootPath+"plugins/play/images/button_sp.gif";
	document.getElementById("button_play").src = sisRootPath+"plugins/play/images/button_play.gif";
	isbuff = 1;
	buffflag = 1;
	document.getElementById("buffshow").value = buffreflag + " X " + document.getElementById("onspeed1").value;
	var setbeginval = document.getElementById("setbegin").value;
	playtim = setbeginval;
	histim = '';
	histim = histim + setbeginval.substring(0, 4) + ",";
	histim = histim + setbeginval.substring(5, 7) + ",";
	histim = histim + setbeginval.substring(8, 10) + ",";
	histim = histim + setbeginval.substring(11, 13) + ",";
	histim = histim + setbeginval.substring(14, 16) + ",";
	histim = histim + setbeginval.substring(17, 19) + ",";
	histemptim = histim;
	var histmparry = histim.split(',');
	histmpdate = new Date(histmparry[0], parseInt(histmparry[1].toString().replace(/\b(0+)/gi,"")) - 1, histmparry[2], histmparry[3], histmparry[4], histmparry[5]);
	nowtim = '';
	nowtim = nowtim + new Date().getFullYear() + ",";
	nowtim = nowtim + maketwo(new Date().getMonth() + 1) + ",";
	nowtim = nowtim + maketwo(new Date().getDate()) + ",";
	nowtim = nowtim + maketwo(new Date().getHours()) + ",";
	nowtim = nowtim + maketwo(new Date().getMinutes()) + ",";
	nowtim = nowtim + maketwo(new Date().getSeconds());
	var datendarry = nowtim.split(',');
	var datend = new Date(datendarry[0], parseInt(datendarry[1].toString().replace(/\b(0+)/gi,"")) - 1, datendarry[2], datendarry[3], datendarry[4], datendarry[5]);
	var counttim = datend.getTime() - histmpdate.getTime();
	var lascounttim = datend.getTime() - 2 * counttim;
	lastim = '';
	lastim = lastim + new Date(lascounttim).getFullYear() + ",";
	lastim = lastim + maketwo(new Date(lascounttim).getMonth() + 1) + ",";
	lastim = lastim + maketwo(new Date(lascounttim).getDate()) + ",";
	lastim = lastim + maketwo(new Date(lascounttim).getHours()) + ",";
	lastim = lastim + maketwo(new Date(lascounttim).getMinutes()) + ",";
	lastim = lastim + maketwo(new Date(lascounttim).getSeconds());
	buttonreplayflag = "beclick";
	playPlugin_disable();
	document.getElementById("button_replay").src = sisRootPath+"plugins/play/images/button_back_acivie.gif";
	onspeed = document.getElementById("onspeed").value;
	var reflag = document.getElementById("reflag").value;
	sisInterval = window.setInterval('sis(-1)', parseInt(reflag) * 1000);
}


function playPlugin_sp() {
	if (buttonplayflag == "beclick") {
		window.clearInterval(sisInterval);
		buttonplayflag = "begin";
		buttonspflag = "beclick";
		buttonreflag = "again";
		document.getElementById("button_play").src = sisRootPath+"plugins/play/images/button_play.gif";
		document.getElementById("button_sp").src = sisRootPath+"plugins/play/images/button_sp_active.gif";
	}
	if (buttonreplayflag == "beclick") {
		window.clearInterval(sisInterval);
		buttonreplayflag = "begin";
		buttonspflag = "beclick";
		buttonreverflag = "again";
		document.getElementById("button_replay").src = sisRootPath+"plugins/play/images/button_back.gif";
		document.getElementById("button_sp").src = sisRootPath+"plugins/play/images/button_sp_active.gif";
	}
}

/**
 * 停止
 */
function playPlugin_stop() {
	buttonplayflag = "begin";
	buttonreplayflag = "begin";
	buttonspflag = "beclick";
	buttonreflag = "first";
	buttonreverflag = "first";
	document.getElementById("button_play").src = sisRootPath+"plugins/play/images/button_play.gif";
	document.getElementById("button_replay").src = sisRootPath+"plugins/play/images/button_back.gif";
	buffflag = 1;
	buffreflag = 1;
	isbuff = "";
	playPlugin_disable();
	window.clearInterval(sisInterval);
	document.getElementById("buffshow").value = "wait....";
	document.getElementById("button_sp").src = sisRootPath+"plugins/play/images/button_sp_active.gif";
}

function playPlugin_stopmousedown() {
	document.getElementById("button_sp").src = sisRootPath+"plugins/play/images/button_sp_active.gif";
}

/**
 * 设置两位数,如果不足两位，就在前面加0
 * @param num 数值
 * @returns
 */
function maketwo(num) {
	if (num < 10) {
		num = "0" + num;
	}
	return num;
}

/**
 * 初始化当前时间到工具条
 */
function initNavToolTime() {
	document.getElementById("setbegin").value = new Date().getFullYear() + "-" + maketwo(new Date().getMonth() + 1) + "-" + maketwo(new Date().getDate()) + " ";
	document.getElementById("setbegin").value = document.getElementById("setbegin").value + maketwo(new Date().getHours() - 1) + ":" + maketwo(new Date().getMinutes()) + ":" + maketwo(new Date().getSeconds());
	var setbegin = document.getElementById("setbegin").value;
	document.getElementById("nowtim").value = setbegin.substring(0, 10);//年月日
	document.getElementById("nowtim1").value = setbegin.substring(11, 19);//时分秒
}

function SelectHtm(res) {
	var htmstr = "";
	if (res == "days") {
		htmstr = '<select style="margin:-2;" id="days">';
		for ( var i = 1; i <= 31; i++) {
			if (i < 10) {
				htmstr = htmstr + '<option value=0' + i + '>0' + i
						+ '</option>';
			} else {
				htmstr = htmstr + '<option value=' + i + '>' + i + '</option>';
			}
		}
		htmstr = htmstr + '</select>';
		return htmstr;
	} else if (res == "hours") {
		htmstr = '<select style="margin:-2;" id="hours">';
		for ( var i = 0; i <= 23; i++) {
			if (i < 10) {
				htmstr = htmstr + '<option value=0' + i + '>0' + i
						+ '</option>';
			} else {
				htmstr = htmstr + '<option value=' + i + '>' + i + '</option>';
			}
		}
		htmstr = htmstr + '</select>';
		return htmstr;
	} else if (res == "minutes") {
		htmstr = '<select style="margin:-2;" id="minutes">';
		for ( var i = 0; i <= 59; i++) {
			if (i < 10) {
				htmstr = htmstr + '<option value=0' + i + '>0' + i
						+ '</option>';
			} else {
				htmstr = htmstr + '<option value=' + i + '>' + i + '</option>';
			}
		}
		htmstr = htmstr + '</select>';
		return htmstr;
	} else if (res == "seconds") {
		htmstr = '<select style="margin:-2;" id="seconds">';
		for ( var i = 0; i <= 59; i++) {
			if (i < 10) {
				htmstr = htmstr + '<option value=0' + i + '>0' + i
						+ '</option>';
			} else {
				htmstr = htmstr + '<option value=' + i + '>' + i + '</option>';
			}
		}
		htmstr = htmstr + '</select>';
		return htmstr;
	} else if (res == "months") {
		htmstr = '<select style="margin:-2;" id="months">';
		for ( var i = 1; i <= 12; i++) {
			if (i < 10) {
				htmstr = htmstr + '<option value=0' + i + '>0' + i
						+ '</option>';
			} else {
				htmstr = htmstr + '<option value=' + i + '>' + i + '</option>';
			}
		}
		htmstr = htmstr + '</select>';
		return htmstr;
	}
}

function ShowPoint(flag) {
	if(flag > 0){
		document.getElementById("tr" + flag).style.backgroundImage = "url("+sisRootPath+"plugins/play/images/right_hover.gif)";
	}else{
		document.getElementById("tr" + (-flag)).style.backgroundImage = "";
	}
}


function selecttim(text, value) {
	document.getElementById("onspeed").value = value;
	document.getElementById("onspeed1").value = text;
	document.getElementById("m").style.visibility = 'hidden';
}
function selecttim1(text, value) {
	document.getElementById("reflag").value = value;
	document.getElementById("reflag1").value = text;
	document.getElementById("mm").style.visibility = 'hidden';
}

function show(o) {
	var m = document.getElementById("m");
	var i = document.getElementById("i");
	m.style.left = 198 + i.style.left;
	m.style.top = i.style.top + 120;
	if (document.getElementById("m").style.visibility != "hidden") {
		document.getElementById("m").style.visibility = 'hidden';
	} else {
		m.style.visibility = '';
	}
}
function show1(o) {
	var m = document.getElementById("mm");
	var i = document.getElementById("ii");
	m.style.left = 60 + i.style.left; 
	m.style.top = i.style.top + 120;
	if (m.style.visibility != "hidden") {
		m.style.visibility = 'hidden';
	} else {
		m.style.visibility = '';
	}
}

function show3() {
	if ((document.all.divTiannetDate.style.display) == 'none') {
		var i = document.getElementById("setbegin");
		var ii = document.getElementById("nowtim");
		var iii = document.getElementById("nowtim1");
		setDayHM1(i, ii, iii);
	} else {
		tiannetHideControl();
	}
}

/***************播放end*******************/


/**
 * 初始化播放组件
 */
function initPlayPlugin(){
	var strHTML = '';
	strHTML += '<div id="processPlaybackDialog" style="display:none;padding-bottom:10px;border: 1px solid #707984;Z-INDEX: 10003;left:0px;top:0px; position:absolute;background-image:url('+sisRootPath+'plugins/play/images/tool_bg.gif);" > ';
	strHTML += '<div id="title" title="'
			+ '提示:可进行拖拽'
			+ '" style="border-bottom: 1px solid #707984;WIDTH: 293px;height:17px;background-image:url('+sisRootPath+'plugins/play/images/tool_bg_title.jpg);text-align:right;cursor:move;" ><img style="margin-top:2px;margin-left:-12px;cursor:pointer;" id="button_close" onclick="playPlugin_close()" src="'+sisRootPath+'plugins/play/images/button_close.gif"/></div>';//style="cursor:move;"
	strHTML += '<div id="content" style="">';
	strHTML += '<table id="table0" style="width:293px;" BORDER=0>';
	strHTML += '<tr style="height:6px;"><td>';
	strHTML += '</td></tr>';
	strHTML += '<tr><td>';
	strHTML += '<LABEL style="WIDTH: 8px; HEIGHT: 19px"></LABEL>';
	strHTML += '<input readOnly style="width:125px;height:30px;line-height:28px;VERTICAL-ALIGN: middle;font-size:18px;font-family:Verdana;text-align:center; border-color:#899ab2;border-style:solid;border-width:1 0 1 1;" id="nowtim" name="nowtim"/>';
	strHTML += '<input readOnly style="width:125px;height:30px;line-height:28px;VERTICAL-ALIGN: middle;font-size:24px;font-family:Verdana;text-align:center; border-color:#899ab2;border-style:solid;border-width:1 0 1 1;" id="nowtim1" name="nowtim1"/>';
	strHTML += '<input readOnly  style="display:none;VERTICAL-ALIGN: middle;font-weight:600;text-align:center;font-family:Verdana;width:150px;height:19px;border-color:transparent;border-style:solid;border-width:1;" type="text" id="setbegin" name="setbegin"/>';//onmouseover="setbeginover()" onmouseout="setbeginout()"
	strHTML += '<img style="VERTICAL-ALIGN: middle;cursor:pointer;" id="iii" onclick="show3()" onMouseOver="" onMouseOut=""  src="'+sisRootPath+'plugins/play/images/button_bigmenu.gif"/>';
	strHTML += '<img style="display:none;VERTICAL-ALIGN: middle;cursor:pointer;" id="iiino"   src="'+sisRootPath+'plugins/play/images/button_bigmenuno.gif"/>';
	strHTML += '</td></tr>';
	strHTML += '<tr style="height:8px;"><td>';
	strHTML += '</td></tr>';
	strHTML += '<tr><td>';
	strHTML += '<LABEL style="WIDTH: 8px; HEIGHT: 19px"></LABEL>';
	strHTML += '<img style="VERTICAL-ALIGN: middle;cursor:pointer;" title="快退倍数"  id="button_fastreplay" onmouseup="playPlugin_fastreplaymouseup()" onmousedown="playPlugin_fastreplaymousedown()" onmouseout="playPlugin_fastreplaymouseout()" onmouseover="playPlugin_fastreplaymouseover()" onclick="playPlugin_fastreplayclick()" src="'+sisRootPath+'plugins/play/images/button_backd.gif"/>';
	strHTML += '<img style="VERTICAL-ALIGN: middle;cursor:pointer;" title="开始快退" id="button_replay" onmouseout="playPlugin_replaymouseout()" onmouseover="playPlugin_replaymouseover()" onclick="playPlugin_replay()" src="'+sisRootPath+'plugins/play/images/button_back.gif"/>';
	strHTML += '<img style="VERTICAL-ALIGN: middle;cursor:pointer;" title="开始快进" id="button_play" onmouseout="playPlugin_playmouseout()" onmouseover="playPlugin_playmouseover()" onclick="playPlugin_play()" src="'+sisRootPath+'plugins/play/images/button_play.gif"/>';
	strHTML += '<img style="VERTICAL-ALIGN: middle;cursor:pointer;" title="快进倍数" id="button_fastplay" onmouseup="playPlugin_fastplaymouseup()" onmousedown="playPlugin_fastplaymousedown()" onmouseout="playPlugin_fastplaymouseout()" onmouseover="playPlugin_fastplaymouseover()" onclick="playPlugin_fastplayclick()" src="'+sisRootPath+'plugins/play/images/button_gogod.gif"/>';
	strHTML += '<img style="VERTICAL-ALIGN: middle;cursor:pointer;" title="暂停" id="button_sp" onmouseout="playPlugin_spmouseout()" onmouseover="playPlugin_spmouseover()" onmousedown="playPlugin_stopmousedown()" onclick="playPlugin_stop()" src="'+sisRootPath+'plugins/play/images/button_sp.gif"/>';
	strHTML += '<img style="display:none;VERTICAL-ALIGN: middle;cursor:pointer;" id="button_stop" onmousedown="playPlugin_stopmousedown()" onmouseout="playPlugin_stopmouseout()" onmouseover="playPlugin_stopmouseover()" onclick="playPlugin_stop()" src="'+sisRootPath+'plugins/play/images/button_stop.gif"/>';
	strHTML += '<img style="VERTICAL-ALIGN: middle;cursor:pointer;display:none;" id="button_set" onmouseout="playPlugin_setmouseout()" onmouseover="playPlugin_setmouseover()" onclick="playPlugin_set()" src="'+sisRootPath+'plugins/play/images/button_set.gif"/>';
	strHTML += '<LABEL style="WIDTH: 13px; HEIGHT: 19px"></LABEL>';
	strHTML += '<input readOnly value="ready...." style="width:83px;height:19px;background-color:#88f9d8;VERTICAL-ALIGN: middle;text-align:center;font-family:Verdana;border-color:#899ab2;border-style:solid;border-width:1;" type="text" id="buffshow" name="buffshow"/>';
	strHTML += '</td></tr>';
	strHTML += '<tr>';
	strHTML += '<td id=dis2 style="display:none"><p style="font-size:12;color:black">';
	strHTML += '<LABEL style="WIDTH: 8px; HEIGHT: 19px"></LABEL>';
	strHTML += ''
			+ '刷新频率'
			+ '&nbsp;<input  onmouseover="reflagover()" onmouseout="reflagout()" value="1" style="display:none;VERTICAL-ALIGN: middle;font-weight:600;font-family:Verdana;text-align:center;width:40px; border-color:transparent;border-style:solid;border-width:1;" type="text" id="reflag" name="reflag"/>';
	strHTML += '<input readOnly value="1S" style="width:55px;height:19px;VERTICAL-ALIGN: middle;font-family:Verdana;text-align:center; border-color:#899ab2;border-style:solid;border-width:1 0 1 1;" type="text" id="reflag1" name="reflag1"/>';
	strHTML += '<img style="VERTICAL-ALIGN: middle;cursor:pointer;" id="ii" onclick="show1(this)" onMouseOver="" onMouseOut=""  src="'+sisRootPath+'plugins/play/images/button_menu.gif"/>';
	strHTML += '<img style="display:none;VERTICAL-ALIGN: middle;cursor:pointer;" id="iino"  src="'+sisRootPath+'plugins/play/images/button_menu_no.gif"/>';
	strHTML += '&nbsp;&nbsp;' + '播放速度' + '&nbsp;';
	strHTML += '<input  onmouseover="onspeedover()" onmouseout="onspeedout()" value="1" style="display:none;VERTICAL-ALIGN: middle;font-weight:600;font-family:Verdana;text-align:center;width:40px; border-color:transparent;border-style:solid;border-width:1;" type="text" id="onspeed" name="onspeed"/>';
	strHTML += '<input readOnly value="1S" style="width:55px;height:19px;VERTICAL-ALIGN: middle;font-family:Verdana;text-align:center; border-color:#899ab2;border-style:solid;border-width:1 0 1 1;" type="text" id="onspeed1" name="onspeed1"/>';
	strHTML += '<img style="VERTICAL-ALIGN: middle;cursor:pointer;" id="i" onclick="show(this)" onMouseOver="" onMouseOut=""  src="'+sisRootPath+'plugins/play/images/button_menu.gif"/>';
	strHTML += '<img style="display:none;VERTICAL-ALIGN: middle;cursor:pointer;" id="ino" src="'+sisRootPath+'plugins/play/images/button_menu_no.gif"/>';
	strHTML += '</p></td></tr>';
	strHTML += '<tr id=dis1 style="height:5px;display:none;"><td>';
	strHTML += '</td></tr>';
	strHTML += '</table>';
	strHTML += '</div>';
	strHTML += '<div id=m style="background-color:white;visibility:hidden;position:absolute;width:82;padding:2;border:1 solid #899ab2;z-index:10004" >';//onclick="show(i)" onMouseOver="" onMouseOut=""hide()
	strHTML += '<table BORDER=0 style="">';
	strHTML += '<tr><td><LABEL style="WIDTH: 16px; HEIGHT: 19px"></LABEL><a onclick="selecttim(this.innerText,1)" style="font-size:13px;font-family:Verdana;text-decoration:none;color:#222;" href="#">1S</a></td></tr>';
	strHTML += '<tr><td><LABEL style="WIDTH: 16px; HEIGHT: 19px"></LABEL><a onclick="selecttim(this.innerText,60)" style="font-size:13px;font-family:Verdana;text-decoration:none;color:#222;" href="#">1M</a></td></tr>';
	strHTML += '<tr><td><LABEL style="WIDTH: 16px; HEIGHT: 19px"></LABEL><a onclick="selecttim(this.innerText,3600)" style="font-size:13px;font-family:Verdana;text-decoration:none;color:#222;" href="#">1H</a></td></tr>';
	strHTML += '<tr><td><LABEL style="WIDTH: 16px; HEIGHT: 19px"></LABEL><a onclick="selecttim(this.innerText,86400)" style="font-size:13px;font-family:Verdana;text-decoration:none;color:#222;" href="#">1D</a></td></tr>';
	strHTML += '<tr><td><LABEL style="WIDTH: 16px; HEIGHT: 19px"></LABEL><a onclick="selecttim(this.innerText,2592000)" style="font-size:13px;font-family:Verdana;text-decoration:none;color:#222;" href="#">1MN</td></tr>';
	strHTML += '</table>';
	strHTML += '</div>';
	strHTML += '<div id=mm style="background-color:white;visibility:hidden;position:absolute;width:82;padding:2;border:1 solid #899ab2;z-index:10004" >';//onclick="show(i)" onMouseOver="" onMouseOut=""hide()
	strHTML += '<table BORDER=0 style="">';
	strHTML += '<tr><td><LABEL style="WIDTH: 16px; HEIGHT: 19px"></LABEL><a onclick="selecttim1(this.innerText,1)" style="font-size:13px;font-family:Verdana;text-decoration:none;color:#222;" href="#">1S</a></td></tr>';
	strHTML += '<tr><td><LABEL style="WIDTH: 16px; HEIGHT: 19px"></LABEL><a onclick="selecttim1(this.innerText,2)" style="font-size:13px;font-family:Verdana;text-decoration:none;color:#222;" href="#">2S</a></td></tr>';
	strHTML += '<tr><td><LABEL style="WIDTH: 16px; HEIGHT: 19px"></LABEL><a onclick="selecttim1(this.innerText,3)" style="font-size:13px;font-family:Verdana;text-decoration:none;color:#222;" href="#">3S</a></td></tr>';
	strHTML += '<tr><td><LABEL style="WIDTH: 16px; HEIGHT: 19px"></LABEL><a onclick="selecttim1(this.innerText,4)" style="font-size:13px;font-family:Verdana;text-decoration:none;color:#222;" href="#">4S</a></td></tr>';
	strHTML += '<tr><td><LABEL style="WIDTH: 16px; HEIGHT: 19px"></LABEL><a onclick="selecttim1(this.innerText,5)" style="font-size:13px;font-family:Verdana;text-decoration:none;color:#222;" href="#">5S</a></td></tr>';
	strHTML += '</table>';
	strHTML += '</div></div>';
	
	document.body.insertAdjacentHTML("afterBegin", strHTML);//在body之前插入对象
	
	initNavToolTime();//初始化当前时间到工具条
	
	$("#processPlaybackDialog").drag();//设置播放窗口可拖动
}

