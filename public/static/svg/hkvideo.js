/*beforeDestroy(){
    this.initPlugin(3,null); //在页面关闭前销毁摄像头画面，不然画面会一直浮在页面上
} */
// 创建播放实例
//this_.initPlugin(0,null);
//this_.initPlugin(11,null)  //全屏
// this_.initPlugin(1,{cameraCode:code});  //预览播放 
/*if("camera"==type){
    this.initPlugin(1,{cameraCode:node.key});
}
this.initPlugin(5,{type:1})  */

//文件里写死，否则 调用巡检或者 安全模块，依赖性比较强
var g_appkey = "";//海康IP
var g_secret = "";//海康端口号
var g_ip = "";//海康秘钥appkey
var g_szPort = "443";//海康秘钥appSecret

var oWebControl_svg = null;// 插件对象
var bIE = (!!window.ActiveXObject || 'ActiveXObject' in window);// 是否为IE浏览器
var pubKey = '';
var initCount = 0;

var cameraUrl = '/api/iscCameraLocation/getCameraProperties';

$(function () {
    $("body").prepend('<div id="video"  style="display:none;position: fixed;top: 0;right: 0;"><p style="width:calc(100% - 110px);box-sizing:border-box;background:#fff;padding:8px 15px;float:right;border:1px solid #ddd;"><span>视频查看</span><input id="closeBtn" type="button" style="background:url(../svg/close.png) center no-repeat;float:right; width: 24px;height: 24px;background-size: 24px;border: none;"></p><div id="playWnd_svg" class="playWnd" style="height: 100%;float:right;margin: 0;padding: 0;border: 1px solid white;box-sizing:border-box;"></div></div>');
    $("body").prepend('<div id="videoBack"  style="display:none;position: fixed;top: 0;right: 0;"><p style="width:calc(100% - 110px);box-sizing:border-box;background:#fff;padding:8px 15px;float:right;border:1px solid #ddd;"><span>视频回放</span><input id="closeBackBtn" type="button" style="background:url(../svg/close.png) center no-repeat;float:right; width: 24px;height: 24px;background-size: 24px;border: none;"></p><div id="playWndBack" class="playWndBack" style="height: 100%;float:right;margin: 0;padding: 0;border: 1px solid white;box-sizing:border-box;"></div></div>');
    //alert(INSPECTION_URL);
    // setTimeout(initPage(), 1500);   //防止依赖的变量 INSPECTION_URL  还未加载成功
    initPage();

});

function initPage() {

    //文件里写死，否则 调用巡检或者 安全模块，依赖性比较强
   /*  $.ajax({
        type: "GET",
        url: api_url + INSPECTION_URL + cameraUrl,
        dataType: "json",
        success: function (response) {
            let result = response.data;
            g_ip = result.openapi_ISC_ip_port_https;//服务器ip端口
            g_appkey = result.appkey_ISC;//秘钥appkey
            g_secret = result.secret_ISC;//秘钥appSecret

            //$("#video").show();
            // initPlugin();
        },
        error: function (a, b, c) {
        }
    });
 */
    $("#closeBtn").click(function () {
        $("#video").hide();

        oWebControl_svg.JS_HideWnd();
        $('svg').css("width", '100%');
    })

    $("#closeBackBtn").click(function () {
        $("#videoBack").hide();
        oWebBackControl.JS_HideWnd();
        $('svg').css("width", '100%');
    })

}


var i = 0;   //第一次加载需要初始化
var percent = 0.5;   //组态图和 视频窗口分配比例 
function showVideo() {
    if (i == 0) {
        initPlugin();
        i++;
    } else {
        oWebControl_svg.JS_ShowWnd();
    }

    if(oWebBackControl != null){
        oWebBackControl.JS_HideWnd();
    }
    $("#video").show();
    $("#videoBack").hide();
    $('svg').css("width", percent * $(window).width());

}


var j = 0; //第一加载视频回放 需要初始化
function showBackVideo() {
    if (j == 0) {
        initPluginBack();
        j++;
    } else {
        oWebBackControl.JS_ShowWnd();
    }
    if(oWebControl_svg != null){
        oWebControl_svg.JS_HideWnd();
    }
    $("#video").hide();
    $("#videoBack").show();
    $('svg').css("width", percent * $(window).width());

}

