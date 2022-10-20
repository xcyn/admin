 var url = "";
 var CALCULATION_URL = "";
 var map ="";
 var areaNo = "";
 var objectId = "";
 var serachMarkerArr = new Array();
 var zTreeObj;
 var treeData;
 var layerTypeIdArr=[]; //用于存放选中的图层
 var layerTypeNameArr=[]; //用于存放选中的图层
 var hasChange = "";
 var isShow = "";
 var mapZoom = 8;//地图的初始化缩放级别
 var minZoom = 4;//地图最小缩放级别
 var maxZoom = 19;//地图最大缩放级别
 //覆盖物下拉树
 var setting = {
     data : {
         simpleData: {
           enable: true,  //true 、 false 分别表示 使用 、 不使用 简单数据模式
           idKey: "layerTypeId",   //节点数据中保存唯一标识的属性名称
           pIdKey: "parentId",    //节点数据中保存其父节点唯一标识的属性名称
           rootPId: -1  //用于修正根节点父节点数据，即 pIdKey 指定的属性值
         },
         key:{
           name: "layerName"  //zTree 节点数据保存节点名称的属性名称  默认值："name"
         }
     },
     check:{
         enable:true,  //true 、 false 分别表示 显示 、不显示 复选框或单选框
         nocheckInherit:true   //当父节点设置 nocheck = true 时，设置子节点是否自动继承 nocheck = true
     },
     view: {
     		showIcon: false
     },
     callback : {
       onCheck : zTreeOnCheck
     }
 };
 //弹出框下拉树
 var settingDialog = {
     data : {
         simpleData: {
           enable: true,  //true 、 false 分别表示 使用 、 不使用 简单数据模式
           idKey: "layerTypeId",   //节点数据中保存唯一标识的属性名称
           pIdKey: "parentId",    //节点数据中保存其父节点唯一标识的属性名称
           rootPId: -1  //用于修正根节点父节点数据，即 pIdKey 指定的属性值
         },
         key:{
           name: "layerName"  //zTree 节点数据保存节点名称的属性名称  默认值："name"
         }
     },
     check:{
         enable:true,  //true 、 false 分别表示 显示 、不显示 复选框或单选框
         chkStyle: "radio"   //当父节点设置 nocheck = true 时，设置子节点是否自动继承 nocheck = true
     },
     view: {
     		showIcon: false
     },
     callback : {
       onCheck : zTreeOnCheckDialog,
       beforeCheck : function(treeId, treeNode) {
        if (treeNode.children) {
          return false;
        }
       }
     }
 };
