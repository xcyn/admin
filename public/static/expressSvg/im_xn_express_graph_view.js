function randomData() {
    now = new Date(+now + oneDay);
    value = value + Math.random() * 21 - 10;
    return {
        name: now.toString(),
        value: [
            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
            Math.round(value)
        ]
    };
}


//返回当前选择测点
function loadSelectedPoint(){
	return nowpoint;
}

Date.prototype.format = function(fmt) {
    var o = {
       "M+" : this.getMonth()+1,                 //月份
       "d+" : this.getDate(),                    //日
       "h+" : this.getHours(),                   //小时
       "m+" : this.getMinutes(),                 //分
       "s+" : this.getSeconds(),                 //秒
       "q+" : Math.floor((this.getMonth()+3)/3), //季度
       "S"  : this.getMilliseconds()             //毫秒
   };
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt;
};

var gobal_point_data = {};

//用户自定义函数从这里添加
var initMenuFlag = false;//初始化右击目录标志
var ie_flag = false;
function drawTreeGraph(rootData,bottom) {
   picName = rootData.calcNode.name;
	 var userAgent = navigator.userAgent.toLowerCase();

	 if(userAgent.indexOf("msie")!=-1) ie_flag = true;

      var _this = this;
      // var rootName = ''; //根节点的名字
      var rootRectWidth = 0; //根节点rect的宽度
      var forUpward = true;

      var treeChart = function(d3Object) {
        this.d3 = d3Object;
        this.directions = ['calcNode'];
      };

    var tooltip = d3.select("body")
    .append("div")
    .attr("class","tooltip");
   // .style("opacity",0.8);


      treeChart.prototype.drawChart = function() {
        // First get tree data for both directions.
        this.treeData = {};
        var self = this;
		self.directions.forEach(function(direction) {
            self.treeData[direction] = rootData[direction];
          });
          rootName = rootData["calcNode"]["name"];
          //rootRectWidth = rootName.length * 15+10;
          self.graphTree(self.getTreeConfig());
      };
      treeChart.prototype.getTreeConfig = function() {
        var treeConfig = {
          'margin': {
            'top': 0,
            'right': 0,
            'bottom':bottom||300,
            'left': 0
          }
        }
        treeConfig.chartWidth = (1600 - treeConfig.margin.right - treeConfig.margin.left);
        treeConfig.chartHeight = (1000 - treeConfig.margin.top - treeConfig.margin.bottom);
        treeConfig.centralHeight = treeConfig.chartHeight / 2 -50;
        treeConfig.centralWidth = treeConfig.chartWidth / 6;
        treeConfig.linkLength = 300;
        treeConfig.duration = 850; //动画时间
        return treeConfig;
      };

      treeChart.prototype.graphTree = function(config) {

        var self = this;
        var d3 = this.d3;
        var linkLength = config.linkLength;
        var duration = config.duration;
        var hasChildNodeArr = [];
        var id = 0;
        var diagonal = d3.svg.diagonal()
          .projection(function(d) {
            return [d.y, d.x];
          });

		  	var pathFunc;
			if (false) {
			   pathFunc = diagonal;
		   } else {
			   pathFunc = funLine;
		   }
        var zoom = d3.behavior.zoom()
          .scaleExtent([0.5, 2])
          .on('zoom', redraw);
        var svg = d3.select('#product_tree')
          .append('svg')
          //.attr('width', config.chartWidth + config.margin.right + config.margin.left)
            .attr('height', config.chartHeight + config.margin.top + config.margin.bottom)
          .attr('width',"100%")
          .attr('xmlns','http://www.w3.org/2000/svg')
         // .on('mousedown', disableRightClick)
          .call(zoom)
          .on('dblclick.zoom', function(){
          });
           var treeG = svg.append('g')
          .attr('class', 'gbox')
          .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');

        //箭头
        var markerDown = svg.append("marker")
          .attr("id", "resolvedDown")
          .attr("markerUnits", "strokeWidth") //设置为strokeWidth箭头会随着线的粗细发生变化
          .attr("markerUnits", "userSpaceOnUse")
          .attr("viewBox", "0 -5 10 10") //坐标系的区域
          .attr("refX", 0) //箭头坐标
          .attr("refY", 0)
          .attr("markerWidth", 11) //标识的大小
          .attr("markerHeight", 11)
          .attr("orient", "0") //绘制方向，可设定为：auto（自动确认方向）和 角度值
          .attr("stroke-width", 2) //箭头宽度
          .append("path")
          .attr("d", "M0,-5L10,0L0,5") //箭头的路径
          .attr('fill', '#FA5F5F'); //箭头颜色

        // Initialize the tree nodes and update chart.
        for(var d in this.directions) {
          var direction = this.directions[d];
          var data = self.treeData[direction];
			if (typeof(data) != "undefined") {
			  data.x0 = config.centralHeight;
			  data.y0 = config.centralWidth;
			  data.children.forEach(collapse);
			  update(data, data, treeG);
			}

        }
        function update(source, originalData, g) {
          var direction = originalData['direction'];
          var node_class = direction + 'Node';
          var link_class = direction + 'Link';
          var downwardSign =1;
        //  var nodeColor = '#8b4513';
         // console.log(source);
          var node_id=source.node_id;
          var isExpand = false;
          var nodeSpace = 67;
         // var tree = d3.layout.tree().sort(sortByDate).nodeSize([nodeSpace, 0]);
          var tree = d3.layout.tree().nodeSize([nodeSpace, 0]);
          var nodes = tree.nodes(originalData);
          var links = tree.links(nodes);
          var offsetY = -config.centralHeight;

           nodes.forEach(function(d) {
            d.y = downwardSign * (d.depth * linkLength) + config.centralWidth;
            d.x = d.x - offsetY;
            if(d.node_type == '0') {
              //d.x = config.centralHeight;
              //d.y += downwardSign * 0; // 左右两树图根节点之间的距离
            }
          });

          // Update the node.
          var node = g.selectAll('g.' + node_class)
            .data(nodes, function(d) {
              return d.id || (d.id = ++id);
            });
             var nodeEnter = node.enter().append('g')

            .attr('class', node_class)
//			.classed('alink',true)//为选择名称而添加的统一class
			.attr('data-text', function(d) {
              return d.name;
            })
            .attr('transform', function(d) {
              return 'translate(' + source.y0 + ',' + source.x0 + ')';
            }).attr('id',function(d){
            	 return d.node_id;
             }).attr('name',function(){
            	 return 0;
             })
            .style('cursor', function(d) {
              return(d.node_type == '0') ? '' : (d.children || d._children) ? 'pointer' : '';
            });


             $("body").click(function(e){
	        	if($(e.target).closest(".gbox").length == 0){
	        	    $(".contextMenuPlugin").remove();
	           		$(".context_menu").remove();
	           		return false;
	        	}
	       	});

             $("body").mouseover(function(e){
	                if($(e.target).closest(".calc_nodeNode").length == 0 && $(e.target).closest(".contextMenuPlugin").length == 0){
		        	    $(".contextMenuPlugin").remove();
		           		$(".context_menu").remove();
		           		return false;
		        	}
	       	});

	       	 $("body").bind("contextmenu",function(e){
	       	   return false;
	       	   if($(e.target).closest(".gbox").length == 0){
        		return false;
	       	   }
    	 	});

	       function initContextMenu(obj,d){
	           var node_id_str = d.node_id;
	           var node_type_str = d.node_type;
	           var point_code_str = d.point_code;
	           var express_name_str = d.name;
	           var calc_value_str = d.calc_value;
	           var point_unit_str = nvl(d.express_unit);

	           var items_arr = [];

	           var modify_fun_obj =  {label:'修改公式',     icon:'modify-data.png',action:function(a,b) {
		          		if("-1"!=node_type_str && null != node_id_str && ""!= node_id_str && null!=point_code_str){
                                //if(null == parent.openMainInTab)alert("不可修改!");
                                if(null == window.parent)alert("不可修改!");
		          				else
                                  //parent.openMainInTab(node_id_str,"计算点修改","/DMS/forms/IndicatorItem_Id/IM_XN_EXPRESS_LIST/im_xn_express_add.htm?_viewId=IM_XN_EXPRESS_VIEW&_menuId=22288fe5-56dc-461f-9b72-2f4f83ed69b9&objName=IM_XN_EXPRESS_LIST&_useType=modify&_pk=ID&_pkValue="+node_id_str);
                                  window.parent.openMenuLink({type:'modifyExpress',id:node_id_str});

		            		}else{
		            		  alert("该节点不可修改！");
		            		}
		            		return false;
		            		$(".contextMenuPlugin").remove();$(".context_menu").remove();
			    } };
			    if(-1 !=node_type_str){
				    items_arr.push(modify_fun_obj);
				    items_arr.push(null);
			    }
			    var modify_data_obj = {label:'修改数据',icon:'modify-data.png',action:function() {

			          		var express_name = express_name_str;//测点名称
			          		var collect_data = calc_value_str; //采集数据
			          		var edit_data = "";//编辑数据
			          		var express_unit = point_unit_str;//单位

			          		Dialog({
							    title: "修改数据",
							    content: "<center><table style='width:80%;font-size:16px;margin-left:60px;' cellspacing='10'><tr><td>测点名称：</td><td><span style='color:#9B9B90;'>"+express_name+"</span></td></tr><tr><td>采集数据：</td><td><span style='color:#9B9B90;'>"+collect_data+"</span></td></tr><tr><td>编辑数据：</td><td><input id='edit_data_id' style='border-left:0px;border-top:0px;border-right:0px;height:40px;width:100px;border-bottom:1px solid #9B9B90;font-size:16px;' /></td><tr><td>单位：</td><td><span style='color:#C1C1B2;'>"+express_unit+"</span></td></tr></table></center>",
							    ok: {
							        waiting: true,
							        waitingText: "正在保存",
							        callback: function () {
							        	var data=$("#edit_data_id").val();
							        	var val=data;
								    	$(obj).find('text[update_data=data]').html(val);
							            window.setTimeout(function () {
							                Dialog.close();
							                $(".contextMenuPlugin").remove();$(".context_menu").remove();
							            }, 100)
							        }
							    },afterOpen: function () {
							       $("#edit_data_id").val(edit_data);
							    },
							    afterClose: function () {

							    }
							});

			          } };

           if(d.depth != 0){
             items_arr.push(modify_data_obj);
           }
			     items_arr.push(null);

           var view_data_obj = {label:'趋势查看',icon:'modify-data.png',action:function() {
              var pointNo = point_code_str;//测点编码
              window.parent.openTrendAnalysisLink({mpNo:pointNo});
            } };

            items_arr.push(view_data_obj);
            items_arr.push(null);

			      var repeat_calc_obj = {label:'重算', icon:'modify-data.png',action:function(a,b) {
			        	  var cArry = d.children||d._children;
			        	  var len = cArry.length;
			        	  var cdata = [];
			        	  var id = d.node_id;

			        	  var point = d.point_code;
			        	  var mval = $('g[id="'+cid+'"]').find('text[update_data="data"]').html();
			        	  var mdata = [];
			        	  var arry = {};
			        	  arry['expressId'] = id;
			        	  arry['value'] = mval;
			        	  arry['point_code'] = point;
			        	  for(var i = 0;i < len;i++){
			        		  var cid = cArry[i].node_id;

			        		  var node_point_code = cArry[i].point_code;
			        		  var data = {};
			        		  var val = $('g[id="'+cid+'"]').find('text[update_data="data"]').html();
			        		  data['expressId'] = cid;
			        		  data['value'] = val;
			        		  data['point_code'] = node_point_code;
			        		  cdata.push(data);
			        	  }
			        	  arry['detailList']=cdata;
			        	  mdata.push(arry);
			        	  var jsonStr = JSON.stringify(mdata);
                  window.parent.svgRecalculate(jsonStr, (res) => {
                    var val = res.data;
                     $('g[id="'+id+'"]').find('text[update_data="data"]').html(val.toFixed(2));
                  });
			           } };

	           if(-1 !=node_type_str && undefined != d.children){
	              items_arr.push(repeat_calc_obj);
			      items_arr.push(null);
	            }
	             var cancel_obj = {label:'取消', icon:'cancel-data.png',action:function(a,b) { $(".contextMenuPlugin").remove();$(".context_menu").remove(); } };

	             items_arr.push(cancel_obj);
	            console.log('obj',obj);
	          $(obj).contextPopup({
			        title: '节点操作',
			        items: items_arr /*[
			          {label:'修改公式',     icon:'modify-data.png',action:function(a,b) {
		          		if("-1"!=node_type_str && null != node_id_str && ""!= node_id_str && null!=point_code_str){
		          				if(null == parent.openMainInTab)alert("不可修改!");
		          				else
		          				parent.openMainInTab(node_id_str,"计算点修改","/DMS/forms/IndicatorItem_Id/IM_XN_EXPRESS_LIST/im_xn_express_add.htm?_viewId=IM_XN_EXPRESS_VIEW&_menuId=22288fe5-56dc-461f-9b72-2f4f83ed69b9&objName=IM_XN_EXPRESS_LIST&_useType=modify&_pk=ID&_pkValue="+node_id_str);
		            		}else{
		            		  alert("该节点不可修改！");
		            		}
		            		return false;
		            		$(".contextMenuPlugin").remove();$(".context_menu").remove();
			          } },
			           null, // divider
			          {label:'修改数据',icon:'modify-data.png',action:function() {

			          		var express_name = express_name_str;//测点名称
			          		var collect_data = calc_value_str; //采集数据
			          		var edit_data = "";//编辑数据
			          		var express_unit = point_unit_str;//单位

			          		Dialog({
							    title: "修改数据",
							    content: "<center><table style='width:80%;font-size:16px;margin-left:60px;' cellspacing='10'><tr><td>测点名称：</td><td><span style='color:#9B9B90;'>"+express_name+"</span></td></tr><tr><td>采集数据：</td><td><span style='color:#9B9B90;'>"+collect_data+"</span></td></tr><tr><td>编辑数据：</td><td><input id='edit_data_id' style='border-left:0px;border-top:0px;border-right:0px;height:40px;width:100px;border-bottom:1px solid #9B9B90;font-size:16px;' /></td><tr><td>单位：</td><td><span style='color:#C1C1B2;'>"+express_unit+"</span></td></tr></table></center>",
							    ok: {
							        waiting: true,
							        waitingText: "正在保存",
							        callback: function () {
							        	var data=$("#edit_data_id").val();
							        	var val=data;
								    	$(obj).find('text[update_data=data]').html(val);
							            window.setTimeout(function () {
							                Dialog.close();
							                $(".contextMenuPlugin").remove();$(".context_menu").remove();
							            }, 100)
							        }
							    },afterOpen: function () {
							       $("#edit_data_id").val(edit_data);
							    },
							    afterClose: function () {

							    }
							});

			          } },
			           null, // divider
			          {label:'重算', icon:'modify-data.png',action:function(a,b) {

			        	  var cArry = d.children;
			        	  var len = cArry.length;
			        	  var cdata = [];
			        	  var id = d.node_id;

			        	  var point = d.point_code;
			        	  var mval = $('g[id="'+cid+'"]').find('text[update_data="data"]').html();
			        	  var mdata = [];
			        	  var arry = {};
			        	  arry['expressId'] = id;
			        	  arry['value'] = mval;
			        	  arry['point_code'] = point;
			        	  for(var i = 0;i < len;i++){
			        		  var cid = cArry[i].node_id;

			        		  var node_point_code = cArry[i].point_code;
			        		  var data = {};
			        		  var val = $('g[id="'+cid+'"]').find('text[update_data="data"]').html();
			        		  data['expressId'] = cid;
			        		  data['value'] = val;
			        		  data['point_code'] = node_point_code;
			        		  cdata.push(data);
			        	  }
			        	  arry['dList']=cdata;
			        	  mdata.push(arry);
			        	  var jsonStr = JSON.stringify(mdata);
			        	  $.ajax({
			        		  url:'../../../XnExpressControl/calData.cpeam',
			        		  type:'POST',
			        		  async:true,
			        		  beforeSend:function(){
				        	    $(".contextMenuPlugin").remove();$(".context_menu").remove();
				        	    $.blockUI({ message: '<h5><img  style="width:16px;heigth:16px;vertical-align:middle;" src="/DMS/theme/FixCS-cpeam/images/wait.gif" />&nbsp;&nbsp;正在重算，请稍候 . . .</h5>'});
			        		  },
			        		  complete:function(){
			        		    $.unblockUI();
			        		  },
			        		  data:{'json':jsonStr},
			        		  success:function(resp){
			        			//  console.log(resp);
			        			  var val=resp.data;
			        			  //alert(val);
			        			  //alert(id+"_"+val);
			        			  $('g[id="'+id+'"]').find('text[update_data="data"]').html(val.toFixed(2));
			        		  }
			        	  })
			           } },
			          null, // divider
			          {label:'取消', icon:'cancel-data.png',action:function(a,b) { $(".contextMenuPlugin").remove();$(".context_menu").remove(); } }
			        //  {label:'Cheese',icon:'icons/bin-metal.png',                   action:function() { alert('clicked 5') } },
			        //  {label:'Bacon',icon:'icons/magnifier-zoom-actual-equal.png', action:function() { alert('clicked 6') } },
			        //  null, // divider
			        //  {label:'Onwards',icon:'icons/application-table.png',           action:function() { alert('clicked 7') } },
			        //  {label:'Flutters',icon:'icons/cassette.png',                    action:function() { alert('clicked 8') } }
			        ]*/
			      });
			    // return false;
	       }

	       node.on("mousedown",function(d){
	        	$(".tooltip").hide();
	            $(".contextMenuPlugin").remove();
	            console.log('data=========')
	            console.log(d);
	            console.log('*****************');
			    initContextMenu(this,d);
	       });

           //提示框
          node.on("mousemove",function(d) {
            if($(".contextMenuPlugin").length !=0) return;
          	var page_x = d3.event.pageX;
          	var page_y = d3.event.pageY;
          	//console.info("page_x:"+page_x+",page_y"+page_y);
          	var client_width = $(window).width();
          	var client_height = $(window).height();
          	var cur_calc_value = gobal_point_data[d.point_code]||d.calc_value;
          	tooltip.html("<div class='arrow'><h3 class='popover-title'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;节点明细</h3><div class='popover-content'><span class=tip>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;表达式名称：</span>"+nvl(d.name)+"<br/><span class=tip>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;测点编码：</span>"+nvl(d.point_code)+"<br/><span class=tip>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当前值：</span>"+nvl(cur_calc_value)+"<br/><span class=tip>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp测点单位：</span>"+nvl(d.express_unit)+"<br/><span class=tip>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;计算公式：</span>"+nvl(d.express_value)+"<br/><span class=tip>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;公式描述：</span>"+nvl(d.express_desc)+"</div></div>");
          	//var outerWidth = $("body div").last().outerWidth();
          	//var outerHeight = $("body div").last().outerHeight();
          	var outerWidth = $(tooltip[0]).outerWidth();
          	var outerHeight = $(tooltip[0]).outerHeight();

          	var p = page_y + 8, n = page_x + 8;
			if (p > client_height + $(document).scrollTop() - outerHeight) {
				p = page_y - outerHeight - 8;
			}
			if (n > client_width + $(document).scrollLeft() - outerWidth) {
				n = page_x - 8 - outerWidth;
			}
          	 tooltip.style("left",(n) +"px")
	               .style("top",(p)+"px")
	               .style("display","block");
	       }).on("mouseout",function (d) {
	          	$(".tooltip").hide();
	       });

          nodeEnter.append("svg:rect")
            .attr("x", function(d) {
            //  return(d.node_type == '0') ? -(rootRectWidth / 2) : 95;
              return(d.node_type == '0') ? 135 : 85;
            })
            .attr("y", function(d) {
            //  return(d.node_type == '0') ? -20 : -16;
              return(d.node_type == '0') ? -30: -30;
            })
            .attr("width", function(d) {
              //return(d.node_type == '0') ? rootRectWidth : 160;
              return 160;
            })
            .attr("height", 60)
            .attr("rx", 10)
            .style("stroke", function(d) {
              if(d.node_type == '-1') return "red";
              else return "#CCC";
            })
            .style("fill", function(d) {
              return(d.node_type == '0') ? "#33C9FF" :  "#FFF";//节点背景色
            });

          nodeEnter.append('circle')
            .attr('r', 1e-6);
          nodeEnter.append("text")
            .attr("class", "linkname")
			.attr("x",function(d) {
              return(d.node_type == '0') ? '215' : '168';
            })
            .attr('dy', function(d) {
             // return(d.node_type == '0') ? '.05em' : '-3';
              return(d.node_type == '0') ? '-0.7em' : '-10';
            })
			.attr("text-anchor",'middle')
            .attr('fill', '#337ab7')
            .text(function(d) {
              if(null == d.name || '' == d.name) return '无描述';
              if(d.node_type == '0') {
               return(d.name.length >10) ? d.name.substr(0, 10) : d.name;
              }
              return(d.name.length > 11) ? d.name.substr(0, 11) : d.name;
            })
            .style({
              'fill-opacity': 1e-6,
              'fill': function(d) {
                if(d.node_type == '0') {
                  return '#fff';
                }
              },
              'font-size': function(d) {
                return(d.node_type == '0') ? "15px" : "14px";
              },
              'cursor': "pointer"
            })
            .on('click', Change_modal);

            //修改数据
          nodeEnter.append("text")
            .attr("class", "linkname")
			.attr("x",function(d) {
              return(d.node_type == '0') ? '220' : '170';
            })
            .attr("dy", function(d) {
              return(d.node_type == '0') ? '8' :'9';
            })
			.attr("text-anchor",'middle')
            .text(function(d) {
              return d.calc_value;
            }).attr({
			    startOffset: '40%',
			    'text-anchor':'middle',
			    'dominant-baseline':'middle'
			}).attr('update_data',function(d){
				return 'data';
			})
            .style({
              'fill': '#337ab7',
              'font-size': function(d) {
                return(d.node_type == '0') ? "13px" : "12px";
              },
              'cursor': "pointer"
            });
            nodeEnter.append("line").attr("x1",function(d){
              return(d.node_type == '0') ? '170' : '125';
            }).attr("y1",function(d){
               return(d.node_type == '0') ? '14' : '15';
            }).attr("x2",function(d){
           	   return(d.node_type == '0') ? '270' : '220';
            }).attr("y2",function(d){
               return(d.node_type == '0') ? '14' : '15';
            }).attr("stroke",function(d){
              return(d.node_type == '0') ? 'red' :  "#DEDEDE";
            }).attr("stroke-width", "1px").attr("stroke-dasharray","2,2");
            nodeEnter.append("text")
		    .attr("x",function(d) {
              return(d.node_type == '0') ? '220' : '170';
            })
            .attr("dy", function(d) {
              return(d.node_type == '0') ? '24' :  '25';
            })
            .attr("text-anchor",'middle')
            .attr("class", "linkname")
            .style("fill", "#7F7F7F")
            .style('font-size', "12px")
            .text(function(d) {
              return ""+ d.calc_value+" "+nvl(d.express_unit);//节点值
            }).attr("update_point",function(d){
              return "point";
            }).attr("point_code",function(d){
              return d.point_code;
            }).attr("point_unit",function(d){
              return d.express_unit;
            });

            /*
          nodeEnter.append("text")
            .attr("x", "30")
            .attr("dy", function(d) {
              //return(d.node_type == '0') ? '.35em' :'-5';
              return '-5';
            })
            .attr("text-anchor", "start")
            .attr("class", "linkname")
            .style("fill", "green")
            .style('font-size', "10px")
            .text(function(d) {
              return(d.node_type == '0') ? "" : d.ratio;
            });

			nodeEnter.append("text")
			.attr("x", '35')
			.attr("dy", function(d) {
			 // return(d.node_type == '0') ? '.35em' :'15';
			  return '15';
			})
			.attr("text-anchor", "start")
			.attr("class", "linkname")
			.style("fill", "#0ba4ec")
			.style('font-size', "10px")
			.text(function(d) {
			 // return (d.node_type == '0')?"":d.point_code;
			  return '';
			});	*/

          // Transition nodes to their new position.原有节点更新到新位置
          var nodeUpdate = node.transition()
            .duration(duration)
            .attr('transform', function(d) {
              return 'translate(' + d.y + ',' + d.x + ')';
            });
          nodeUpdate.select('circle')
            .attr('r', function(d) {
              return(d.node_type == '0') ? 0 : (hasChildNodeArr.indexOf(d) == -1) ? 0 : 7;
            })
            .attr('cx', function(d) {
              return  252;
            })
            .style('fill', function(d) {
              return hasChildNodeArr.indexOf(d) != -1 ? "#fff" : "";
            })
            .style('stroke', function(d) {
              return hasChildNodeArr.indexOf(d) != -1 ? "#8b4513" : "";
            })
            .style('fill-opacity', function(d) {
              if(d.children) {
                return 0.35;
              }
            });

          //代表是否展开的+-号
          nodeEnter.append("svg:text")
            .attr("class", "isExpand")
            .attr("x", "252")
            .attr("dy", function(d) {
              if(ie_flag) return 5;
              return 1;
             // return 0;
            })
            .attr("text-anchor", "middle")
            .style("fill", "#000")
            .text(function(d) {
              if(d.node_type == '0') {
                return '';
              }
              return hasChildNodeArr.indexOf(d) != -1 ? "+" : "";
              /* if (d._children || d.children) {
                return "+";
              } */
            })
            .on('click',click);

           // $(".isExpand").css("z-index",200);
           // $("circle").css("z-index",300);

          nodeUpdate.select('text').style('fill-opacity', 1);

          var nodeExit = node.exit().transition()
            .duration(duration)
            .attr('transform', function(d) {
              return 'translate(' + source.y + ',' + source.x + ')';
            }).remove();
          nodeExit.select('circle')
            .attr('r', 1e-6);
          nodeExit.select('text')
            .style('fill-opacity', 1e-6);
          var link = g.selectAll('path.' + link_class)
            .data(links, function(d) {
              return d.target.id;
            });

          link.enter().insert('path', 'g')
            .attr('class', link_class)
            .attr('stroke',function(d){
              return '#3095FA';
            })
            .attr('fill',"none")
            .attr('stroke-width','1px')
            .attr('opacity', 0.5)
            .attr('d', function(d) {
              var o = {
                x: source.x0,
                y: source.y0
              };
              return pathFunc({
                source: o,
                target: o
              });
            })
            .attr("marker-end", function(d) {
              return "url(#resolvedDown)";
            }) //根据箭头标记的id号标记箭头;
            .attr("id", function(d, i) {
              return "mypath" + i;
            });
          link.transition()
            .duration(duration)
            .attr('d', pathFunc);
          link.exit().transition()
            .duration(duration)
            .attr('d', function(d) {
              var o = {
                x: source.x,
                y: source.y
              };
              return pathFunc({
                source: o,
                target: o
              });
            })
            .remove();
          nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
          });

         function Change_modal () {
            _this.Modal = true
          }
          function click(d) {
            if(forUpward) {

            } else {
              if(d._children) {
                console.log('')
              } else {
                console.log('')
              }
            }
            isExpand = !isExpand;
            if(d.node_type == '0') {
              return;
            }
            if(d.children) {
              d._children = d.children;
              d.children = null;
              d3.select(this).text('+')
            } else {
              d.children = d._children;
              d._children = null;
              // expand all if it's the first node
              if(d.node_type == '0') {
                d.children.forEach(expand);
              }
              d3.select(this).text('-')
            }
            update(d, originalData, g);
          }
        }

        function expand(d) {
          if(d._children) {
            d.children = d._children;
            d.children.forEach(expand);
            d._children = null;
          }
        }

        function collapse(d) {
          if(d.children && d.children.length != 0) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
            hasChildNodeArr.push(d);
          }
        }

        function redraw() {
          treeG.attr('transform', 'translate(' + d3.event.translate + ')' +
            ' scale(' + d3.event.scale + ')');
        }

        function disableRightClick() {
          // stop zoom
         /* if(d3.event.button == 2) {
            console.log('No right click allowed');
            d3.event.stopImmediatePropagation();
          }*/
        }


        function sortByDate(a, b) {
          var aNum = a.name.substr(a.name.lastIndexOf('(') + 1, 4);
          var bNum = b.name.substr(b.name.lastIndexOf('(') + 1, 4);
          return d3.ascending(aNum, bNum) ||
            d3.ascending(a.name, b.name) ||
            d3.ascending(a.id, b.id);
        }
      };

      var d3GenerationChart = new treeChart(d3);
      d3GenerationChart.drawChart();
    };


    /**
     * 生成png
     */
    function downloadfun(){
      /* var canvas = $("#product_tree svg")[0];
		//调用方法转换即可，转换结果就是uri,
		svgAsPngUri(canvas, null, function(uri) {
		download($("#iframe_graph").contents().find("#express_title").html(),uri);
	    });*/

		var serializer = new XMLSerializer();
	    var svg1 = document.querySelector('svg');
	    var toExport = svg1.cloneNode(true);
	    var bb = svg1.getBBox();
	    toExport.setAttribute('viewBox', bb.x + ' ' + bb.y + ' ' + bb.width + ' ' + bb.height);
	    toExport.setAttribute('width', bb.width);
	    toExport.setAttribute('height', bb.height);
	    var source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(toExport);
	    var image = new Image;
	    image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
	    var canvas = document.createElement("canvas");
	    canvas.width = bb.width;
	    canvas.height = bb.height;
	    var context = canvas.getContext("2d");
	    context.fillStyle = '#fff';//#fff设置保存后的PNG 是白色的
	    context.fillRect(0, 0, 10000, 10000);
	    image.onload = function() {
	      context.drawImage(image, 0, 0);
	      var a = document.createElement("a");
        var timeStr = getNowTimeStr();
	      a.download = picName+"_"+timeStr+".png";
	      a.href = canvas.toDataURL("image/png");
	      a.click();
	    }
    }

