var url = "";
 var CALCULATION_URL = "";
 var map = "";
 var areaNo = "";
 var objectId = "";
 var serachMarkerArr = new Array();
 var zTreeObj;
 var treeData;
 var layerTypeIdArr = []; //用于存放选中的图层
 var layerTypeNameArr = []; //用于存放选中的图层
 var hasChange = "";
 var mapZoom = 11; //地图的初始化缩放级别
 var minZoom = 4; //地图最小缩放级别
 var maxZoom = 19; //地图最大缩放级别
 var setting = {
   data: {
     simpleData: {
       enable: true, //true 、 false 分别表示 使用 、 不使用 简单数据模式
       idKey: "layerTypeId", //节点数据中保存唯一标识的属性名称
       pIdKey: "parentId", //节点数据中保存其父节点唯一标识的属性名称
       rootPId: -1 //用于修正根节点父节点数据，即 pIdKey 指定的属性值
     },
     key: {
       name: "layerName" //zTree 节点数据保存节点名称的属性名称  默认值："name"
     }
   },
   check: {
     enable: true, //true 、 false 分别表示 显示 、不显示 复选框或单选框
     nocheckInherit: true //当父节点设置 nocheck = true 时，设置子节点是否自动继承 nocheck = true
   },
   view: {
     showIcon: false
   },
   callback: {
     onCheck: zTreeOnCheck
   }
 };
 $(function() {
   url = parent.api_url;
   CALCULATION_URL = parent.CALCULATION_URL;
   areaNo = parent.areaNo;
   objectId = parent.objectId;
   //百度地图API功能
   map = new BMap.Map('allmap', {
     minZoom: minZoom,
     maxZoom: maxZoom
   });
   var poi;
   if ("" != areaNo && null != parent.longitude && "" != parent.longitude && null != parent.latitude && "" != parent
     .latitude) {
     poi = new BMap.Point(parent.longitude, parent.latitude);
   } else {
     poi = new BMap.Point(123.487147, 41.738287);
   }
   if ("" != areaNo && null != parent.mapLevel && "" != parent.mapLevel) {
     map.centerAndZoom(poi, parent.mapLevel); //设置中心点坐标和地图级别
     mapZoom = parent.mapLevel;
     $('.wrap_show').html(mapZoom);
   } else {
     map.centerAndZoom(poi, 11); //设置中心点坐标和地图级别
      $('.wrap_show').html(11);
   }
   //小于15级不展示点
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
   map.addEventListener("zoomend", function(e) {
     mapZoom = map.getZoom();
     $('.wrap_show').html(mapZoom);
     var allOverlay = map.getOverlays();
  	 for(var j = 0;j<allOverlay.length;j++) {
  			if (allOverlay[j].toString()=="[object Marker]") {
          if(mapZoom < 15){
           allOverlay[j].hide();
          }else{
            allOverlay[j].show();
          }
  			}
  		}

   });

 });
 /***************获取换热站坐标数据****************************/
 function getStationList() {
   var requestUrl = url + CALCULATION_URL + "/api/mapCoordinate/getCoordinateList";
   //查询后台获得数据
   $.ajax({
     type: 'POST',
     url: requestUrl,
     async: true,
     data: Object.assign({
       areaNo: areaNo,
       useType: 'point',
       objectId: objectId,
       layerTypeIdArr: JSON.stringify(layerTypeIdArr)
     }),
     success: function(response) {
       if (response.code == 0) { //成功
         var data = response.data;
         var point = null;
         var label = null;
         var layerType = "";
         var labelDesc = "";
         var pageName = ""; //详情页面名称
         var layerPicName = ""; //图片名称
         var objectNo = ""; //站对应的指标编码
         var objectId = ""; //指标对象ID
         var picLocation = "./images/";
         var myIcon = null;
         var marker = null;
         for (var i = 0; i < data.length; i++) {
           picLocation = "./images/";
           layerType = data[i].layerType;
           labelDesc = data[i].coordinateDesc;
           pageName = data[i].pageName;
           objectNo = data[i].objectNo;
           objectId = data[i].objectId;
           layerPicName = data[i].layerPicName;
           if (null == layerPicName || "" == layerPicName) {
             picLocation = picLocation + "heatStation.png";
           } else {
             picLocation = picLocation + layerPicName + ".png";
           }
           myIcon = new BMap.Icon(picLocation, new BMap.Size(30, 30));
           point = new BMap.Point(data[i].longitude, data[i].latitude);
           label = new BMap.Label(data[i].coordinateDesc, {
             offset: new BMap.Size(20, -10)
           });
           marker = new BMap.Marker(point, {
             icon: myIcon
           });
           map.addOverlay(marker);
           marker.customData = {
             'labelDesc': labelDesc,
             "pageName": pageName,
             "objectNo": objectNo,
             "objectId": objectId,
             "layerType": layerType
           };

           var steelOpts = {
             width: 80, //信息窗口宽度
             height: 20, //信息窗口高度
             enableMessage: true //设置允许信息窗发送短息
           };
           marker.addEventListener("click", function(e) {
             if (null != pageName && "" != pageName) {
               parent.detailUrl = e.currentTarget.customData.pageName;
               parent.stationName = e.currentTarget.customData.labelDesc;
               parent.stationNo = e.currentTarget.customData.objectNo;
               parent.objectId = e.currentTarget.customData.objectId;
               parent.layerType = e.currentTarget.customData.layerType;
               parent.changeState();
             }

           });

           marker.addEventListener("mouseover", function(e) {
             var desc = e.currentTarget.customData.labelDesc;
             var steelContent = "<div><p>" + desc + "</p></div>";
             this.openInfoWindow(new BMap.InfoWindow(steelContent, steelOpts));
           });
           marker.addEventListener("mouseout", function() {
             this.closeInfoWindow();
           });

         }

        //地图放大层级小于15不显示
         mapZoom = map.getZoom();
         var allOverlay = map.getOverlays();
         for(var j = 0;j<allOverlay.length;j++) {
          if (allOverlay[j].toString()=="[object Marker]") {
              if(mapZoom < 15){
               allOverlay[j].hide();
              }else{
                allOverlay[j].show();
              }
          }
         }

         //展示三级单位跳转过来的点
         var pointObj = parent.point;
         var customData = parent.customData;
         if (null != pointObj) {
           var centerPoint = new BMap.Point(pointObj.lng, pointObj.lat);
           map.centerAndZoom(centerPoint, 17); //设置中心点坐标和地图级别
           $('.wrap_show').html(17);
           if (null != customData.pageName && "" != customData.pageName) {
             parent.detailUrl = customData.pageName;
             parent.stationName = customData.labelDesc;
             parent.stationNo = customData.objectNo;
             parent.objectId = customData.objectId;
             parent.changeState();
           }
           var desc = customData.labelDesc;
           var steelContent = "<div><p>" + desc + "</p></div>";
           var steelOpts = {
             width: 80, //信息窗口宽度
             height: 20, //信息窗口高度
             enableMessage: true //设置允许信息窗发送短息
           };
           map.openInfoWindow(new BMap.InfoWindow(steelContent, steelOpts), centerPoint);
         }

       }
     },
     error: function() {}
   });
   return false;
 }

 /***************获取管网信息数据****************************/
 function getPropList() {
   var requestUrl = url + CALCULATION_URL + "/api/mapCoordinate/getCoordinateList";
   //查询后台获得数据
   $.ajax({
     type: 'POST',
     url: requestUrl,
     async: true,
     data: Object.assign({
       areaNo: areaNo,
       useType: 'line',
       objectId: objectId,
       layerTypeIdArr: JSON.stringify(layerTypeIdArr)
     }),
     success: function(response) {
       if (response.code == 0) { //成功
         var data = response.data;
         var point = null;
         var marker = null;
         var lineNo = "";
         var lineDesc = "";
         var pointArray = new Array();
         var polyline;
         for (var i = 0; i < data.length + 1; i++) {
           if (i == data.length) {
             if ("" != lineNo && pointArray.length > 0) {
               polyline = new BMap.Polyline(pointArray, {
                 strokeColor: "blue",
                 strokeWeight: 4,
                 strokeOpacity: 0.5
               }); //创建折线
               map.addOverlay(polyline);
               pointArray = new Array();
             }
           } else {
             if ("" != lineNo && pointArray.length > 0 && lineNo != data[i].lineNo) {
               polyline = new BMap.Polyline(pointArray, {
                 strokeColor: "blue",
                 strokeWeight: 4,
                 strokeOpacity: 0.5
               }); //创建折线
               map.addOverlay(polyline);
               polyline.customData = {
                 'lineNo': lineNo,
                 'lineDesc' : lineDesc,
                 'lng':pointArray[0].lng,
                 'lat':pointArray[0].lat
               };
               pointArray = new Array();
               var steelOpts = {
                 width: 80, //信息窗口宽度
                 height: 20, //信息窗口高度
                 enableMessage: true //设置允许信息窗发送短息
               };
               //管网悬浮可显示管网名称
               polyline.addEventListener("mouseover", function(e) {
                 e.currentTarget.setStrokeOpacity(1);
                 e.currentTarget.setStrokeColor('#FF8C00');
                 var lineNo = e.currentTarget.customData.lineNo;
                 var lineDesc = e.currentTarget.customData.lineDesc;
                 var opts = {enableMessage: false};
                 // console.log(lineNo);
                 var steelContent = "<div><p>" + lineDesc + "</p></div>";
                 var point = new BMap.Point(e.currentTarget.customData.lng,e.currentTarget.customData.lat);
                 var infoWindow = new BMap.InfoWindow(steelContent, opts);
                 map.openInfoWindow(infoWindow,point);
               });
               polyline.addEventListener("mouseout", function(e) {
                 e.currentTarget.setStrokeColor('blue');
                 e.currentTarget.setStrokeOpacity(0.5);
               });
             }
             lineNo = data[i].lineNo;
             lineDesc = data[i].coordinateDesc;
             point = new BMap.Point(data[i].longitude, data[i].latitude);
             pointArray.push(point);
           }

         }

       }
     },
     error: function() {}
   });
   return false;
 }


 /***************查询热源、站****************************/
 function searchPoint() {
   var searchVal = $("#searchPoint").val();
   if ("" == searchVal) {
     return;
   }
   var requestUrl = url + CALCULATION_URL + "/api/mapCoordinate/getCoordinateList";
   //查询后台获得数据
   $.ajax({
     type: 'POST',
     url: requestUrl,
     async: true,
     data: Object.assign({
       coordinateDesc: searchVal,
       useType: 'point',
       areaNo: areaNo,
       objectId: objectId
     }),
     success: function(response) {
       if (response.code == 0) { //成功
         var data = response.data;
         if(data.length == 0){
           alert("未搜索到相关信息!");
         }else{
           var point = null;
           point = new BMap.Point(data[0].longitude, data[0].latitude);
           map.centerAndZoom(point, 17); //设置中心点坐标和地图级别
           var desc = data[0].coordinateDesc;
           var steelContent = "<div><p>" + desc + "</p></div>";
           var steelOpts = {
             width: 80, //信息窗口宽度
             height: 20, //信息窗口高度
             enableMessage: true //设置允许信息窗发送短息
           };
           map.openInfoWindow(new BMap.InfoWindow(steelContent, steelOpts), point);
           if(null != point){
             parent.detailUrl = data[0].pageName;
             parent.stationName = data[0].coordinateDesc;
             parent.stationNo = data[0].objectNo;
             parent.objectId = data[0].objectId;
             parent.changeState();
           }
         }
       }
     },
     error: function() {}
   });
   return false;
 }

 function showSelectTree() {
   $("#heatNetTree").show();
   $("body").bind("mousedown", onBodyDownByQueryMapTree);
 } // 点击隐藏逻辑

 function onBodyDownByQueryMapTree(event) {
   if (event.target.id.indexOf('heatNetTree') == -1) {
     if (event.target.id != 'selectTree') {
       $("#heatNetTree").hide();
       if (hasChange == "1") {
         map.clearOverlays();
         hasChange = "";
         if(mapZoom<15){
           map.setZoom(15);
           mapZoom = 15;
           $('.wrap_show').html(mapZoom);
         }
         //获取换热站坐标数据
         getStationList();
         //获取管网数据
         getPropList();
       }
     }
   }


 }

 //获取树内容
 function getLayerList() {
   var requestUrl = url + CALCULATION_URL + "/api/mapLayerType/getMapLayerList";
   //查询后台获得数据
   $.ajax({
     type: 'POST',
     url: requestUrl,
     async: true,
     data: {},
     success: function(response) {
       if (response.code == 0) { //成功
         treeData = response.data;
         var zTree = $.fn.zTree.init($("#heatNetTree"), setting, treeData);
         var treeObj = $.fn.zTree.getZTreeObj("heatNetTree");
         var nodes = treeObj.getNodes();
         if (nodes.length > 0) {
           for (var i = 0; i < nodes.length; i++) {
             treeObj.expandNode(nodes[i], true, false, false); //默认展开第一级节点
           }
         }
       }
     },
     error: function() {}
   });
 }

 //图层树选中事件
 function zTreeOnCheck(e, treeId, treeNode) {
   parent.point = null;
   hasChange = "1"; //下拉框值已改
   var checked = treeNode.checked;
   var parentId = treeNode.parentId;
   if ("-1" == parentId) {
     getAllChildrenNodes(treeNode, checked);
   } else {
     var id = treeNode.layerTypeId;
     var layerName = treeNode.layerName;
     var index = layerTypeIdArr.indexOf(id); //获取id的下标
     if (index > -1) {
       layerTypeIdArr.splice(index, 1); //移除该下标
       layerTypeNameArr.splice(index, 1);
     }
     if (checked) { //选中
       layerTypeIdArr.push(id);
       layerTypeNameArr.push(layerName);
     }
   }
   $("#selectTree").val(layerTypeNameArr.toString());
 }


 // 递归，获取所有子节点
 function getAllChildrenNodes(treeNode, checked) {
   if (treeNode.isParent) {
     var childrenNodes = treeNode.children;
     if (childrenNodes) {
       for (var i = 0; i < childrenNodes.length; i++) {
         var index = layerTypeIdArr.indexOf(childrenNodes[i].layerTypeId); //获取id的下标
         if (index > -1) {
           layerTypeIdArr.splice(index, 1); //移除该下标
           layerTypeNameArr.splice(index, 1);
         }
         if (checked) {
           layerTypeIdArr.push(childrenNodes[i].layerTypeId);
           layerTypeNameArr.push(childrenNodes[i].layerName);
         }
       }
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