$(function () {
  url = parent.api_url;
	CALCULATION_URL = parent.CALCULATION_URL;
  areaNo = parent.areaNo;
  objectId = parent.objectId;
	//百度地图API功能
	map = new BMap.Map('allmap',{enableMapClick:false,minZoom:minZoom,maxZoom : maxZoom});
	var poi;
  if("" != areaNo && null != parent.longitude && "" != parent.longitude && null != parent.latitude && "" != parent.latitude ){
    poi = new BMap.Point(parent.longitude,parent.latitude);
  }else{
    poi = new BMap.Point(123.487147,41.738287);
  }
  if("" != areaNo && null != parent.mapLevel && "" != parent.mapLevel){
    map.centerAndZoom(poi, parent.mapLevel);//设置中心点坐标和地图级别
    mapZoom = parent.mapLevel;
    $('.wrap_show').html(mapZoom);
  }else{
    map.centerAndZoom(poi, 8);//设置中心点坐标和地图级别
  }
	map.enableScrollWheelZoom(); //启用鼠标滚动对地图放大缩小
	// map.addControl(new BMap.NavigationControl());   //缩放按钮
	//获取换热站坐标数据
	getStationList();
	//获取管网数据
	getPropList();

  $("#heatNetTree").hide();
  //获取树内容
  getLayerList();

  //鼠标滚动致使地图上的放大缩小---缩放区间在4-19之间
  map.addEventListener("zoomend", function(e){
    mapZoom = map.getZoom();
    $('.wrap_show').html(mapZoom);
  });

  var overlaycomplete = function(e){

        switch (e.drawingMode) {
          case "marker":
          {
            var marker = e.overlay;
            /*-----------------标注右键删除-------------------------*/
            var markerMenu = new BMap.ContextMenu();
            markerMenu.addItem(new BMap.MenuItem('删除标注 ', function () {
            map.removeOverlay(marker);
          }))
          marker.addContextMenu(markerMenu);
          /*-----------------标注点击弹窗-------------------------*/
          marker.addEventListener("click", function (e) {
            var sContent =
              "<table>" +
                "<tr>" +
                  "<td style='text-align:right;'><b>关联指标对象<span style='color:red'>*</span>：</b></td><td>" +
                    "<input type='text' id='objectName' style='margin-top:10px;width:200px' readonly onclick='showImObjectDialog(1)' placeholder='请选择'/>" +
                    "<input type='text' id='objectNo' style='margin-top:10px;width:200px;display:none;''/>" +
                    "<input type='text' id='areaNo' style='margin-top:10px;width:200px;display:none;''/>" +
                  "</td>" +
                "</tr>" +
                "<tr>" +
                  "<td style='text-align:right;'><b>覆盖物类型<span style='color:red'>*</span>：</b></td><td>" +
                  "<input type='text' id='layerId' style='display:none;' placeholder='请选择'/>"+
                  "<input type='text' style='margin-top:10px;width:200px;position:relative' id='selectTreeDialog' readonly onclick='showSelectTreeDialog()' placeholder='请选择'/> "+
                  "<div class='treeBox'  style='position:absolute'>"+
                  "<ul id='selectTreeList' class='ztree' ></ul></div>"+
                  "</td>" +
                "</tr>" +
            	  "<tr>" +
            	    "<td style='text-align:right;'><b>坐标<span style='color:red'>*</span>：</b></td><td>" +
            	      "<input type='text' name='lng' id='longitude' value='" + e.currentTarget.point.lng + "' style='width:90px;'/>" +
            	      "<span>-</span>" +
            	      "<input type='text' name='lat' id='latitude' value='" + e.currentTarget.point.lat + "' style='width:90px;'/>" +
            	    "</td>" +
            	  "</tr>" +
            	  "<tr>" +
            	    "<td style='text-align:right;' colspan='2'>" +
            	       "<input type='button' value='保存' onclick='savePoint()' style='width: 40px;line-height: 40px;'/>" +
            	    "</td>" +
            	  "</tr>" +
            	"</talbe>";
            	 var opts = { enableMessage: false};
               var infoWindow = new BMap.InfoWindow(sContent, opts);
               this.openInfoWindow(infoWindow);
               $("#selectTreeList").hide();
               isShow = "";
          });
        }
        break;
        case "polyline":
          {
            var pointArray = e.overlay.getPath();//Array<Point> 返回折线的点数组
            var pointArrayInfo = JSON.stringify(pointArray);
            var polyline = e.overlay;
            /*-----------------折线右键删除-------------------------*/
            var polylineMenu = new BMap.ContextMenu();
            polylineMenu.addItem(new BMap.MenuItem('删除折线', function () {
              map.removeOverlay(polyline);
            }));
            polyline.addContextMenu(polylineMenu);
            polyline.addEventListener("click", function (e) {
              var sContent =
                "<table>" +
                  "<tr>" +
                    "<td style='text-align:right;'><b>关联指标对象<span style='color:red'>*</span>：</b></td><td>" +
                      "<input type='text' id='objectName' style='margin-top:10px;width:200px' readonly onclick='showImObjectDialog(2)' placeholder='请选择'/>" +
                      "<input type='text' id='objectNo' style='margin-top:10px;width:200px;display:none;''/>" +
                      "<input type='text' id='areaNo' style='margin-top:10px;width:200px;display:none;''/>" +
                    "</td>" +
                  "</tr>" +
                  "<tr>" +
                    "<td style='text-align:right;'><b>覆盖物类型<span style='color:red'>*</span>：</b></td><td>" +
                    "<input type='text' id='layerId' style='display:none;' placeholder='请选择'/>"+
                    "<input type='text' style='margin-top:10px;width:200px;position:relative' id='selectTreeDialog' readonly onclick='showSelectTreeDialog()' placeholder='请选择'/> "+
                    "<div class='treeBox'  style='position:absolute'>"+
                    "<ul id='selectTreeList' class='ztree' ></ul></div>"+
                    "</td>" +
                  "</tr>" +
                  "<tr>" +
                    "<td style='text-align:right;'><b>描述<span style='color:red'>*</span>：</b></td><td>" +
                      "<input type='text' id='pointName' style='margin-top:10px;width:200px'/>" +
                    "</td>" +
                  "</tr>" +
              	  "<tr>" +
              	    "<td style='text-align:right;' colspan='2'>" +
              	       "<input type='button' value='保存' onclick='savePolyline("+pointArrayInfo.replace(/"/g,'&quot;')+")' style='width: 40px;line-height: 40px;'/>" +
              	    "</td>" +
              	  "</tr>" +
              	"</talbe>";
                var opts = {enableMessage: false};
                if(null != pointArray && pointArray.length>0){
                  var point = new BMap.Point(pointArray[0].lng,pointArray[0].lat);
                  var infoWindow = new BMap.InfoWindow(sContent, opts);
                  map.openInfoWindow(infoWindow,point);
                }
                $("#selectTreeList").hide();
                isShow = "";

            });

          }
        break;
     }
  };

  var styleOptions = {
              strokeColor: "red",      //边线颜色。
              fillColor: "red",        //填充颜色。当参数为空时，圆形将没有填充效果。
              strokeWeight: 5,        //边线的宽度，以像素为单位。
              strokeOpacity: 0.8,     //边线透明度，取值范围0 - 1。
              fillOpacity: 0.3,       //填充的透明度，取值范围0 - 1。
              strokeStyle: 'solid'    //边线的样式，solid或dashed。
  };

  var drawingManager = new BMapLib.DrawingManager(map, {
                  isOpen: false, //是否开启绘制模式
                  enableDrawingTool: true, //是否显示工具栏
                  // drawingMode:BMAP_DRAWING_POLYGON,//绘制模式  多边形
                  drawingToolOptions: {
                      anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                      offset: new BMap.Size(5, 5), //偏离值
                      scale: 0.8, //工具栏缩放比例
                      drawingModes: [
                      //工具栏上可以选择出现的绘制模式
                        BMAP_DRAWING_MARKER,
                        BMAP_DRAWING_POLYLINE
                      ]
                  },
                   polylineOptions: styleOptions, //线的样式
                   polygonOptions: styleOptions //多边形的样式
              });
  drawingManager.addEventListener('overlaycomplete', overlaycomplete);

});
  /***************获取换热站坐标数据****************************/
  function getStationList(){
  	var requestUrl =url+CALCULATION_URL+"/api/mapCoordinate/getCoordinateList";
  	 //查询后台获得数据
  	 	$.ajax({
  	 			type:'POST',
  	 			url:requestUrl,
  	 			dataType: 'json',
  				async:true,
  	 			data:{
  	 				areaNo:areaNo,
  	 				useType:'point',
            objectId:objectId,
            layerTypeIdArr:JSON.stringify(layerTypeIdArr)
  	 			},
  	 			success: function(response) {
  					if(response.code == 0){//成功
  						var data = response.data;
  						var point = null;
  						var label = null;
              var layerType = "";
              var labelDesc = "";
              var pageName = "";//详情页面名称
              var layerPicName = "";//图片名称
              var objectNo = "";//站对应的指标编码
              var objectId = "";//指标对象ID
              var picLocation = "./images/";
  						var myIcon = null;
  						var marker = null;
              var pointId = "";
              var markerMenu;
  						for (var i = 0;  i< data.length; i++) {
                picLocation = "./images/";
                pointId = data[i].guid;
                layerType = data[i].layerType;
                labelDesc = data[i].coordinateDesc;
                pageName = data[i].pageName;
                objectNo = data[i].objectNo;
                objectId = data[i].objectId;
                layerPicName = data[i].layerPicName;
                if(null == layerPicName || "" == layerPicName){
                    picLocation = picLocation+"heatStation.png";
                }else{
                    picLocation = picLocation+layerPicName+".png";
                }
                myIcon = new BMap.Icon(picLocation, new BMap.Size(30,30));
  							point = new BMap.Point(data[i].longitude,data[i].latitude);
  							label = new BMap.Label(data[i].coordinateDesc,{offset:new BMap.Size(20,-10)});
  							marker = new BMap.Marker(point,{icon:myIcon});
                map.addOverlay(marker);
                marker.customData = {'labelDesc': labelDesc,"pageName":pageName,"objectNo":objectNo,"objectId":objectId,"pointId":pointId};

                var steelOpts = {
                	width : 80,     //信息窗口宽度
                	height: 20,     //信息窗口高度
                	enableMessage:true	//设置允许信息窗发送短息
                };

                marker.addEventListener("click",function(e){
                  var desc = e.currentTarget.customData.labelDesc;
                  var steelContent = "<div><p>"+desc+"</p></div>";
                	this.openInfoWindow(new BMap.InfoWindow(steelContent, steelOpts));
                });
                // marker.addEventListener("mouseout",function () {
                // 		this.closeInfoWindow();
                // 	}
                // );

                marker.addEventListener("rightclick", function(e){
                  var pointId = e.currentTarget.customData.pointId;
                  var desc = e.currentTarget.customData.labelDesc;
                  var lat = e.currentTarget.point.lat;
                  var lng = e.currentTarget.point.lng;
                  markerMenu = new BMap.ContextMenu();
                  markerMenu.addItem(new BMap.MenuItem('删除该点', function (e,ee,marker) {
                    var pointId = marker.customData.pointId;
                    var coordinateDesc = marker.customData.labelDesc;
                    var latitude = marker.point.lat;
                    var longitude = marker.point.lng;
                    rightPointClick(pointId,coordinateDesc,longitude,latitude);
                  }));
                  this.addContextMenu(markerMenu);

                });

  						}

  					}
  	 			},
  	 			error: function() {
  	 			}
  	 		});
  }

  /***************获取管网信息数据****************************/
  function getPropList(){
  	var requestUrl =url+CALCULATION_URL+"/api/mapCoordinate/getCoordinateList";
  	 //查询后台获得数据
  	 	$.ajax({
  	 			type:'POST',
  	 			url:requestUrl,
  	 			dataType: 'json',
  				async:true,
  	 			data:{
  	 				areaNo:areaNo,
  	 				useType:'line',
            objectId:objectId,
            layerTypeIdArr:JSON.stringify(layerTypeIdArr)
  	 			},
  	 			success: function(response) {
  					if(response.code == 0){//成功
  						var data = response.data;
  						var point = null;
  						var marker = null;
  						var lineNo = "";
  						var pointArray = new Array();
  						var polyline;
  						for (var i = 0;  i< data.length+1; i++) {
  							if(i == data.length){
  								if("" != lineNo && pointArray.length>0 ){
  									polyline = new BMap.Polyline( pointArray, {strokeColor:"blue", strokeWeight:4, strokeOpacity:0.5});   //创建折线
  									map.addOverlay(polyline);
  									pointArray = new Array();
  								}
  							}else {
  								if("" != lineNo && pointArray.length>0 && lineNo != data[i].lineNo){
  									polyline = new BMap.Polyline( pointArray, {strokeColor:"blue", strokeWeight:4, strokeOpacity:0.5});   //创建折线
  									map.addOverlay(polyline);
  									pointArray = new Array();
  								}
  								lineNo = data[i].lineNo;
  								point = new BMap.Point(data[i].longitude,data[i].latitude);
                  point["lineNo"] = data[i].lineNo;
  								pointArray.push(point);
  							}


  						}

              map.addEventListener("rightclick", function(e){
                var polyline = e.overlay;
                if(undefined == e.overlay.customData){
                  var polylineMenu = new BMap.ContextMenu();
                  polylineMenu.addItem(new BMap.MenuItem('删除该折线', function (e,ee,poly) {
                    var lineNo = null;
                    var pointArr;
                    if(null != poly && null != poly.getPath() && poly.getPath().length>0){
                        lineNo = poly.getPath()[0].lineNo;
                        pointArr = poly.getPath();
                    }
                    rightLineClick(lineNo,pointArr);
                  }));
                  polyline.addContextMenu(polylineMenu);
                }

              });
  					}
  	 			},
  	 			error: function() {
  	 			}
  	 		});
  }


  /***************查询热源、站****************************/
  function searchPoint(){
    var searchVal = $("#searchPoint").val();
    if("" == searchVal){
      return;
    }
    var requestUrl =url+CALCULATION_URL+"/api/mapCoordinate/getCoordinateList";
     //查询后台获得数据
     	$.ajax({
     			type:'POST',
     			url:requestUrl,
     			dataType: 'json',
    			async:true,
     			data:{
     				coordinateDesc:searchVal,
     				useType:'point',
            areaNo:areaNo,
            objectId:objectId
     			},
     			success: function(response) {
    				if(response.code == 0){//成功
    					var data = response.data;
               var point = null;
               point = new BMap.Point(data[0].longitude,data[0].latitude);
               map.centerAndZoom(point, 17);//设置中心点坐标和地图级别
               var desc = data[0].coordinateDesc;
               var steelContent = "<div><p>"+desc+"</p></div>";
               var steelOpts = {
               	width : 80,     //信息窗口宽度
               	height: 20,     //信息窗口高度
               	enableMessage:true	//设置允许信息窗发送短息
               };
               map.openInfoWindow(new BMap.InfoWindow(steelContent, steelOpts),point);
    				}
     			},
     			error: function() {
     			}
     		});
  }