function downloadfun_old() { //下载
        // 注释该方法为svg 直接下载
         /* var SvgSaver = require('svgsaver');                 // if using CommonJS environment
          var svgsaver = new SvgSaver();                      // creates a new instance
          var svg = document.querySelector('#product_tree');         // find the SVG element
          svgsaver.asSvg(svg);                                // save as SVG*/

        var g = document.getElementById('product_tree').getElementsByTagName('g')[0].getBBox();
        var gbox = document.getElementById('product_tree').getElementsByClassName('gbox')[0];
        var x = -g.x;//计算偏移位置
        var y = -g.y;
        gbox.style.transform = "translate(" + (x-10) + 'px' + "," + y + "px" + ")  scale(1)"; //偏移位置
        var svgbox = $('#product_tree svg')
        var boxwidth = svgbox.width;
        var boxheight = svgbox.height;
        svgbox.attr('width', g.width)
        svgbox.attr('height', g.height)
        var canvas = document.createElement("canvas");
        var c = canvas.getContext('2d');
        //新建Image对象
        //svg内容
        var svg = document.getElementById('product_tree').innerHTML;
        var img = new Image();

        img.src = 'data:image/svg+xml,' + unescape(encodeURIComponent(svg));//svg内容中可以有中文字符
        img.src = 'data:image/svg+xml,' + svg;//svg内容中不能有中文字符
        img.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svg)));
        //图片初始化完成后调用
         img.onload = function() {
          //将canvas的宽高设置为图像的宽高
          canvas.width = img.width;
          canvas.height = img.height+60;
          c.fillStyle = "#fff";
          c.fillRect(0, 0, canvas.width, canvas.height);
          c.drawImage(img, 0, 30);
          //canvas画图片

          var a = document.createElement("a");
          a.download = "png";
          a.href= canvas.toDataURL("image/png");
          $("#product_tree").css({"height":"100%","width":"100%"});
          a.click();
        }
        //图片转换为base64后 传给后端 发邮件
        //gbox.style.transform = ''
        //svgbox.attr('width',boxwidth);
        //svgbox.attr('height',boxheight);
        //svgbox.attr('width',"100%");
        //svgbox.attr('height',1000);
    // 结束
  }

