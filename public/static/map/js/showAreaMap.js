 var url = "";
 var CALCULATION_URL = "";
 var map ="";
 var mapZoom = 6;//地图的初始化缩放级别
 var minZoom = 4;//地图最小缩放级别
 var maxZoom = 19;//地图最大缩放级别

$(function () {
    url = parent.api_url;
    CALCULATION_URL = parent.CALCULATION_URL;
    	//百度地图API功能
    map = new BMap.Map('allmap');
    var poi = new BMap.Point(116.404188,39.914687);
    map.centerAndZoom(poi, 6);//设置中心点坐标和地图级别
    map.enableScrollWheelZoom(); //启用鼠标滚动对地图放大缩小
    // map.addControl(new BMap.NavigationControl());   //缩放按钮
    //绘制自定义区域
    getPolygonList();

    //鼠标滚动致使地图上的放大缩小---缩放区间在4-19之间
    map.addEventListener("zoomend", function(e){
      mapZoom = map.getZoom();
      $('.wrap_show').html(mapZoom);
    });
});


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