/**
 * 覆盖物下拉树展示
 */
function showSelectTree() {
    $("#heatNetTree").show();
    $("body").bind("mousedown", onBodyDownByQueryMapTree);
}// 点击隐藏逻辑

/**
 * 弹出框下拉树展示
 */
function showSelectTreeDialog() {
   if(isShow == "1"){
     $("#selectTreeList").hide();
     isShow = "";
   }else{
     $("#selectTreeList").show();
     isShow = "1";
     getDialogLayerList();
   }
}// 点击隐藏逻辑


function onBodyDownByQueryMapTree(event) {
    if (event.target.id.indexOf('heatNetTree') == -1) {
        if (event.target.id != 'selectTree') {
            $("#heatNetTree").hide();
            if(hasChange == "1"){
              map.clearOverlays();
              hasChange = "";
              //获取换热站坐标数据
              getStationList();
              //获取管网数据
              getPropList();
            }
        }
    }


}

//获取树内容
function getLayerList(){
  var requestUrl =url+CALCULATION_URL+"/api/mapLayerType/getMapLayerList";
   //查询后台获得数据
   $.ajax({
   			type:'POST',
   			url:requestUrl,
   			dataType: 'json',
  			async:true,
   			data:{
   			},
   			success: function(response) {
  				if(response.code == 0){//成功
  					 treeData = response.data;
             var zTree = $.fn.zTree.init($("#heatNetTree"), setting, treeData);
             var treeObj = $.fn.zTree.getZTreeObj("heatNetTree");
             var nodes = treeObj.getNodes();
             if (nodes.length>0) {
                 for(var i=0;i<nodes.length;i++){
                     treeObj.expandNode(nodes[i], true, false, false);//默认展开第一级节点
                 }
             }
  				}
   			},
   			error: function() {
   			}
   		});
}

