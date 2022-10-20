/* 百度地图API V2 模块
 * 此模块必须配套使用baidumap_offline_v2_20160822.js对
 * 获取模块的方法：
 * http://api0.map.bdimg.com/getmodules?v=2.0&mod=模块1,模块2
 * 模块名称就是文件名
 *  整理
 */
 _jsload2&&_jsload2('symbol', 'var $f={14:"m-0.00573,-10c-5.51975,0 -9.99427,4.47453 -9.99427,9.99428c0,5.51974 4.47452,9.99425 9.99427,9.99425c5.51972,0 9.99426,-4.47452 9.99426,-9.99425c0,-5.51975 -4.47453,-9.99428 -9.99426,-9.99428zm0,17.92491c-4.37412,0 -7.93132,-3.55788 -7.93132,-7.93063c0,-4.37345 3.5572,-7.93134 7.93132,-7.93134c4.37411,0 7.93062,3.55721 7.93062,7.93134c0,4.37412 -3.55789,7.93063 -7.93062,7.93063zm-0.00068,-15.4088c-0.38027,0 -0.68696,0.30807 -0.68696,0.68765l0,6.34078l-4.15752,1.81815c-0.34794,0.15266 -0.50611,0.55837 -0.35344,0.90632c0.11278,0.25787 0.36445,0.4119 0.6292,0.4119c0.09214,0 0.18635,-0.01857 0.27575,-0.05845l4.55635,-1.99279c0.00344,-0.00137 0.00619,-0.00275 0.00894,-0.00412l0.00275,-0.00138c0.01032,-0.00413 0.01581,-0.01376 0.02545,-0.01719c0.07151,-0.03576 0.13821,-0.07771 0.19185,-0.1341c0.02337,-0.02338 0.03644,-0.05364 0.05431,-0.08045c0.03301,-0.04401 0.06946,-0.08733 0.0894,-0.14028c0.0165,-0.04126 0.01787,-0.08596 0.02613,-0.12997c0.00894,-0.04469 0.02614,-0.08389 0.02614,-0.1286l0,-6.7905c0,-0.37889 -0.30807,-0.68697 -0.68833,-0.68697z", 13:"m-0.00706,-9.5c-5.24281,0 -9.49294,4.25065 -9.49294,9.49294c0,5.24331 4.25014,9.49294 9.49294,9.49294c5.24281,0 9.49294,-4.24964 9.49294,-9.49294c0,-5.2423 -4.25013,-9.49294 -9.49294,-9.49294zm3.08857,3.85997c0.61044,0 1.10279,0.96873 1.10279,2.16271s-0.49384,2.1647 -1.10279,2.1647c-0.60844,0 -1.10228,-0.96873 -1.10228,-2.16372s0.49434,-2.16369 1.10228,-2.16369zm-6.28628,0c0.60844,0 1.10228,0.96873 1.10228,2.16271s-0.49284,2.1647 -1.10228,2.1647s-1.10277,-0.96873 -1.10277,-2.16372s0.49383,-2.16369 1.10277,-2.16369zm3.21167,12.16493c-1.87667,0 -3.63373,-1.14814 -5.14663,-3.14239c1.56571,1.02156 3.27993,1.59064 5.07786,1.59064c1.90905,0 3.72343,-0.63985 5.36539,-1.78497c-1.54429,2.11685 -3.35767,3.33672 -5.29662,3.33672l-0.00001,0z", 12:"m9.27295,5.92958l-2.64443,-4.57961c-0.79727,-1.37992 -2.10131,-3.63983 -2.8986,-5.01973l-2.64441,-4.57858c-0.79782,-1.38093 -2.10186,-1.38093 -2.89913,0l-2.64335,4.57858c-0.79728,1.3799 -2.10188,3.63981 -2.89916,5.01973l-2.64387,4.57961c-0.79728,1.38101 -0.14472,2.50988 1.44983,2.50988l16.37221,0c1.59561,0 2.24711,-1.12887 1.45091,-2.50988l0,0zm-8.88166,0.70811l-1.56837,0l0,-1.50484l1.56837,0l0,1.50484zm-0.07527,-2.61447l-1.41621,0l-0.14044,-6.44231l1.68427,0l-0.12761,6.44231l0,0z",11:"m8.08295,-6.56414l-3.59319,0l0,-1.43586l-8.98155,0l0,1.43586l-3.59321,0c-1.0569,0 -1.915,0.85509 -1.915,1.91159l0,9.92258c0,1.05357 0.8581,1.91158 1.915,1.91158l16.16796,0c1.05692,0 1.91501,-0.85801 1.91501,-1.91158l0,-9.92258c0,-1.0565 -0.85809,-1.91159 -1.91501,-1.91159l0,0zm-8.08397,12.66884c-3.20143,0 -5.80643,-2.60031 -5.80643,-5.79596c0,-3.19569 2.605,-5.79891 5.80643,-5.79891s5.80789,2.60322 5.80789,5.79891c0,3.19565 -2.60794,5.79596 -5.80789,5.79596zm0,-9.6804c-2.15036,0 -3.89142,1.7394 -3.89142,3.88444c0,2.14503 1.74252,3.8844 3.89142,3.8844c2.1489,0 3.89141,-1.73937 3.89141,-3.8844c0,-2.14503 -1.74105,-3.88444 -3.89141,-3.88444z", 10:"m0,-10c-0.20885,0 -0.39491,0.08583 -0.55177,0.24149c-0.15674,0.15536 -0.28646,0.37838 -0.39429,0.65665c-0.21586,0.55655 -0.34853,1.33844 -0.42114,2.27477c-0.07231,0.93446 -0.08474,2.02273 -0.05447,3.18765c-2.58175,1.05925 -7.81787,3.24648 -8.23854,3.73474c-0.56001,0.65029 -0.37908,1.3954 -0.15331,1.89002l8.608,-1.75235c0.18202,2.28374 0.4407,4.5455 0.66615,6.31771c-0.8418,0.24646 -2.41323,0.73303 -2.73754,1.03474c-0.4469,0.41562 -0.4469,1.75793 -0.4469,1.75793l3.52318,-0.28665c0.08286,0.57874 0.13486,0.9163 0.13486,0.9163l0.00511,0.03042l0.02778,0l0.06486,0l0.02778,0l0.00511,-0.03042c0,0 0.05185,-0.33756 0.13486,-0.9163l3.52424,0.28665c0,0 0,-1.34231 -0.44688,-1.75793c-0.32446,-0.30172 -1.89697,-0.7895 -2.73847,-1.0358c0.22484,-1.76681 0.4832,-4.02001 0.66507,-6.29634l8.50712,1.73203c0.22561,-0.49462 0.40765,-1.23973 -0.15237,-1.89002c-0.41538,-0.48221 -5.52504,-2.62071 -8.1386,-3.69423c0.03119,-1.17999 0.01971,-2.28285 -0.05353,-3.22816l0,-0.00233c-0.07263,-0.93523 -0.20545,-1.71635 -0.42114,-2.27244c-0.10784,-0.27827 -0.23634,-0.50114 -0.3932,-0.65665c-0.15689,-0.15567 -0.34293,-0.24149 -0.55195,-0.24149l0,0l0,0l0,0l0.00001,0l0,0l-0.00003,0.00001z", 3:"m-10,0l10,-10l10,10l-10,10l-10,-10z",5:"M0,0 L-5,-15 0,-10 5,-15 z",6:"M0,0 L5,15 0,10 -5,15z",7:"M-5,-15 L0,0 5,-15",8:"M-5,15 L0,0 5,15",9:"m0,-24c-4.4183,0 -8,3.58167 -8,8c0,1.42102 0.3816,2.75 1.0312,3.90601c0.1079,0.19202 0.221,0.38098 0.3438,0.56299l6.625,11.53101l6.625,-11.53101c0.102,-0.151 0.19,-0.31097 0.281,-0.46899l0.063,-0.09399c0.649,-1.15601 1.031,-2.48499 1.031,-3.90601c0,-4.41833 -3.582,-8 -8,-8zm0,4c2.209,0 4,1.79089 4,4c0,2.20898 -1.791,4 -4,4c-2.2091,0 -4,-1.79102 -4,-4c0,-2.20911 1.7909,-4 4,-4z"}; x.extend(oc.prototype,{Jn:function(){var a=this.jB;$f[a]&&(a=$f[a]);switch(a){case 1:var b=a=this.Nu(2),c=this.style.scale,d=this.Ji;this.size=new L(a,b);this.anchor=new L(a/2+d.width*c,b/2+d.height*c);this.path=1;break;case 2:var a=this.Nu(4),b=this.Nu(2),d=this.Ji,e=this.style.mc?this.style.mc:this.style.scale,c=this.style.scale;this.size=new L(a,b);this.or=new L(Math.floor(-e/2),Math.floor(-e/2));this.anchor=new L(a/2+d.width*c,b/2+d.height*c);this.path=2;break;case 4:b=a=this.Nu(20);d=this.Ji; c=this.style.scale;this.size=new L(a,b);this.anchor=new L(a/2+d.width*c,b/2+d.height*c);this.path=4;break;default:var a=new z.aP(a),f=a.gb(),b=this.style.rotation*Math.PI/180,e=this.style.mc?this.style.mc:this.style.scale,c=this.style.scale,d=this.Ji,g=new L(Math.floor(f.Bj*c-e/2),Math.floor(f.Cj*c-e/2)),c={rO:new Q(Math.floor(f.Bj*c-e/2)-c*d.width,Math.floor(f.Cj*c-e/2)-c*d.height),o1:new Q(Math.floor(f.Bj*c-e/2)-c*d.width,Math.ceil(f.An*c-e/2)-c*d.height),m4:new Q(Math.ceil(f.zn*c+e/2)-c*d.width, Math.floor(f.Cj*c-e/2)-c*d.height),p1:new Q(Math.ceil(f.zn*c+e/2)-c*d.width,Math.ceil(f.An*c+e/2)-c*d.height)},d={},e=[],f=[],i;for(i in c){var k=Math.cos(b)*c[i].x-Math.sin(b)*c[i].y,l=Math.sin(b)*c[i].x+Math.cos(b)*c[i].y;d[i]=new Q(k,l);e.push(k);f.push(l)}xmax=Math.max.apply(Math,e);ymax=Math.max.apply(Math,f);xmin=Math.min.apply(Math,e);ymin=Math.min.apply(Math,f);this.size=new L(Math.ceil(xmax-xmin),Math.ceil(ymax-ymin));this.anchor=new L(-xmin,-ymin);this.or=new L(xmin-d.rO.x,ymin-d.rO.y); this.zA=new Q(g.width,g.height);this.OI=b;this.path=a}},Nu:function(a){return this.style.mc?a*this.style.scale+this.style.mc%3+this.style.mc:a*this.style.scale+this.style.scale+this.style.scale%2},wb:function(a){var b=this.style.scale;size=this.size;this.Zq=a;a.getContext&&a.getContext("2d")?(a=this.Ih=a.getContext("2d"),a.fillStyle=x.as.rC(this.style.fillColor,this.style.qg),a.strokeStyle=x.as.rC(this.style.strokeColor,this.style.sd)):(a=new z.CP(a),a.fillStyle={color:x.as.NJ(this.style.fillColor), alpha:this.style.qg},a.strokeStyle={color:x.as.NJ(this.style.strokeColor),alpha:this.style.sd});a.lineCap="round";a.lineJoin="round";a.lineWidth=this.style.mc||b;this.or&&a.translate(-this.or.width,-this.or.height);this.OI&&a.rotate(this.OI);this.zA&&a.translate(-this.zA.x,-this.zA.y);switch(this.path){case 1:a.arc(size.width/2,size.height/2,b,0,2*Math.PI);break;case 2:a.rect(0,0,4*b,2*b);break;case 4:a.beginPath();for(var c=size.width/2,b=10*b,d=2*Math.PI/10,e=11;0!=e;e--){var f=b*(e%2+1)/2,g=d* e;a.lineTo(f*Math.sin(g)+c,f*Math.cos(g)+c)}a.closePath();break;default:a.lineWidth/=b,a.scale(b,b),this.path.hi(a)}a.fill();a.stroke()},setPath:function(a){this.jB=a;this.Jn()},setAnchor:function(a){this.Ji=this.style.anchor=a;this.Jn()},setRotation:function(a){this.style.rotation=a;this.Jn()},setScale:function(a){this.style.scale=a;this.Jn()},setStrokeWeight:function(a){this.style.mc=a;this.Jn()}}); ');
