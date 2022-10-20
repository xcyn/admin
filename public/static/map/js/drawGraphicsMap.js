 var url = "";
 var CALCULATION_URL = "";
 var map ="";
 var treeData;
 var isShow = "";
 var mapZoom = 6;//地图的初始化缩放级别
 var minZoom = 4;//地图最小缩放级别
 var maxZoom = 19;//地图最大缩放级别
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
         chkStyle: "radio"   //当父节点设置 nocheck = true 时，设置子节点是否自动继承 nocheck = true
     },
     view: {
     		showIcon: false
     },
     callback : {
       onCheck : zTreeOnCheck,
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
    	//百度地图API功能
    	map = new BMap.Map('allmap');
    	var poi = new BMap.Point(116.404188,39.914687);
    	map.centerAndZoom(poi, 6);//设置中心点坐标和地图级别
    	map.enableScrollWheelZoom(); //启用鼠标滚动对地图放大缩小
      // map.addControl(new BMap.NavigationControl());   //缩放按钮
      //鼠标滚动致使地图上的放大缩小---缩放区间在4-19之间
      map.addEventListener("zoomend", function(e){
        mapZoom = map.getZoom();
        $('.wrap_show').html(mapZoom);
      });

      //绘制自定义区域
      getPolygonList();

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
                  "<input type='text' style='margin-top:10px;width:200px;position:relative' id='selectTree' readonly onclick='showSelectTree()' placeholder='请选择'/> "+
                  "<div class='treeBox'  style='position:absolute'>"+
                  "<ul id='heatNetTree' class='ztree' ></ul></div>"+
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
               $("#heatNetTree").hide();
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
                    "<input type='text' style='margin-top:10px;width:200px;position:relative' id='selectTree' readonly onclick='showSelectTree()' placeholder='请选择'/> "+
                    "<div class='treeBox'  style='position:absolute'>"+
                    "<ul id='heatNetTree' class='ztree' ></ul></div>"+
                    "</td>" +
                  "</tr>" +
                  "<tr>" +
                    "<td style='text-align:right;'><b>描述：</b></td><td>" +
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

            });

          }
        break;
        case "polygon":
        {
          var polygon = e.overlay;
          var pointArray = e.overlay.getPath();//Array<Point> 返回多边形的点数组
          var pointArrayInfo = JSON.stringify(pointArray);
          /*-----------------多边形右键删除-------------------------*/
          var polygonMenu = new BMap.ContextMenu();
          polygonMenu.addItem(new BMap.MenuItem('删除多边形', function () {
            map.removeOverlay(polygon);
          }));
          polygon.addContextMenu(polygonMenu);

          polygon.addEventListener("click", function (e) {
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
              	    "<td style='text-align:right;' colspan='2'>" +
              	       "<input type='button' value='保存' onclick='savePolygon("+pointArrayInfo.replace(/"/g,'&quot;')+")' style='width: 40px;line-height: 40px;'/>" +
              	    "</td>" +
              	  "</tr>" +
              	"</talbe>";
                var opts = {enableMessage: false};
                if(null != pointArray && pointArray.length>0){
                  var point = new BMap.Point(pointArray[0].lng,pointArray[0].lat);
                  var infoWindow = new BMap.InfoWindow(sContent, opts);
                  map.openInfoWindow(infoWindow,point);
                }
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
                            // BMAP_DRAWING_MARKER,
                            BMAP_DRAWING_POLYGON
                            // BMAP_DRAWING_POLYLINE
                            //BMAP_DRAWING_RECTANGLE
                            //BMAP_DRAWING_CIRCLE
                          ]
    	                },
    	                 polylineOptions: styleOptions, //线的样式
                       polygonOptions: styleOptions //多边形的样式
    	            });
      drawingManager.addEventListener('overlaycomplete', overlaycomplete);

});

  //保存折线点数组信息
	function savePolyline(pointArray){
		var requestUrl =url+CALCULATION_URL+"/api/mapCoordinate/savePolylineList";
		var pointName = $("#pointName").val();
		var areaNo = $("#areaNo").val();
    var objectNo = $("#objectNo").val();
    var layerId = $("#layerId").val();
    if(null == pointArray || pointArray.length == 0){
      alert("未获取到折线点数组信息！");
    }else	if(null == pointName || "" == pointName || null == layerId || "" == layerId){
			alert("请填写该折线所有相关内容！");
		}else{
      var polylineArray = [];
      var point;
      for(var i=0;i<pointArray.length;i++){
        point = new Object();
        point.areaNo = areaNo;
        point.useType = "line";
        point.coordinateType = 5;
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


//保存多边形点数组信息
	function savePolygon(pointArray){
		var requestUrl =url+CALCULATION_URL+"/api/mapCoordinate/savePolygonList";
		var areaName = $("#objectName").val();
		var areaNo = $("#areaNo").val();
    var objectNo = $("#objectNo").val();
    if(null == pointArray || pointArray.length == 0){
      alert("未获取到多边形点数组信息！");
    }else	if(null == areaNo || "" == areaNo){
			alert("请选择关联指标对象！");
		}else{
      var polylineArray = [];
      var point;
      for(var i=0;i<pointArray.length;i++){
        point = new Object();
        point.areaNo = areaNo;
        point.useType = "polygon";
        point.coordinateType = 5;
        point.longitude = pointArray[i].lng;
        point.latitude= pointArray[i].lat;
        point.coordinateDesc = areaName;
        point.objectNo = objectNo;
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
								removePolygon(pointArray);
								alert("操作成功！");
                //绘制自定义区域
                getPolygonList();
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


//删除点
	function removeMark(longitude,latitude){
		var allOverlay = map.getOverlays();
		for(var j = 0;j<allOverlay.length;j++) {
			if (allOverlay[j].toString()=="[object Marker]" && allOverlay[j].point.lng ==longitude && allOverlay[j].point.lat==latitude ) {
				map.removeOverlay(allOverlay[j]);
			}
		}
	}


//删除折线
	function removePolyline(pointArray){
		var allOverlay = map.getOverlays();
		for(var j = 0;j<allOverlay.length;j++) {
			if (allOverlay[j].toString()=="[object Polyline]" && JSON.stringify(allOverlay[j].getPath())==JSON.stringify(pointArray)) {
				map.removeOverlay(allOverlay[j]);
			}
		}
	}


  //删除多边形
  function removePolygon(pointArray){
  		var allOverlay = map.getOverlays();
  		for(var j = 0;j<allOverlay.length;j++) {
  			if (allOverlay[j].toString()=="[object Polygon]" && JSON.stringify(allOverlay[j].getPath())==JSON.stringify(pointArray)) {
  				map.removeOverlay(allOverlay[j]);
  			}
  		}
  }

//展示覆盖物选择树
function showSelectTree() {
    if(isShow == "1"){
      $("#heatNetTree").hide();
      isShow = "";
    }else{
      $("#heatNetTree").show();
      isShow = "1";
      getLayerList();
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
  			async:false,
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
            // $(".BMap_pop div:nth-child(9)").css("overflow","auto");
             $(".BMap_pop div:nth-child(9)").css("overflow","visible");
             /* $(".BMap_pop div:nth-child(9)").css("height","auto");
             $(".BMap_pop .BMap_center").css("overflow","auto"); */
  				}
   			},
   			error: function() {
   			}
   		});
}

//图层树选中事件
function zTreeOnCheck(e, treeId, treeNode) {
    $("#selectTree").val(treeNode.layerName);
    $("#layerId").val(treeNode.layerTypeId);
    $("#heatNetTree").hide();
}

//展示指标对象弹出框
function showImObjectDialog(saveType){
  parent.saveType = saveType;
  window.parent.parent.document.getElementById('imObject').click();
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

/***************获取自定义区域信息数据****************************/
    function getPolygonList(){
    	var requestUrl =url+CALCULATION_URL+"/api/mapCoordinate/getCoordinateList";
    	 //查询后台获得数据
    	 	$.ajax({
    	 			type:'POST',
    	 			url:requestUrl,
    	 			dataType: 'json',
    				async:false,
    	 			data:{
    	 				useType:'polygon'
    	 			},
    	 			success: function(response) {
    					if(response.code == 0){//成功
    						var data = response.data;
    						var point = null;
    						var marker = null;
    						var areaNo = "";
    						var pointArray = new Array();
                var fillColor = "";
    						var polygon;
    						for (var i = 0;  i< data.length+1; i++) {
    							if(i == data.length){
    								if("" != areaNo && pointArray.length>0 ){
                      if("" == fillColor){
                        fillColor = "grey";
                      }
    									polygon = new BMap.Polygon( pointArray, {strokeWeight: 0,fillColor: fillColor, strokeColor: fillColor,fillOpacity: 1,});   //创建多边形
    									map.addOverlay(polygon);
    									pointArray = new Array();
                      fillColor = "";
    								}
    							}else {
    								if("" != areaNo && pointArray.length>0 && areaNo != data[i].areaNo){
                      if("" == fillColor){
                        fillColor = "grey";
                      }
    									polygon = new BMap.Polygon( pointArray, {strokeWeight: 0,fillColor: fillColor, strokeColor: fillColor,fillOpacity: 1,});   //创建多边形
    									map.addOverlay(polygon);
    									pointArray = new Array();
                      fillColor = "";
    								}
    								areaNo = data[i].areaNo;
                    if("" == fillColor && null != data[i].fillColor && "" != data[i].fillColor){
                        fillColor = data[i].fillColor;
                    }
    								point = new BMap.Point(data[i].longitude,data[i].latitude);
    								pointArray.push(point);
    							}
    						}

    					}
    	 			},
    	 			error: function() {
    	 			}
    	 		});
    }