//获取弹出框树内容
function getDialogLayerList(){
  var requestUrl =url+CALCULATION_URL+"/api/mapLayerType/getMapLayerList";
   //查询后台获得数据
   $.ajax({
   			type:'POST',
   			url:requestUrl,
   			dataType: 'json',
  			async:false,
   			data:{
   			},
   			success: function(response) {
  				if(response.code == 0){//成功
  					 treeData = response.data;
             var zTree = $.fn.zTree.init($("#selectTreeList"), settingDialog, treeData);
             var treeObj = $.fn.zTree.getZTreeObj("selectTreeList");
             var nodes = treeObj.getNodes();
             if (nodes.length>0) {
                 for(var i=0;i<nodes.length;i++){
                     treeObj.expandNode(nodes[i], true, false, false);//默认展开第一级节点
                 }
             }
             $(".BMap_pop div:nth-child(9)").css("overflow","visible");
  				}
   			},
   			error: function() {
   			}
   		});
}

//图层树选中事件
function zTreeOnCheck(e, treeId, treeNode) {
    hasChange = "1";//下拉框值已改
    var checked = treeNode.checked;
    var parentId = treeNode.parentId;
    if("-1" == parentId){
      getAllChildrenNodes(treeNode,checked);
    }else{
        var id =treeNode.layerTypeId;
        var layerName = treeNode.layerName;
        var index = layerTypeIdArr.indexOf(id);  //获取id的下标
        if (index > -1) {
          layerTypeIdArr.splice(index,1);  //移除该下标
          layerTypeNameArr.splice(index,1);
        }
        if(checked){ //选中
          layerTypeIdArr.push(id);
          layerTypeNameArr.push(layerName);
        }
    }
    $("#selectTree").val(layerTypeNameArr.toString());
}