function funLine(obj){  //折线
			var s = obj.source;
//			console.log('获取折线对象1：'+s.y);
			var sy = (s.node_type == '0' ? s.y+260 :s.y+260);
//			console.log('获取折线对象2：'+sy);
			var t = obj.target;
			var ty = (t.node_type == '0' ? t.y+40 :t.y+75);
			return "M"+sy+","+s.x+"L"+(sy+(ty-sy)/2)+","+s.x+"L"+(sy+(ty-sy)/2)+","+t.x+"L"+ty+","+t.x;
		}

		/**
 * @author char
 * @description 获取URL问号之后的参数
 * @param {String} url url地址
 * @return {Object} 通过参数名：值的方式集合的JSON对象
 */
function getURLParams(url) {
	var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
	var paraObj = {};
	for (var i = 0; j = paraString[i]; i++) {
		var paramVal = j.substring(j.indexOf("=") + 1, j.length);

		paraObj[j.substring(0, j.indexOf("="))] = decodeURIComponent(decodeURIComponent(paramVal));
	}
	return paraObj;
};

/**
 * 更新节点数据
 */
function update_point_data(time){
       var point_code_list_str = "";
       $("text[update_point=point]").each(function(index,obj){
          var point_code_str = $(obj).attr("point_code");
          if(null != point_code_str && "" !=point_code_str && "null" != point_code_str){
             point_code_list_str+=point_code_str+",";
            // $(obj).html(111+" "+point_unit_str);
          }
       });

        $.ajax({
			    type: 'POST',
			    async:true,
			    dataType: "json",
			    url: '/DMS/performanceCalcAction/fetchPointDataByTime.cpeam',
			    data:{point_list_str:point_code_list_str,time_str:time},
			    beforeSend:function() {
			     	$.blockUI({ message: '<h5><img  style="width:16px;heigth:16px;vertical-align:middle;" src="/DMS/theme/FixCS-cpeam/images/wait.gif" />&nbsp;&nbsp;正在更新图形数据，请稍等 . . .</h5>' });
			    }, complete:function() {
			    	 $.unblockUI();
            	},success:function(data){
            	  if(!$.isEmptyObject(data)){
		            	$("text[update_point=point]").each(function(index,obj){
		          		  var point_code_str = $(obj).attr("point_code");
				          var point_unit_str = $(obj).attr("point_unit")||"";
				          gobal_point_data = data;
				          var value = data[point_code_str];
				          if("undefined" != typeof(value) && "null"!=value && ""!=value)
				           $(obj).html(data[point_code_str]+point_unit_str);
				       });
			       }

		 	  },error:function(){}
		  });


 }

/**
 * 值处理
 */
function nvl(str){
  if("undefined" == typeof(str) || null == str || undefined == str) return "";
  return str;
}

function getNowTimeStr(){
  var str = "";
  var nowDate = new Date();
  let yy = nowDate.getFullYear();
  let mm = nowDate.getMonth()+1<10 ? '0'+(nowDate.getMonth()+1) : nowDate.getMonth()+1;
  let dd = nowDate.getDate()<10 ? '0'+nowDate.getDate() : nowDate.getDate();
  let hh = nowDate.getHours()<10 ? '0'+nowDate.getHours() : nowDate.getHours();
  let mf = nowDate.getMinutes()<10 ? '0'+nowDate.getMinutes() : nowDate.getMinutes();
  let ss = nowDate.getSeconds()<10 ? '0'+nowDate.getSeconds() : nowDate.getSeconds();
  str = ""+yy+mm+dd+hh+mf+ss;
  return str;
}