var oWebBackControl = null;
var percentBack = 0.5;
function initPluginBack(type, param) {

    var playWid = percentBack * $(window).width();
    $("#playWndBack").css("width", playWid);
    console.log("playWid:" + playWid);

    var playHid = $(window).height() - 50;//视频画面高度等于屏幕高度减去底部工具条的高度40
    console.log("$(window).height():" + $(window).height());
    console.log("playHid:" + playHid);
    $("#playWndBack").css("height", playHid);
    if (1 == type) {
        startPlayback(param.cameraCode, param.startTime, param.endTime);//预览播放视频
        return;
    } else if (3 == type) {
        oWebBackControl.JS_HideWnd();  //在页面关闭前销毁摄像头画面，不然画面会一直浮在页面上
        oWebBackControl.JS_Disconnect().then(function () { }, function () { });
        return;
    } else if (4 == type) {
        playWid = $(window).width() - param.width;//根据左边树显示与不显示调整视频画面宽度
        $("#playWndBack").css("width", playWid);

        setWndCover();
        return;
    } else if (5 == type) {
        if (param.type == 1) {
            oWebBackControl.JS_ShowWnd();
        } else {
            console.log('camerahide');
            oWebBackControl.JS_HideWnd();
        }
        return;
    } else if (11 == type) {
        console.log('pluginScrollpluginScroll');
        pluginScroll();
        return;
    }

    oWebBackControl = new WebControl({
        szPluginContainer: "playWndBack",                       //指定容器id
        iServicePortStart: 15900,                           //指定起止端口号，建议使用该值
        iServicePortEnd: 15909,
        cbConnectSuccess: function () {
            // setCallbacks();
            //实例创建成功后需要启动服务
            oWebBackControl.JS_StartService("window", {
                dllPath: "./VideoPluginConnect.dll"
            }).then(function () {
                oWebBackControl.JS_CreateWnd("playWndBack", playWid, playHid).then(function () {         //JS_CreateWnd创建视频播放窗口，宽高可设定
                    console.log("JS_CreateWnd success");
                    init();                                 //创建播放实例成功后初始化
                });
            }, function () {

            });
        },
        cbConnectError: function () {
            console.log("cbConnectError");
            oWebBackControl = null;
            $("#playWndBack").html("插件未启动，正在尝试启动，请稍候...");
            WebControl.JS_WakeUp("VideoWebPlugin://");        //程序未启动时执行error函数，采用wakeup来启动程序
            initCount++;
            if (initCount < 3) {
                setTimeout(function () {
                    initPluginBack();
                }, 3000)
            } else {
                $("#playWndBack").html("插件启动失败，请检查插件是否安装！");
            }
        },
        cbConnectClose: function () {
            console.log("cbConnectClose");
            oWebBackControl = null;
        }
    });

    //初始化
    function init() {
        getPubKey(function () {
            ////////////////////////////////// 请自行修改以下变量值	////////////////////////////////////
            var appkey = g_appkey;                           //综合安防管理平台提供的appkey，必填
            var secret = setEncrypt(g_secret);   //综合安防管理平台提供的secret，必填
            var ip = g_ip;                           //综合安防管理平台IP地址，必填
            var playMode = 1;                                  //初始播放模式：0-预览，1-回放
            var port = 443;                                    //综合安防管理平台端口，若启用HTTPS协议，默认443
            var snapDir = "D:\\SnapDir";                       //抓图存储路径
            var videoDir = "D:\\VideoDir";                     //紧急录像或录像剪辑存储路径
            var layout = "1x1";                                //playMode指定模式的布局
            var enableHTTPS = 1;                               //是否启用HTTPS协议与综合安防管理平台交互，这里总是填1
            var encryptedFields = 'secret';					   //加密字段，默认加密领域为secret
            var showToolbar = 1;                               //是否显示工具栏，0-不显示，非0-显示
            var showSmart = 1;                                 //是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
            var buttonIDs = "0,16,256,257,258,259,260,512,513,514,515,516,517,768,769";  //自定义工具条按钮
            //var reconnectTimes = 2;                            // 重连次数，回放异常情况下有效
            //var reconnectTime = 4;                             // 每次重连的重连间隔 >= reconnectTime
            ////////////////////////////////// 请自行修改以上变量值	////////////////////////////////////

            oWebBackControl.JS_RequestInterface({
                funcName: "init",
                argument: JSON.stringify({
                    appkey: appkey,                            //API网关提供的appkey
                    secret: secret,                            //API网关提供的secret
                    ip: ip,                                    //API网关IP地址
                    playMode: playMode,                        //播放模式（决定显示预览还是回放界面）
                    port: port,                                //端口
                    snapDir: snapDir,                          //抓图存储路径
                    videoDir: videoDir,                        //紧急录像或录像剪辑存储路径
                    layout: layout,                            //布局
                    enableHTTPS: enableHTTPS,                  //是否启用HTTPS协议
                    encryptedFields: encryptedFields,          //加密字段
                    showToolbar: showToolbar,                  //是否显示工具栏
                    showSmart: showSmart,                      //是否显示智能信息
                    buttonIDs: buttonIDs                       //自定义工具条按钮
                    //reconnectTimes：reconnectTimes,            //重连次数
                    //reconnectDuration：reconnectTime           //重连间隔
                })
            }).then(function (oData) {
                oWebBackControl.JS_Resize(playWid, playHid);  // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
            });
        });
    }

    // 获取公钥
    function getPubKey(callback) {
        oWebBackControl.JS_RequestInterface({
            funcName: "getRSAPubKey",
            argument: JSON.stringify({
                keyLength: 1024
            })
        }).then(function (oData) {
            console.log(oData);
            if (oData.responseMsg.data) {
                pubKey = oData.responseMsg.data;
                callback()
            }
        })
    }

    // RSA加密
    function setEncrypt(value) {
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(pubKey);
        return encrypt.encrypt(value);
    }

    // 监听resize事件，使插件窗口尺寸跟随DIV窗口变化
    $(window).resize(function () {
        if (oWebBackControl != null) {
            oWebBackControl.JS_Resize(playWid, playHid);
            setWndCover();
        }
    });

    // 监听滚动条scroll事件，使插件窗口跟随浏览器滚动而移动
    $(window).scroll(function () {
        if (oWebBackControl != null) {
            oWebBackControl.JS_Resize(playWid, playHid);
            setWndCover();
        }
    });

    // 滚动条scroll
    function pluginScroll() {
        console.log("滚动条scroll playWid:" + playWid + " playHid:" + playHid, (oWebBackControl != null));
        if (oWebBackControl != null) {
            oWebBackControl.JS_Resize(playWid, playHid);
            setWndCover();
        }
    }

    // 设置窗口裁剪，当因滚动条滚动导致窗口需要被遮住的情况下需要JS_CuttingPartWindow部分窗口
    function setWndCover() {
        var iWidth = $(window).width();
        var iHeight = $(window).height();
        var oDivRect = $("#playWndBack").get(0).getBoundingClientRect();

        var iCoverLeft = (oDivRect.left < 0) ? Math.abs(oDivRect.left) : 0;
        var iCoverTop = (oDivRect.top < 0) ? Math.abs(oDivRect.top) : 0;
        var iCoverRight = (oDivRect.right - iWidth > 0) ? Math.round(oDivRect.right - iWidth) : 0;
        var iCoverBottom = (oDivRect.bottom - iHeight > 0) ? Math.round(oDivRect.bottom - iHeight) : 0;

        iCoverLeft = (iCoverLeft > playWid) ? playWid : iCoverLeft;
        iCoverTop = (iCoverTop > playHid) ? playHid : iCoverTop;
        iCoverRight = (iCoverRight > playWid) ? playWid : iCoverRight;
        iCoverBottom = (iCoverBottom > playHid) ? playHid : iCoverBottom;

        oWebBackControl.JS_RepairPartWindow(0, 0, (playWid + 1), playHid);   // 多1个像素点防止还原后边界缺失一个像素条
        if (iCoverLeft != 0) {
            oWebBackControl.JS_CuttingPartWindow(0, 0, iCoverLeft, playHid);
        }
        if (iCoverTop != 0) {
            oWebBackControl.JS_CuttingPartWindow(0, 0, (playWid + 1), iCoverTop);  // 多剪掉一个像素条，防止出现剪掉一部分窗口后出现一个像素条
        }
        if (iCoverRight != 0) {
            oWebBackControl.JS_CuttingPartWindow(playWid - iCoverRight, 0, iCoverRight, playHid);
        }
        if (iCoverBottom != 0) {
            oWebBackControl.JS_CuttingPartWindow(0, playHid - iCoverBottom, playWid, iCoverBottom);
        }
    }

    //录像回放功能
    function startPlayback(aId, startTime, endTime) {

        var cameraIndexCode = aId;         //获取输入的监控点编号值，必填
        var startTimeStamp = new Date(startTime.replace('-', '/').replace('-', '/')).getTime();    //回放开始时间戳，必填
        var endTimeStamp = new Date(endTime.replace('-', '/').replace('-', '/')).getTime();        //回放结束时间戳，必填
        var recordLocation = 1;                                     //录像存储位置：0-中心存储，1-设备存储
        var transMode = 1;                                          //传输协议：0-UDP，1-TCP
        var gpuMode = 0;                                            //是否启用GPU硬解，0-不启用，1-启用
        var wndId = -1;                                             //播放窗口序号（在2x2以上布局下可指定播放窗口）

        oWebBackControl.JS_RequestInterface({
            funcName: "startPlayback",
            argument: JSON.stringify({
                cameraIndexCode: cameraIndexCode,                   //监控点编号
                startTimeStamp: Math.floor(startTimeStamp / 1000).toString(),  //录像查询开始时间戳，单位：秒
                endTimeStamp: Math.floor(endTimeStamp / 1000).toString(),      //录像结束开始时间戳，单位：秒
                recordLocation: recordLocation,                     //录像存储类型：0-中心存储，1-设备存储
                transMode: transMode,                               //传输协议：0-UDP，1-TCP
                gpuMode: gpuMode,                                   //是否启用GPU硬解，0-不启用，1-启用
                wndId: wndId                                         //可指定播放窗口
            })
        })
    }

    // 停止回放
    $("#stopAllPlayback").click(function () {
        oWebBackControl.JS_RequestInterface({
            funcName: "stopAllPlayback"
        })
    });

    // 格式化时间
    function dateFormat(oDate, fmt) {
        var o = {
            "M+": oDate.getMonth() + 1, //月份
            "d+": oDate.getDate(), //日
            "h+": oDate.getHours(), //小时
            "m+": oDate.getMinutes(), //分
            "s+": oDate.getSeconds(), //秒
            "q+": Math.floor((oDate.getMonth() + 3) / 3), //季度
            "S": oDate.getMilliseconds()//毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    // 标签关闭
    $(window).unload(function () {
        if (oWebBackControl != null) {
            oWebBackControl.JS_HideWnd();   // 先让窗口隐藏，规避插件窗口滞后于浏览器消失问题
            oWebBackControl.JS_Disconnect().then(function () { }, function () { });
        }
    });

}

function initPlugin(type, param) {

    //根据屏幕大小设置视频画面的宽和高
    // playWid = $(window).width()-950;//视频画面宽度等于屏幕宽度减去左边树宽度290
    var playWid = percent * $(window).width();
    $("#playWnd_svg").css("width", playWid);
    console.log("playWid:" + playWid);

    var playHid = $(window).height() - 50;//视频画面高度等于屏幕高度减去底部工具条的高度40
    console.log("$(window).height():" + $(window).height());
    console.log("playHid:" + playHid);
    $("#playWnd_svg").css("height", playHid);

    if (1 == type) {
        startPreview(param.cameraCode);//预览播放视频
        return;
    } else if (3 == type) {
        oWebControl_svg.JS_HideWnd();  //在页面关闭前销毁摄像头画面，不然画面会一直浮在页面上
        oWebControl_svg.JS_Disconnect().then(function () { }, function () { });
        return;
    } else if (4 == type) {
        playWid = $(window).width() - param.width;//根据左边树显示与不显示调整视频画面宽度
        $("#playWnd_svg").css("width", playWid);

        setWndCover();
        return;
    } else if (5 == type) {
        if (param.type == 1) {
            oWebControl_svg.JS_ShowWnd();
        } else {
            console.log('camerahide');
            oWebControl_svg.JS_HideWnd();
        }
        return;
    } else if (11 == type) {
        console.log('pluginScrollpluginScroll');
        pluginScroll();
        return;
    }


    //设置左边树的高度，防止点开树时节点过多树高度加大导致右边视频窗口底部出现空白
    //$("#jstree_div").attr("style","height: "+(playHid-120)+"px;overflow: auto;");

    oWebControl_svg = new WebControl({
        szPluginContainer: "playWnd_svg",
        iServicePortStart: 15900,
        iServicePortEnd: 15909,
        szClassId: "23BF3B0A-2C56-4D97-9C03-0CB103AA8F11",   // 用于IE10使用ActiveX的clsid
        cbConnectSuccess: function () {                     // 创建WebControl实例成功											
            oWebControl_svg.JS_StartService("window", {         // WebControl实例创建成功后需要启动服务
                dllPath: "./VideoPluginConnect.dll"         // 值"./VideoPluginConnect.dll"写死 
            }).then(function () {                           // 启动插件服务成功
                oWebControl_svg.JS_SetWindowControlCallback({   // 设置消息回调
                    cbIntegrationCallBack: cbIntegrationCallBack
                });

                oWebControl_svg.JS_CreateWnd("playWnd_svg", playWid, playHid).then(function () { //JS_CreateWnd创建视频播放窗口，宽高可设定
                    console.log("JS_CreateWnd success");
                    init();  // 创建播放实例成功后初始化
                });
            }, function () { // 启动插件服务失败
            });
        },
        cbConnectError: function () {
            console.log("cbConnectError");
            oWebControl_svg = null;
            $("#playWnd_svg").html("插件未启动，正在尝试启动，请稍候...");
            WebControl.JS_WakeUp("VideoWebPlugin://");
            initCount++;
            if (initCount < 3) {
                setTimeout(function () {
                    initPlugin();
                }, 3000)
            } else {
                $("#playWnd_svg").html("插件启动失败，请检查插件是否安装！<a href='../../../../static/haikang/dist/VideoWebPlugin.exe' style='color:red;'>下载插件</a>");
            }
        },
        cbConnectClose: function (bNormalClose) {
            // 异常断开：bNormalClose = false
            // JS_Disconnect正常断开：bNormalClose = true
            console.log("cbConnectClose");
            oWebControl_svg = null;
        }
    });

    // 标签关闭
    $(window).unload(function () {
        if (oWebControl_svg != null) {
            oWebControl_svg.JS_HideWnd();  // 先让窗口隐藏，规避可能的插件窗口滞后于浏览器消失问题
            oWebControl_svg.JS_Disconnect().then(function () { }, function () { });
        }
    });

    // 窗口resize
    $(window).resize(function () {
        if (oWebControl_svg != null) {
            oWebControl_svg.JS_Resize(playWid, playHid);
            setWndCover();
        }
    });

    // 滚动条scroll
    $(window).scroll(function () {
        if (oWebControl_svg != null) {
            oWebControl_svg.JS_Resize(playWid, playHid);
            setWndCover();
        }
    });

    // 滚动条scroll
    function pluginScroll() {
        console.log("滚动条scroll playWid:" + playWid + " playHid:" + playHid, (oWebControl_svg != null));
        if (oWebControl_svg != null) {
            oWebControl_svg.JS_Resize(playWid, playHid);
            setWndCover();
        }
    }


    function showWnd() {
        oWebControl_svg.JS_ShowWnd();
    }

    function hideWnd() {
        console.log('camerahide');
        oWebControl_svg.JS_HideWnd();
        oWebControl_svg.JS_Disconnect().then(function () { }, function () { });
    }

    // 设置窗口裁剪，当因滚动条滚动导致窗口需要被遮住的情况下需要JS_CuttingPartWindow部分窗口
    function setWndCover() {
        var iWidth = $(window).width();
        var iHeight = $(window).height();
        var oDivRect = $("#playWnd_svg").get(0).getBoundingClientRect();

        var iCoverLeft = (oDivRect.left < 0) ? Math.abs(oDivRect.left) : 0;
        var iCoverTop = (oDivRect.top < 0) ? Math.abs(oDivRect.top) : 0;
        var iCoverRight = (oDivRect.right - iWidth > 0) ? Math.round(oDivRect.right - iWidth) : 0;
        var iCoverBottom = (oDivRect.bottom - iHeight > 0) ? Math.round(oDivRect.bottom - iHeight) : 0;

        iCoverLeft = (iCoverLeft > playWid) ? playWid : iCoverLeft;
        iCoverTop = (iCoverTop > playHid) ? playHid : iCoverTop;
        iCoverRight = (iCoverRight > playWid) ? playWid : iCoverRight;
        iCoverBottom = (iCoverBottom > playHid) ? playHid : iCoverBottom;

        oWebControl_svg.JS_RepairPartWindow(0, 0, (playWid + 1), playHid);  // 多1个像素点防止还原后边界缺失一个像素条
        if (iCoverLeft != 0) {
            oWebControl_svg.JS_CuttingPartWindow(0, 0, iCoverLeft, playHid);
        }
        if (iCoverTop != 0) {
            oWebControl_svg.JS_CuttingPartWindow(0, 0, (playWid + 1), iCoverTop);  // 多剪掉一个像素条，防止出现剪掉一部分窗口后出现一个像素条
        }
        if (iCoverRight != 0) {
            oWebControl_svg.JS_CuttingPartWindow(playWid - iCoverRight, 0, iCoverRight, playHid);
        }
        if (iCoverBottom != 0) {
            oWebControl_svg.JS_CuttingPartWindow(0, playHid - iCoverBottom, playWid, iCoverBottom);
        }
    }

    //获取公钥
    function getPubKey(callback) {
        oWebControl_svg.JS_RequestInterface({
            funcName: "getRSAPubKey",
            argument: JSON.stringify({
                keyLength: 1024
            })
        }).then(function (oData) {
            console.log(oData)
            if (oData.responseMsg.data) {
                pubKey = oData.responseMsg.data
                callback()
            }
        })
    }

    // 设置窗口控制回调
    function setCallbacks() {
        oWebControl_svg.JS_SetWindowControlCallback({
            cbIntegrationCallBack: cbIntegrationCallBack
        });
    }

    // 推送消息
    function cbIntegrationCallBack(oData) {
        showCBInfo(JSON.stringify(oData.responseMsg));
    }

    //RSA加密
    function setEncrypt(value) {
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(pubKey);
        return encrypt.encrypt(value);
    }

    // 初始化
    function init() {
        getPubKey(function () {

            var appkey = g_appkey;
            var secret = setEncrypt(g_secret);
            var ip = g_ip;
            var szPort = g_szPort;
            var snapDir = "D:\SnapDir";
            var videoDir = "D:\VideoDir";
            var layout = "2x2";
            var encryptedFields = ['secret'];
            var szShowToolbar = "1";
            var szShowSmart = "1";
            var btIds = "1,0,16,256,257,258,259,260,512,513,514,515,516,517,768,769";
            var rectTimes = 5;
            var rectDuration = 5;
            var language = "zh_CN";

            appkey = appkey.replace(/(^\s*)/g, "");
            appkey = appkey.replace(/(\s*$)/g, "");

            secret = secret.replace(/(^\s*)/g, "");
            secret = secret.replace(/(\s*$)/g, "");

            ip = ip.replace(/(^\s*)/g, "");
            ip = ip.replace(/(\s*$)/g, "");

            szPort = szPort.replace(/(^\s*)/g, "");
            szPort = szPort.replace(/(\s*$)/g, "");

            snapDir = snapDir.replace(/(^\s*)/g, "");
            snapDir = snapDir.replace(/(\s*$)/g, "");

            videoDir = videoDir.replace(/(^\s*)/g, "");
            videoDir = videoDir.replace(/(\s*$)/g, "");

            var port = parseInt(szPort);
            var showSmart = parseInt(szShowSmart);
            var showToolbar = parseInt(szShowToolbar);
            var enableHttps = 1;
            var reconnectTimes = parseInt(rectTimes);
            if (isNaN(reconnectTimes)) {
                reconnectTimes = 0;
            }
            var duration = parseInt(rectDuration);

            encryptedFields = encryptedFields.join(",");

            if (!appkey) {
                showCBInfo("appkey不能为空！", 'error');
                return
            }
            if (!secret) {
                showCBInfo("secret不能为空！", 'error');
                return
            }
            if (!ip) {
                showCBInfo("ip不能为空！", 'error');
                return
            }
            if (!szPort) {
                showCBInfo("端口不能为空！", 'error');
                return
            } else if (!/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/.test(szPort)) {
                alert("端口填写有误！", 'error');
                return
            }
            console.log({
                appkey: appkey,
                secret: secret,
                ip: ip,
                playMode: 0, // 预览
                port: port,
                snapDir: snapDir,
                videoDir: videoDir,
                layout: layout,
                enableHTTPS: enableHttps,
                showToolbar: showToolbar,
                showSmart: showSmart,
                buttonIDs: btIds,
                language: language,
                encryptedFields: encryptedFields
            })

            oWebControl_svg.JS_RequestInterface({
                funcName: "init",
                argument: JSON.stringify({
                    appkey: appkey,
                    secret: secret,
                    ip: ip,
                    playMode: 0, // 预览
                    port: port,
                    snapDir: snapDir,
                    videoDir: videoDir,
                    layout: layout,
                    enableHTTPS: enableHttps,
                    showToolbar: showToolbar,
                    showSmart: showSmart,
                    buttonIDs: btIds,
                    encryptedFields: encryptedFields,
                    language: language,
                    reconnectTimes: reconnectTimes,
                    reconnectDuration: duration
                })
            }).then(function (oData) {
                showCBInfo(JSON.stringify(oData ? oData.responseMsg : ''));
                /* UpdatePlayTypeValue();
                UpdateSnapTypeValue();
                UpdateSetOSDTypeValue(); */  //没有方法实现呀
                oWebControl_svg.JS_Resize(playWid, playHid);  // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
                //oWebControl_svg.JS_Resize(100, 150);  // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题


            });
        })
    }
    // 视频预览
    function startPreview(aId) {

        var cameraIndexCode = aId;
        console.log("cameraIndexCode:" + cameraIndexCode + "  " + (oWebControl_svg == null));
        var streamMode = +"0";
        var transMode = +"1";
        var gpuMode = +"0";
        var wndId = -1;  //默认为空闲窗口预览
        var isDirectEzviz = +"0";

        cameraIndexCode = cameraIndexCode.replace(/(^\s*)/g, "");
        cameraIndexCode = cameraIndexCode.replace(/(\s*$)/g, "");

        var v = 0;

        if (2 == v)//指定窗口预览
        {
            //wndId = parseInt($("#playWndId option:selected").val(), 10);
        }
        else if (1 == v) //选中窗口预览
        {
            wndId = 0;
        }

        if (!cameraIndexCode) {
            showCBInfo("监控点编号不能为空！", 'error');
            return
        }

        //看是不是批量播放
        var v = 0;
        if (1 == v) {
            var ids = $("#wndIds").val();
            ids = ids.replace(/(^\s*)/g, "");
            if (!ids) {
                showCBInfo("批量播放时窗口序号不能为空，请填入以英文逗号分割，从1开始到当前布局最大窗口数之间的窗口Id！请自行保证仅填入数字，并且逗号左右无空格！", 'error');
                return
            }

            var tmp = ids.split(/[,]/g);
            var dataArr = [];
            for (var i = 0; i < tmp.length; i++) {
                dataArr.push({
                    cameraIndexCode: cameraIndexCode,
                    streamMode: streamMode,
                    transMode: transMode,
                    gpuMode: gpuMode,
                    wndId: parseInt(tmp[i]),
                    ezvizDirect: isDirectEzviz
                });
            }

            var tmpAgr = {
                "list": dataArr
            };

            oWebControl_svg.JS_RequestInterface({
                funcName: "startMultiPreviewByCameraIndexCode",
                argument: JSON.stringify(tmpAgr)
            }).then(function (oData) {
                showCBInfo(JSON.stringify(oData ? oData.responseMsg : ''));
            });

        } else {
            oWebControl_svg.JS_RequestInterface({
                funcName: "startPreview",
                argument: JSON.stringify({
                    cameraIndexCode: cameraIndexCode,
                    streamMode: streamMode,
                    transMode: transMode,
                    gpuMode: gpuMode,
                    wndId: wndId,
                    ezvizDirect: isDirectEzviz
                })
            }).then(function (oData) {
                showCBInfo(JSON.stringify(oData ? oData.responseMsg : ''));
            });
        }
    }

    // 显示回调信息
    function showCBInfo(szInfo, type) {
        if (type === 'error') {
            szInfo = "<div style='color: red;'>" + dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo + "</div>";
        } else {
            szInfo = "<div>" + dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo + "</div>";
        }
        $("#cbInfo").html(szInfo + $("#cbInfo").html());
    }

    $("#clear").click(function () {
        $("#cbInfo").html('');
    });

    // 格式化时间
    function dateFormat(oDate, fmt) {
        var o = {
            "M+": oDate.getMonth() + 1, //月份
            "d+": oDate.getDate(), //日
            "h+": oDate.getHours(), //小时
            "m+": oDate.getMinutes(), //分
            "s+": oDate.getSeconds(), //秒
            "q+": Math.floor((oDate.getMonth() + 3) / 3), //季度
            "S": oDate.getMilliseconds()//毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

}