//弹出框图层树选中事件
function zTreeOnCheckDialog(e, treeId, treeNode) {
    $("#selectTreeDialog").val(treeNode.layerName);
    $("#layerId").val(treeNode.layerTypeId);
    $("#selectTreeList").hide();
}


// 递归，获取所有子节点
function getAllChildrenNodes(treeNode,checked){
    if (treeNode.isParent) {
      var childrenNodes = treeNode.children;
      if (childrenNodes) {
        for (var i = 0; i < childrenNodes.length; i++) {
            var index = layerTypeIdArr.indexOf(childrenNodes[i].layerTypeId); //获取id的下标
            if (index > -1) {
                 layerTypeIdArr.splice(index, 1); //移除该下标
                 layerTypeNameArr.splice(index,1);
            }
            if (checked) {
                layerTypeIdArr.push(childrenNodes[i].layerTypeId);
                layerTypeNameArr.push(childrenNodes[i].layerName);
            }
         }
      }
   }
}

//展示指标对象弹出框
function showImObjectDialog(saveType){
  parent.saveType = saveType;
  window.parent.parent.document.getElementById('imObject').click();
}


//保存点信息
  	function savePoint(){
  		var requestUrl =url+CALCULATION_URL+"/api/mapCoordinate/saveCoordinate";
  		var objectName = $("#objectName").val();
  		var layerId = $("#layerId").val();
      var objectNo = $("#objectNo").val();
      var areaNo = $("#areaNo").val();
  		var longitude = $("#longitude").val();
  		var latitude = $("#latitude").val();
  		if(null == objectName || "" == objectName || null == layerId || "" == layerId || null == longitude || "" == longitude || null == latitude || "" == latitude ){
  			alert("请填写该坐标所有相关内容！");
  		}else{
  			   //保存坐标点信息
  				$.ajax({
  						type:'POST',
  						url:requestUrl,
  						dataType: 'json',
  						async:false,
  						contentType:"application/json;charset=UTF-8",
  						data:JSON.stringify({
  							"areaNo":areaNo,
  							"useType":'point',
  							"coordinateType":5,
  							"longitude":longitude,
  							"latitude":latitude,
  							"coordinateDesc":objectName,
                "layerType" : layerId,
                "objectNo" : objectNo
  						}),
  						success: function(response) {
  							if(response.code == 0){//成功
  								map.closeInfoWindow();
  								alert("操作成功！");
                  removeAllMark();
                  getStationList();
  							}else{
  								alert("操作失败！");
  							}
  						},
  						error: function() {
  							alert("操作失败！");
  						}
  					});

  		}

  	}

 //保存折线点数组信息
	function savePolyline(pointArray){
		var requestUrl =url+CALCULATION_URL+"/api/mapCoordinate/savePolylineList";
		var pointName = $("#pointName").val();
		var areaNo = $("#areaNo").val();
    var objectNo = $("#objectNo").val();
    var layerId = $("#layerId").val();
    if(null == pointArray || pointArray.length == 0){
      alert("未获取到折线点数组信息！");
    }else	if(null == pointName || "" == pointName || null == layerId || "" == layerId || null == objectNo || "" == objectNo){
			alert("请填写该折线所有相关内容！");
		}else{
      var polylineArray = [];
      var point;
      for(var i=0;i<pointArray.length;i++){
        point = new Object();
        point.areaNo = areaNo;
        point.useType = "line";
        point.coordinateType = 5;
        point.layerType = layerId;
        point.objectNo = objectNo;
        point.longitude = pointArray[i].lng;
        point.latitude= pointArray[i].lat;
        point.coordinateDesc = pointName;
        point.lineSort = (i+1);
        polylineArray.push(point);
      }
			//保存折线坐标点信息
				$.ajax({
						type:'POST',
						url:requestUrl,
						dataType: 'json',
						async:false,
						contentType:"application/json;charset=UTF-8",
						data:JSON.stringify(polylineArray),
						success: function(response) {
							if(response.code == 0){//成功
								map.closeInfoWindow();
								alert("操作成功！");
                removeAllPolyline();
                getPropList();
							}else{
								alert("操作失败！");
							}
						},
						error: function() {
							alert("操作失败！");
						}
					});

		}

	}

