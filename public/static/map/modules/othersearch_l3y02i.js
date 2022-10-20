/* 百度地图API V2 模块
 * 此模块必须配套使用baidumap_offline_v2_20160822.js对
 * 获取模块的方法：
 * http://api0.map.bdimg.com/getmodules?v=2.0&mod=模块1,模块2
 * 模块名称就是文件名
 *  整理
 */
 _jsload2&&_jsload2('othersearch', 'x.extend(Ad.prototype,{Od:function(){for(var a=0,b=this.Oa.length;a<b;a++){var c=this.Oa[a];this[c.method].apply(this,c.arguments)}delete this.Oa},tm:function(a,b,c){c=c||"\\u5317\\u4eac\\u5e02";/^[ \\s]*$/.test(a)||$c.ab(function(a){if(a&&a.result&&35==a.result.type){var c=a.result,a=a.content,f=p,g=p;if(c&&0==c.error&&a)var c=a.cn,g=a.sc,i=a.wd,k=a.prc,l=a.fuzzy_score,m=a.catalog,f=new H(a.coord.x,a.coord.y),f=R.Eb(f),g={city:c,citycode:g,address:i,precise:k,confidence:l,level:m};b&&b(f,g)}},{qt:"gc", wd:a,cn:c})},Rs:function(a,b,c){if(!(a instanceof H)&&b)b(p);else{var a=R.xb(a),d=a.lng,a=a.lat,c=c||{};$c.ab(function(a){var c=p;if(a&&a.result&&44==a.result.type){var d=a.content,i={},k=[];if(0==a.result.error&&d){c=d.address_detail;a=c.city;c&&(i.streetNumber=c.street_number,i.street=c.street,i.district=c.district,i.city=a,i.province=c.province);var c=d.point,c=new H(c.x,c.y),c=R.Eb(c),l=d.surround_poi;if(l&&l.length)for(var m=0,n=l.length;m<n;m++){var u={},v=l[m];u.title=v.name;u.uid=v.uid;var w= new H(v.point.x,v.point.y),w=R.Eb(w);u.point=w;u.city=a;u.Ui=v.poiType;u.type=0;u.address=v.addr;u.postcode=v.zip||p;u.phoneNumber=v.tel||p;v=u.Ui;0!==v.length&&(u.eu=v.split(","));k.push(u)}c={point:c,address:d.address,addressComponents:i,surroundingPois:k,business:d.business}}}b&&b(c)},{qt:"rgc",x:d,y:a,dis_poi:c.poiRadius||100,poi_num:c.numPois||10})}}});S(Bd,{getPoint:Bd.tm,getLocation:Bd.Rs});function Ah(a){var b=document.createElement("script");b.onload=function(){b.parentNode.removeChild(b)};b.src=a;document.getElementsByTagName("head")[0].appendChild(b)} x.extend(Geolocation.prototype,{getCurrentPosition:function(a,b){function c(){!g&&!i&&(k&&(clearTimeout(k),k=p),b.apply(f,arguments),i=o)}function d(b){!g&&!i&&(k&&(clearTimeout(k),k=p),f.QW=b,a.apply(f,arguments),g=o,Pa(8E3,{longitude:b.longitude,latitude:b.latitude,accuracy:b.accuracy}))}function e(a){(new Bh({timeout:f.K.timeout,maximumAge:f.K.maximumAge})).getCurrentPosition(function(a){d(a)},function(){a()})}var f=this,g=q,i=q,k=setTimeout(function(){if(!g&&!i){var a=new Ch;a.errorCode=a.Yy; a.jf="\\u6574\\u4f53\\u5b9a\\u4f4d\\u8d85\\u65f6";c(a)}},f.K.timeout);(function(a){navigator.geolocation?(new Dh({timeout:5E3,maximumAge:f.K.maximumAge})).getCurrentPosition(function(a){d(a)},function(){a()}):a()})(function(){e(function(){var a=new Ch;a.jf="\\u6240\\u6709\\u7684\\u5b9a\\u4f4d\\u90fd\\u4e0d\\u53ef\\u7528\\u6216\\u5931\\u8d25";a.errorCode=a.Ej;c(a)})})},um:function(){return this.QW?0:2}});Geolocation.prototype.getCurrentPosition=Geolocation.prototype.getCurrentPosition; Geolocation.prototype.getStatus=Geolocation.prototype.um; x.extend(function(a){a=a||{};this.K={domain:a.domain||".baidu.com",path:a.path||"/",sC:a.sC||"H_LOC_MI",eh:a.eh||18E5}}.prototype,{QZ:function(a){var b=this.K.sC,a=a.qO(),a=encodeURIComponent(a),c={path:this.path,domain:this.domain,eh:this.eh};if(RegExp(\'^[^\\\\x00-\\\\x20\\\\x7f\\\\(\\\\)<>@,;:\\\\\\\\\\\\"\\\\[\\\\]\\\\?=\\\\{\\\\}\\\\/\\\\u0080-\\\\uffff]+$\').test(b)){var c=c||{},d=c.eh;"number"==typeof c.eh&&(d=new Date,d.setTime(d.getTime()+c.eh));document.cookie=b+"="+a+(c.path?"; path="+c.path:"")+(d?"; expires="+d.toGMTString(): "")+(c.domain?"; domain="+c.domain:"")+(c.FZ?"; secure":"")}},cX:function(a,b){var c;var d=this.K.sC;RegExp(\'^[^\\\\x00-\\\\x20\\\\x7f\\\\(\\\\)<>@,;:\\\\\\\\\\\\"\\\\[\\\\]\\\\?=\\\\{\\\\}\\\\/\\\\u0080-\\\\uffff]+$\').test(d)&&(d=RegExp("(^| )"+d+"=([^;]*)(;|$)").exec(document.cookie))&&(c=d[2]||p);c=c||p;c="string"==typeof c?decodeURIComponent(c):p;c===p?(c=new Ch,c.jf="Cookie\\u4e2d\\u4e0d\\u5b58\\u5728\\u5730\\u7406\\u4f4d\\u7f6e\\u4fe1\\u606f",c.errorCode=c.Ej,b(c)):(d=new Eh,d.mN(c),a(d))}}); x.extend(function(){this.K={xM:"H_LOC_MI"}}.prototype,{cX:function(a,b){var c=localStorage.getItem(this.K.xM);if(c===p)c=new Ch,c.errorCode=c.Ej,c.jf="localStorage\\u4e2d\\u4e0d\\u5b58\\u5728\\u5730\\u7406\\u4f4d\\u7f6e\\u4fe1\\u606f",b(c);else{var d=new Eh;d.mN(c);a(d)}},QZ:function(a){a=a.qO();localStorage.setItem(this.K.xM,a)}}); x.extend(function(a){this.K={timeout:a.timeout||3E3,maximumAge:a.maximumAge||6E5}}.prototype,{getCurrentPosition:function(a,b){function c(){var c="_cbk"+Math.floor(1E5*Math.random());window[c]=function(c){if(0==c.error){var d=new Eh;d.accuracy=c.coords.accuracy;d.longitude=c.coords.longitude;d.latitude=c.coords.latitude;a(d)}else 1==c.error?(c=Ch(),c.errorCode=c.Ej,c.jf="\\u6ca1\\u6709\\u68c0\\u6d4b\\u5230\\u5b9a\\u4f4d\\u6a21\\u5757",b(c)):1==c.error&&(c=Ch(),c.errorCode=c.Ej,c.jf="\\u5b9a\\u4f4d\\u5931\\u8d25", b(c))};Ah("http://127.0.0.1:6259/geolocation?"+["timeout="+d.K.timeout,"callback="+c].join("&"))}var d=this;(function(a){var c="_cbk"+Math.floor(1E5*Math.random()),d=q,i=q;setTimeout(function(){i=o;if(!d){var a=new Ch;a.errorCode=a.Yy;a.jf="\\u8bf7\\u6c42APN\\u8d85\\u65f6";b(a)}},1200);window[c]=function(c){i||(c&&0==c.error?(d=o,a()):(c=Ch(),c.errorCode=c.Ej,c.jf="\\u8bf7\\u6c42APN\\u5931\\u8d25",b(c)))};Ah("http://127.0.0.1:6259/getapn?callback="+c)})(function(){c()})}}); function Dh(a){this.K={timeout:a.timeout||5E3,maximumAge:a.maximumAge||6E5}} x.extend(Dh.prototype,{getCurrentPosition:function(a,b){navigator.geolocation.getCurrentPosition(function(b){if(/BIDUBrowser/i.test(navigator.userAgent))(new Ad).Rs(new H(b.coords.longitude,b.coords.latitude),function(d){var f=new Eh;f.accuracy=1999<b.coords.accuracy?1999:b.coords.accuracy;f.longitude=b.coords.longitude;f.latitude=b.coords.latitude;f.point=new H(f.longitude,f.latitude);d.addressComponents&&(d.addressComponents.province&&(f.address.province=d.addressComponents.province),d.addressComponents.city&& (f.address.city=d.addressComponents.city),d.addressComponents.district&&(f.address.district=d.addressComponents.district),d.addressComponents.street&&(f.address.street=d.addressComponents.street),d.addressComponents.streetNumber&&(f.address.street_number=d.addressComponents.streetNumber));a(f)});else{var d="_cbk"+Math.floor(1E5*Math.random());window.baidu=window.baidu||{};window.baidu[d]=function(d){var f=R.prototype.wi({x:d.point.x,y:d.point.y}),g=new Eh;g.accuracy=1999<b.coords.accuracy?1999:b.coords.accuracy; g.longitude=f.lng;g.latitude=f.lat;g.point=new H(f.lng,f.lat);d.addr&&(d.addr.province&&(g.address.province=d.addr.province),d.addr.city&&(g.address.city=d.addr.city),d.addr.district&&(g.address.district=d.addr.district),d.addr.street&&(g.address.street=d.addr.street),d.addr.street_number&&(g.address.street_number=d.addr.street_number));a(g)};Ah(z.url.proto+z.url.domain.geolocControl+"/wloc?"+["x="+b.coords.longitude,"y="+b.coords.latitude,"r="+(1999<b.coords.accuracy?1999:b.coords.accuracy).toString(), "prod=mapapi&addr=province|city|district|street|street_number","fn="+d].join("&"))}},function(a){var d=new Ch;a.code===a.PERMISSION_DENIED&&(d.errorCode=d.jP,d.jf="\\u7528\\u6237\\u51b3\\u7edd\\u5b9a\\u4f4d\\u8bf7\\u6c42");a.code===a.POSITION_UNAVAILABLE&&(d.errorCode=d.Ej,d.jf="\\u5b9a\\u4f4d\\u4e0d\\u53ef\\u7528");a.code===a.TIMEOUT&&(d.errorCode=d.Yy,d.jf="\\u5b9a\\u4f4d\\u8d85\\u65f6");b(d)},{enableHighAccuracy:q,timeout:this.K.timeout,maximumAge:this.K.maximumAge})}}); function Bh(a){this.K={timeout:a.timeout||5E3}} x.extend(Bh.prototype,{getCurrentPosition:function(a,b){var c="_cbk"+Math.floor(1E5*Math.random());window[c]=function(c){if(c&&c.content&&c.content.point){var e=new Eh;e.longitude=c.content.point.x;e.latitude=c.content.point.y;e.point=new H(c.content.point.x,c.content.point.y);c.content.address_detail&&(c.content.address_detail.city&&(e.address.city=c.content.address_detail.city),c.content.address_detail.province&&(e.address.province=c.content.address_detail.province),c.content.address_detail.district&& (e.address.district=c.content.address_detail.district),c.content.address_detail.street&&(e.address.street=c.content.address_detail.street),c.content.address_detail.street_number&&(e.address.street_number=c.content.address_detail.street_number));a(e)}else c=Ch(),c.errorCode=c.Ej,c.jf="\\u8bf7\\u6c42IP\\u5730\\u7406\\u5b9a\\u4f4d\\u4fe1\\u606f\\u5931\\u8d25",b(c)};Ah(z.Hc+"location/ip?"+["qt=loc&coor=bd09ll&ak=hXBgmgWW56Xt7BrbUbqiEGi1","timeout="+this.K.timeout,"callback="+c].join("&"))},n2:s()}); function Eh(){this.point=this.timestamp=this.speed=this.longitude=this.latitude=this.heading=this.altitudeAccuracy=this.altitude=this.accuracy=p;this.address={city:"",city_code:0,district:"",province:"",street:"",street_number:""}} x.extend(Eh.prototype,{Z3:function(a){this.accuracy=a.accuracy;this.altitude=a.altitude;this.altitudeAccuracy=a.altitudeAccuracy;this.heading=a.heading;this.latitude=a.latitude;this.longitude=a.longitude;this.speed=a.speed;this.address=a.address;this.timestamp=a.timestamp;this.point=new H(a.longitude,a.latitude)},s2:function(){return{accuracy:this.accuracy,longitude:this.longitude,latitude:this.latitude,altitude:this.altitude,address:this.address,timestamp:this.timestamp}},qO:function(){return JSON.stringify({accuracy:this.accuracy, longitude:this.longitude,latitude:this.latitude,altitude:this.altitude,address:this.address,timestamp:this.timestamp})},mN:function(a){a=JSON.parse(a);this.accuracy=a.accuracy;this.longitude=a.longitude;this.latitude=a.latitude;this.altitude=a.altitude;this.address=a.address;this.timestamp=a.timestamp}});function Ch(){this.jf=j;this.jP=this.errorCode=1;this.Ej=2;this.Yy=3};x.extend(Ed.prototype,{Od:function(){for(var a=0,b=this.Oa.length;a<b;a++){var c=this.Oa[a];this[c.method].apply(this,c.arguments)}delete this.Oa},get:function(a){var b=this;$c.ab(function(c){if(c&&c.result&&2==c.result.type){var d=c.result,c=c.content;if(d&&0==d.error){var d=b.k.ka.map,e=c.level,f=c.cname,g=c.code,i=P.tb(c.geo,o).point,e=P.bx(e,d);d&&d.Cd(i,e)}a&&a({center:i,level:e,name:f,code:g})}},{qt:"dec"})}});x.extend(Fd.prototype,{Od:function(){for(var a=0,b=this.Oa.length;a<b;a++){var c=this.Oa[a];this[c.method].apply(this,c.arguments)}delete this.Oa},get:function(a,b){var c={boundaries:[]},d=this,e="119.590757,23.808251;119.268804,23.41408;119.422881,23.163397;119.758632,23.201668;119.726437,23.588002;119.70804,23.763808;119.645949,23.797671 121.642055,25.312114;121.752439,25.169879;121.945611,25.186621;121.991604,25.052618;122.055995,24.985561;121.872022,24.834547;121.88122,24.624496;121.899617,24.498294;121.798432,24.270807;121.697247,24.135805;121.642055,23.958396;121.504076,23.288798;121.439685,23.178281;121.310904,22.991042;121.255712,22.812068;121.053342,22.624316;120.933759,22.290847;121.016547,21.990891;120.86017,21.887901;120.648601,21.947988;120.584211,22.376429;120.289854,22.51325;120.11508,22.939931;120.013895,23.118734;119.9771,23.543483;120.372642,24.11892;120.694595,24.641313;121.126931,25.119638;121.559268,25.337197;121.623658,25.345557 120.38414,22.372151;120.423234,22.355038;120.372642,22.307967;120.347346,22.329365;120.351945,22.355038;120.356544,22.363595 121.506375,22.696888;121.552369,22.660607;121.517874,22.611506;121.469581,22.64353;121.464981,22.690486;121.492577,22.701155 121.589163,22.100236;121.600661,22.050934;121.623658,22.012338;121.637456,21.939406;121.596062,21.93726;121.550069,22.014483;121.499476,22.044502;121.501776,22.102379;121.54087,22.102379 122.08819,25.668005;122.110037,25.488627;121.911116,25.435387;122.027249,25.658625;122.057144,25.669047 123.686455,25.955273;123.730149,25.909524;123.58527,25.699264;123.454189,25.743012;123.557674,25.817972;123.594468,25.84711 124.589072,25.924082;124.60172,25.894964;124.564926,25.902244;124.567226,25.929282;124.571825,25.930321 115.973388,21.36321;116.152762,21.298566;116.152762,21.164878;116.148163,21.039704;116.056176,21.000836;115.863004,21.035386;115.835409,21.143304;115.830809,21.26839;115.844607,21.358902;115.922796,21.36321 118.474702,24.527161;118.4862,24.509276;118.491949,24.487706;118.498848,24.46771;118.501148,24.448764;118.501148,24.435079;118.492524,24.422972;118.481026,24.411916;118.467228,24.406125;118.443082,24.39928;118.41721,24.386643;118.378116,24.379797;118.314301,24.369264;118.28728,24.371898;118.247035,24.378217;118.230363,24.377164;118.202192,24.376111;118.182645,24.375584;118.167122,24.375584;118.159073,24.378744;118.156199,24.389802;118.160223,24.397174;118.167697,24.407178;118.17862,24.424024;118.194718,24.434026;118.210241,24.444027;118.232088,24.457185;118.254509,24.472972;118.275206,24.488232;118.289579,24.497702;118.316025,24.506646;118.35052,24.521375;118.368918,24.529791;118.386165,24.537154;118.405137,24.540836;118.425834,24.543465;118.449981,24.541888;118.460904,24.53768".split(" "); if("\\u53f0\\u6e7e\\u7701"===a||"\\u53f0\\u6e7e"===a){for(var f=0;6>f;f++)c.boundaries[f]=e[f];c.boundaries[6]=e[9];b&&b(c)}if("\\u9493\\u9c7c\\u5c9b"===a){for(f=0;1>f;f++)c.boundaries[f]=e[6];b&&b(c)}if("\\u8d64\\u5c3e\\u5c7f"===a){for(f=0;1>f;f++)c.boundaries[f]=e[7];b&&b(c)}$c.ab(function(f){f&&f.content&&f.content.uid?$c.ab(function(f){if(f&&f.content&&f.content.geo)if((-1<a.indexOf("\\u798f\\u5efa")||-1<a.indexOf("\\u6d59\\u6c5f"))&&3>=a.length)f=d.oT(f.content.geo),c.boundaries=f;else{var g=P.tb(f.content.geo, q);if(g.Fd&&g.Fd.length&&0<g.Fd.length)for(var l=g.Fd.length,f=0;f<l;f++){var m=g.Fd[f];if(m&&m.length&&0<m.length){for(var n=m.length-1,u=[],v=0;v<n;v+=2){var w=new H(m[v],m[v+1]),w=R.Eb(w);u.push(w.lng+", "+w.lat)}c.boundaries.push(u.join(";"))}}}g=c.boundaries.length;if("\\u4e2d\\u56fd"===a||"\\u5168\\u56fd"===a||"\\u4e2d\\u534e\\u4eba\\u6c11\\u5171\\u548c\\u56fd"===a)for(f=0;f<e.length-1;f++)c.boundaries[g+f]=e[f];b&&b(c)},{qt:"ext",num:1E3,l:10,uid:f.content.uid}):b&&b(c)},{qt:"s",wd:a})},oT:function(a){var b= [];if("string"!=typeof a)return b;for(var a=a.split("|")[2].split(";"),c=0;c<a.length-1;c++){for(var d=[],e=a[c].split(","),f=0;f<e.length;f+=2){var g=new H(e[f],e[f+1]),g=R.Eb(g);d.push(g.lng+", "+g.lat)}b.push(d.join(";"))}return b}});S(pf,{get:pf.get}); ');
