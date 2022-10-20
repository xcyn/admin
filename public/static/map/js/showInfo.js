function getPointValue(tpNo,locaNo){
	var requestUrl =url+CALCULATION_URL+"/api/mapCoordinate/getStationPointValue";
	var value = 0;
	//查询后台获得数据
		$.ajax({
			type:'POST',
			url:requestUrl,
			async:true,
			data:{
				tpNo:tpNo,
				locaNo:locaNo
			},
			success: function(response) {
	  			if(response.code == 0){//成功
					value = response.data;
				 }
			},
			error: function() {
			}
		});
	return value;
}

function getLastIndicatorValue(indicatorNo,locaNo,timeTypeNo){
  var param = {
    objectNo: locaNo,
    indicatorNo: indicatorNo,
    timeTypeNo: timeTypeNo, // 供热季
  };
	var requestUrl =url+CALCULATION_URL+"/api/mapCoordinate/getLastImData";
	var value = 0;
	//查询后台获得数据
		$.ajax({
			type:'POST',
			url:requestUrl,
      dataType: 'json',
			async:true,
			data:param,
			success: function(response) {
	  		if(response.code == 0){//成功
          if(response.data.length>0){
            value = response.data[0].dataValue;
          }
				 }
			},
			error: function() {
			}
		});
	return value;
}

//获取测点名称
function getPointName(tpNo,locaNo){
	var requestUrl =url+CALCULATION_URL+"/api/mapCoordinate/getStationPointName";
	var value = "";
	//查询后台获得数据
		$.ajax({
			type:'POST',
			url:requestUrl,
			async:true,
			data:{
				tpNo:tpNo,
				locaNo:locaNo
			},
			success: function(response) {
	  			if(response.code == 0){//成功
					value = response.data;
				 }
			},
			error: function() {
			}
		});
	return value;
}


//获取测点信息
function getStationPointInfo(tpNo,locaNo){
	var requestUrl =url+CALCULATION_URL+"/api/mapCoordinate/getStationPointInfo";
	var value = null;
	//查询后台获得数据
		$.ajax({
			type:'POST',
			url:requestUrl,
			async:false,
			data:{
				tpNo:tpNo,
				locaNo:locaNo
			},
			success: function(response) {
	  			if(response.code == 0){//成功
            value = response.data;
				 }
			},
			error: function() {
			}
		});
	return value;
}

function tabs(tabTit,on,tabCon){
        $(tabTit).children().hover(function(){
            $(this).addClass(on).siblings().removeClass(on);
            var index = $(tabTit).children().index(this);
           	$(tabCon).children().eq(index).show().siblings().hide();
    	});
}

function linkConfig(objNo,objId){
  parent.linkConfig(objNo,objId);
}

function linkIndicatorInfo(indicatorNo,objectNo,type){
  parent.linkIndicatorInfo(indicatorNo,objectNo,type);
}

function showPointTrend(pointNo){
  parent.showPointTrend(pointNo);
}