//删除指定点
	function removeMark(longitude,latitude){
		var allOverlay = map.getOverlays();
		for(var j = 0;j<allOverlay.length;j++) {
			if (allOverlay[j].toString()=="[object Marker]" && allOverlay[j].point.lng ==longitude && allOverlay[j].point.lat==latitude ) {
				map.removeOverlay(allOverlay[j]);
			}
		}
	}

  //删除点
  	function removeAllMark(){
  		var allOverlay = map.getOverlays();
  		for(var j = 0;j<allOverlay.length;j++) {
  			if (allOverlay[j].toString()=="[object Marker]") {
  				map.removeOverlay(allOverlay[j]);
  			}
  		}
  	}

//删除指定折线
	function removePolyline(pointArray){
		var allOverlay = map.getOverlays();
		for(var j = 0;j<allOverlay.length;j++) {
			if (allOverlay[j].toString()=="[object Polyline]" && JSON.stringify(allOverlay[j].getPath())==JSON.stringify(pointArray)) {
				map.removeOverlay(allOverlay[j]);
			}
		}
	}

//删除所有折线
function removeAllPolyline(){
	var allOverlay = map.getOverlays();
	for(var j = 0;j<allOverlay.length;j++) {
		if (allOverlay[j].toString()=="[object Polyline]") {
			map.removeOverlay(allOverlay[j]);
		}
	}
}


//右键单击marker出现右键菜单事件
 function rightPointClick(pointId,coordinateDesc,longitude,latitude){
   var requestUrl =url+CALCULATION_URL+"/api/mapCoordinate/removePoint";
     if (confirm("要删除点【"+coordinateDesc+"】吗？")){
        if(true){
            $.ajax({
            		type:'POST',
            		url:requestUrl,
            		dataType: 'json',
            		async:false,
            		contentType:"application/json;charset=UTF-8",
            		data:JSON.stringify({
            			guid:pointId
            		}),
            		success: function(response) {
            			if(response.code == 0){//成功
            				removeMark(longitude,latitude);
            				alert("操作成功！");
            			}else{
            				alert("操作失败！");
            			}
            		},
            		error: function() {
            			alert("操作失败！");
            		}
            	});
         }
     }
 }

 //右键单击polyline出现右键菜单事件
  function rightLineClick(lineNo,pointArray){
    var requestUrl =url+CALCULATION_URL+"/api/mapCoordinate/removePolylineList";
      if (confirm("确认要删除该折线吗？")){
         if(true){
             $.ajax({
             		type:'POST',
             		url:requestUrl,
             		dataType: 'json',
             		async:false,
             		contentType:"application/json;charset=UTF-8",
             		data:JSON.stringify({
             			lineNo:lineNo
             		}),
             		success: function(response) {
             			if(response.code == 0){//成功
             				removePolyline(pointArray);
             				alert("操作成功！");
             			}else{
             				alert("操作失败！");
             			}
             		},
             		error: function() {
             			alert("操作失败！");
             		}
             	});
          }
      }
  }

//加大地图级别
function addZoom() {
   map.zoomIn(); //放大一级视图
   if (mapZoom < maxZoom) {
     mapZoom++;
     $('.wrap_show').html(mapZoom);
   }
}

//缩小地图级别
function delZoom() {
   map.zoomOut(); //缩小一级视图
   if (mapZoom > minZoom) {
     mapZoom--;
     $('.wrap_show').html(mapZoom);
   }
}
