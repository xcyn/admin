/* 百度地图API V2 模块
 * 此模块必须配套使用baidumap_offline_v2_20160822.js对
 * 获取模块的方法：
 * http://api0.map.bdimg.com/getmodules?v=2.0&mod=模块1,模块2
 * 模块名称就是文件名
 *  整理
 */
 _jsload2&&_jsload2('oppc', 'var yg=256,zg=32;function Ag(){this.B=p}var Bg;z.Se(function(a){if(!a.K.Kx){var b=new Ag;zb(a.Ua,b.ua(a.K.Wb));b.B=a.Ua.lastChild;a.R.UO=b}}); Ag.prototype.ua=function(a){a=[\'<div id=zoomer style="position:absolute;z-index:0;top:0px;left:0px;overflow:hidden;visibility:hidden;cursor:\'+a+\'">\'];a.push(\'<div class="BMap_zoomer" style="top:0;left:0;"></div>\');a.push(\'<div class="BMap_zoomer" style="top:0;right:0;"></div>\');a.push(\'<div class="BMap_zoomer" style="bottom:0;left:0;"></div>\');a.push(\'<div class="BMap_zoomer" style="bottom:0;right:0;"></div>\');a.push("</div>");return a.join("")}; Ag.prototype.action=function(a,b){if(!Bg){var c=this.B;if(c){var d=4/3,e=Math.ceil((b?60:120)/2),f=Math.max(15,e/d),g=c.style;g.width=2*e+"px";g.height=2*f+"px";g.visibility="visible";c=c.children;b?(c[0].style.backgroundPosition="0 0",c[1].style.backgroundPosition="-7px 0",c[2].style.backgroundPosition="0 -7px",c[3].style.backgroundPosition="-7px -7px"):(c[0].style.backgroundPosition="-7px -7px",c[1].style.backgroundPosition="0 -7px",c[2].style.backgroundPosition="-7px 0",c[3].style.backgroundPosition= "0 0");var c=p,i=a.x-e,k=a.y-f;if(!isNaN(i)&&!isNaN(k)){g.left=i+"px";g.top=k+"px";var l=Math.ceil((b?120:60)/2),m=Math.max(15,l/d),l=l-e,m=Math.ceil(m-f),n=this.B.style;Bg&&Bg.end();Bg=new sb({Ic:20,duration:240,hc:tb.bD,Io:100,ua:function(a){if(!(a<0.1)){var b=Math.ceil(l*a),a=Math.ceil(m*a);n.width=(e+b)*2+"px";n.height=(f+a)*2+"px";n.left=i-b+"px";n.top=k-a+"px"}},finish:function(){Bg=q;setTimeout(function(){g.visibility="hidden"},300)}})}}}};z.Se(function(a){function b(a){if(f.K.Po){var b=new N("ondeepzoommousewheel");c(a,la(b,a));i.c0.call(i,b);Bb(a)}}function c(a,b){var c=a.srcElement||a.target,d=a.offsetX||a.layerX||0,e=a.offsetY||a.layerY||0,g=p,i=p;1!==c.nodeType&&(c=c.parentNode);for(;c&&c!==f.Ua;){c.ba&&(x.lang.Mc(c.ba)instanceof gb&&(g=x.lang.Mc(c.ba)),x.lang.Mc(c.ba)instanceof qc&&(i=x.lang.Mc(c.ba)));if(!(0===c.clientWidth&&0===c.clientHeight&&c.offsetParent&&"TD"===c.offsetParent.nodeName)&&"http://www.w3.org/2000/svg"!==c.namespaceURI)d+= c.offsetLeft||0,e+=c.offsetTop||0;else if("http://www.w3.org/2000/svg"===c.namespaceURI&&z.cq){var y=z.cq.Os(f).cf;if(-1<navigator.userAgent.indexOf("Opera")&&"svg"!==c.tagName){if(c=x.lang.Mc(c.ba))c=c.Gd(),d+=f.ac(c.re()).x,e+=f.ac(c.kf()).y;break}if(39<=x.ea.rg||51<=x.ea.eC)d=a.layerX||0,e=a.layerY||0;if(y&&!(window.ActiveXObject||"ActiveXObject"in window))d+=parseFloat(y.style.left)+f.offsetX,e+=parseFloat(y.style.top)+f.offsetY;if(y&&((window.ActiveXObject||"ActiveXObject"in window)&&"svg"=== c.nodeName.toLowerCase())&&!c.ba)d+=parseFloat(y.style.left)+f.offsetX,e+=parseFloat(y.style.top)+f.offsetY;if((9<=x.ea.la||-1<navigator.userAgent.toLowerCase().indexOf("trident"))&&"svg"!==c.nodeName.toLowerCase()){d+=f.offsetX;e+=f.offsetY;break}if(!x.ea.la)break}c=c.offsetParent}b.offsetX=d;b.offsetY=e;b.pixel=b.ib=new Q(d,e);b.point=b.point=f.ub(b.ib);b.overlay=b.$a=g;b.domEvent=a;b.zb=i;return b}function d(a){var b=f.R,d=!b.Wx&&!b.Xx;if(b.oy)clearTimeout(b.oy),b.oy=p,d&&(f.dispatchEvent(c(a, la(new N("onrightclick"),a))),f.Sa|=yg,f.dispatchEvent(c(a,la(new N("onrightdblclick"),a))),f.Sa^=yg);else{d&&f.dispatchEvent(c(a,la(new N("onrightclick"),a)));var e=c(a,la(new N("onrightclickex"),a));b.oy=setTimeout(function(){b.oy=p;d&&f.dispatchEvent(e)},f.K.kC)}}function e(a){if(f.K.Po){var b=f.R;b.lb&&(b.lb.stop(),b.lb=p,setTimeout(function(){f.dispatchEvent(new N("onmoveend"))},1));f.Sa|=zg;a=window.event||a;f.Cc=f.Ka;b=new N("onmousewheel");b.Up=0<=a.wheelDelta||0>a.detail;var d=new Date;b.Up=== o&&f.Ka===f.oa().qm()||b.Up===q&&f.Ka===f.oa().Xo()||220>d-g?f.Sa^=zg:(g=d,c(a,la(b,a)),f.dispatchEvent(b),f.Sa^=zg,a.returnValue=q);Bb(a)}}var f=a;f.rY=a.Ub();a.Ua.t3=ca(q);x.M(f.platform,"mousemove",function(a){0===f.Sa&&f.dispatchEvent(c(a,la(new N("onmousemove"),a)))});x.M(f.platform,"mousedown",function(a){if(f.K.iD){a=window.event||a;x.ea.la||Bb(a);var b=f.R;b.Jc=o;var d=a.srcElement||a.target;b.lb&&(b.lb.stop(),b.lb=p,f.dispatchEvent(new N("onmoveend")));b.iu=a.clientX||a.pageX||0;for(b.ju= a.clientY||a.pageY||0;d&&d!==f.Ua;){if(x.D.$s(d,"BMap_Marker")){b.Jc=q;var e=x.lang.Mc(d.ba);if(e instanceof T&&e.z.ff===o||e.z.Xb===o)return}d=d.parentNode}x.ea.la&&f.ue.setCapture&&f.ue.setCapture();f.dispatchEvent(c(a,la(new N("onmousedown"),a)));f.K.Xb&&(!(f.Sa&8)&&2!==a.button)&&(b.rp=b.iu,b.Ek=b.ju,b.jy=f.offsetX,b.m=f.offsetY,f.Sa|=8,f.platform.style.cursor=0===f.R.Ne.length?f.K.Ed:"pointer")}});x.M(document,"mousemove",function(a){var a=window.event||a,b=f.R,d=a.clientX||a.pageX||0,e=a.clientY|| a.pageY||0;if(b.iu||b.ju)b.Wx=d-b.iu,b.Xx=e-b.ju;var g=ab(),i=40<g-b.oM;if(!(18>g-b.mt)&&(i&&(b.oM=g),b.mt=g,f.Sa&8&&f.K.Xb)){var w=f.platform.style;w.cursor.replace(/"|\\s/g,"")!==f.K.Ed&&(w.cursor=f.K.Ed);b.Zj||(f.dispatchEvent(c(a,la(new N("ondragstart"),a))),f.dispatchEvent(new N("onmovestart")),b.SC=new Q(d,e),b.TC=g);0===b.rp&&(0===b.Ek&&f.R.Y2)&&(b.rp=d,b.Ek=e,b.jy=f.offsetX,b.m=f.offsetY);if(0!==d-b.rp||0!==e-b.Ek)f.R.Zj=o,f.dispatchEvent(c(a,la(new N("ondragging"),a))),f.He(b.jy+d-b.rp,b.m+ e-b.Ek,p,i)}});x.M(document,"mouseup",function(a){x.ea.la&&f.ue.releaseCapture&&f.ue.releaseCapture();var b=f.R;b.B3&&f.O1(o);var a=window.event||a,d=a.clientX||a.pageX,e=a.clientY||a.pageY;if(f.Sa&8&&f.K.Xb){f.Sa^=8;f.platform.style.cursor=0===b.Ne.length?f.K.Wb:"pointer";if(f.R.Zj){var g=c(a,la(new N("ondragend"),a));f.dispatchEvent(g);Cg(f,new Q(d,e))}b.Zj=q}b.Jc=q;2===a.button&&(b.iu=p,b.ju=p,b.Wx=0,b.Xx=0);f.dispatchEvent(c(a,la(new N("onmouseup"),a)))});4<=x.ea.rg?(x.M(f.Ua,"mouseup",function(a){2=== a.button&&d(a)}),x.M(f.Ua,"contextmenu",function(a){na(a)})):x.M(f.Ua,"contextmenu",function(a){d(a);na(a)});var g=new Date,i;a.K.QK&&(i=new Dg(a),a.B1=i);if(x.ea.la&&9>=x.ea.la||f.rY)i=p;x.M(f.Ua,"mousewheel",i?b:e);window.addEventListener&&f.Ua.addEventListener("DOMMouseScroll",i?b:e,q);x.M(f.platform,"click",function(a){var b=new N("onclick"),d=new N("onclickex"),e=f.R;c(a,la(b,a));c(a,la(d,a));if(!f.Sa){var g=!e.Wx&&!e.Xx;g&&f.dispatchEvent(b);if(!e.Oi)e.Oi=setTimeout(function(){e.Oi=p;g&&f.dispatchEvent(d)}, f.K.kC)}e.iu=p;e.ju=p;e.Wx=0;e.Xx=0});x.M(f.platform,"dblclick",function(a){if(!f.Sa){f.Sa=f.Sa|yg;x.ea.la&&f.dispatchEvent(c(a,la(new N("onclick"),a)));var b=f.R;if(b.Oi){clearTimeout(b.Oi);b.Oi=p}f.dispatchEvent(c(a,la(new N("ondblclick"),a)));f.Sa=f.Sa^yg}});x.M(document,"mousedown",function(b){var b=window.event||b,b=b.srcElement||b.target,c=f.R;c.bC=c.bC?x.D.contains(a.Ua,b):x.D.contains(a.platform,b)})}); function Cg(a,b){if(a.K.Yw){var c=a.R,d=ab();if(100<d-c.mt)a.dispatchEvent(new N("onmoveend")),c.Zj=q;else{var e=c.SC,f=[0<b.x-e.x?1:-1,0<b.y-e.y?1:-1],d=Eb(e,b)/((d-c.TC)/1E3)/2,g=d/1.8,i=0.4*g*d/1E3,k=Math.abs(e.x-b.x),l=0,m=0;0===Math.abs(e.y-b.y)?l=k:(e=Math.abs(e.x-b.x)/Math.abs(e.y-b.y),m=Math.round(Math.sqrt(i*i/(1+e*e))),l=Math.round(e*m));-1===f[0]&&(l=-l);-1===f[1]&&(m=-m);c.lb&&(c.lb.stop(),c.lb=p,a.dispatchEvent(new N("onmoveend")));var n=d/1E3,u=a.offsetX,v=a.offsetY,w=q;c.lb=new sb({duration:g, Ic:30,hc:function(a){a=a*n/1.8;return n*a-0.9*a*a},ua:function(b){b=b*3.6/(n*n);w=!w;a.He(u+Math.round(b*l),v+Math.round(b*m),p,w)},finish:function(){c.lb=p;a.He(u+Math.round(l),v+Math.round(m));a.dispatchEvent(new N("onmoveend"))},yt:function(b){c.lb=p;b=b*3.6/(n*n);a.He(u+Math.round(b*l),v+Math.round(b*m));setTimeout(function(){a.dispatchEvent(new N("onmoveend"))},1)}})}}else a.dispatchEvent(new N("onmoveend"))} function Dg(a){this.map=a;this.bb=a.bb;this.EV=Eg();this.Wp=0;this.XE=1;this.WE=this.ah=p;this.IE=1;this.JE=-1;this.oE=q;this.Zb=18;this.fc=3;this.XB()}var Fg=Dg.prototype;Fg.XB=function(){var a=this,b=a.map;a.Zb=b.K.Zb||18;a.fc=b.K.fc||3;b.addEventListener("onmaptypechange",function(){a.Zb=b.K.Zb||18;a.fc=b.K.fc||3})}; Fg.c0=function(a){var b=this,c=b.map,d=c.R;b.Zb=c.K.Zb||18;b.fc=c.K.fc||3;d.lb&&(d.lb.stop(),d.lb=p,c.dispatchEvent(new N("onmoveend")));b.Ry&&(b.Ry.stop(),b.Ry=p);var d=Math.ceil(a.domEvent.wheelDelta/120)||-a.domEvent.detail/3,e=0<d?1:-1,c=c.fa();0>e&&(b.IE=-1,d=0===d?-1:d);0<e&&(b.JE=1);var f=b.fc;if(!(c>=b.Zb&&0<e&&1===b.IE||c<=f&&0>e&&-1===b.JE)){b.Wp+=d;b.Wp=b.xY(b.Wp);var g=new Q(a.ib.x,a.ib.y);b.Dg&&clearTimeout(b.Dg);b.Dg=setTimeout(function(){b.l0(g,b.Wp,e)},10)}}; Fg.xY=function(a){var b=this.fc,c=this.Zb,d=this.map.fa(),a=Math.min(Math.max(a,-4),4);d+a>c?a=c-d:d+a<b&&(a=b-d);return a}; Fg.l0=function(a,b,c){var d=new L(0,0),e=this,f=e.map,g=e.bb,i=Math.pow(2,b),k=e.XE,l,m=f.width,n=f.height,u=(a.x-m/2)/m,v=(a.y-n/2)/n,w=g.Pb,y=w.style,C,A,B=e.EV;e.oE||(e.oE=o,f.dispatchEvent(new N("onzoomstart")));f.qd&&x.D.U(f.qd);g.vl.style.visibility="hidden";g.md&&(g.md.style.visibility="hidden");g.ao.style.visibility="hidden";if(!e.ah){y[B]||(y[B]="translate3d(0,0,0)");var D=e.WE;D&&(D.parentNode&&D.parentNode.removeChild(D),e.WE=p);e.WE=e.ah=w.cloneNode(o);f.platform.insertBefore(e.ah,f.platform.firstChild)}y.visibility= "hidden";var E=e.ah.style,w=f.K.Oo;0===d.width&&(0===d.height&&w)&&f.R.UO.action(a,0<c?o:q);e.Ry=new sb({Ic:60,duration:w?400:1,hc:tb.Cs,ua:function(a){if(b>0){l=k+a*(i-k);C=-m*(l-1)*u-d.width*a;A=-n*(l-1)*v-d.height*a}else{l=k-a*(k-i);C=m*(1-l)*u;A=n*(1-l)*v}E[B]="translate3d("+C+"px, "+A+"px, 0) scale("+l+")";e.XE=l},finish:function(){var c=f.fa(),c=Math.round(c+b);f.Cc=f.Ka;f.Ka=c;var c=g.gA(a),d=f.oa().Bc(f.fa());f.lc=new H(c.lng+(f.width/2-a.x)*d,c.lat-(f.height/2-a.y)*d);f.ef=f.we.qh(f.lc,f.Vb); y.visibility="";g.Tf();f.qd&&(x.ea.la&&x.ea.la<8||document.compatMode==="BackCompat"?x.D.show(f.qd):setTimeout(function(){x.D.show(f.qd)},100));g.vl.style.visibility="";g.ao.style.visibility="";f.dispatchEvent(new N("onzoomend"));e.Wp=0;e.XE=1;setTimeout(function(){e.yN()},100);e.yN();e.Ry=p;e.IE=1;e.JE=-1;e.oE=q}})};Fg.yN=function(){this.ah&&(Jc(this.ah),this.ah.parentNode&&(this.ah.parentNode.removeChild(this.ah),this.ah.innerHTML="",this.ah=p))}; function Eg(){var a="transform",b=document.createElement("div"),c=["Webkit","Moz","O","ms"],d=c.length,e="",b=b.style;a in b&&(e=a);for(a=a.replace(/^[a-z]/,function(a){return a.toUpperCase()});d--;){var f=c[d]+a;if(f in b){e=f;break}}return e};z.Se(function(a){x.M(document,"keydown",function(b){a.R.Ai==o&&(a.R.Ai=q);if(a.K.Zw&&a.R.bC)switch(b=window.event||b,b.keyCode||b.which){case 43:case 189:case 109:a.R.Jc=o;a.dispatchEvent(new N("onminuspress"));break;case 43:case 61:case 187:case 107:a.R.Jc=o;a.dispatchEvent(new N("onpluspress"));break;case 33:a.R.Jc=q;a.R.Ai=o;a.yg(0,Math.round(0.8*a.height));na(b);break;case 34:a.R.Jc=q;a.R.Ai=o;a.yg(0,-Math.round(0.8*a.height));na(b);break;case 35:a.R.Jc=q;a.R.Ai=o;a.yg(-Math.round(0.8*a.width), 0);na(b);break;case 36:a.R.Jc=q;a.R.Ai=o;a.yg(Math.round(0.8*a.width),0);na(b);break;case 37:a.R.Jc=o;a.R.kc|=1;a.cb();na(b);break;case 38:a.R.Jc=o;a.R.kc|=2;a.cb();na(b);break;case 39:a.R.Jc=o;a.R.kc|=4;a.cb();na(b);break;case 40:a.R.Jc=o,a.R.kc|=8,a.cb(),na(b)}});x.M(document,"keyup",function(b){if(a.K.Zw)switch(b=window.event||b,b.keyCode||b.which){case 37:a.R.kc&=-2;0!=a.R.kc&&a.cb();break;case 38:a.R.kc&=-3;0!=a.R.kc&&a.cb();break;case 39:a.R.kc&=-5;0!=a.R.kc&&a.cb();break;case 40:a.R.kc&=-9, 0!=a.R.kc&&a.cb()}a.R.Jc=q});Ka.prototype.cb=function(){if(!this.cb.Zx||!(this.cb.IA==this.R.kc&&this.R.Ai==o)){var a=this,c=a.R.kc;a.cb.IA=c;a.cb.Ix=30;a.cb.duration=999;a.cb.gf=a.cb.hf=0;c&1&&(a.cb.gf=1);c&2&&(a.cb.hf=1);c&4&&(a.cb.gf=-1);c&8&&(a.cb.hf=-1);c&1&&c&4&&(a.cb.gf=0);c&2&&c&8&&(a.cb.hf=0);if(!a.cb.Zx){a.cb.Zx=o;a.cb.time=ab();a.cb.cV=a.cb.time;a.dispatchEvent(new N("onmovestart"));var d=new sb({Ic:a.cb.Ix,duration:a.cb.duration,hc:tb.sM,ua:function(){var c=a.cb,f=a.R.kc;if(a.cb.IA!=f){a.cb.IA= f;if(f&1)c.gf=1;if(f&2)c.hf=1;if(f&4)c.gf=-1;if(f&8)c.hf=-1;if(f&1&&f&4)c.gf=0;if(f&2&&f&8)c.hf=0}if(a.R.Ai==o){c.gf=0;c.hf=0}var f=ab(),g=Math.pow((f-c.cV)/c.duration,2);if(!a.R.kc){c.Zx=q;d.FF=o;a.cb.time=ab();setTimeout(function(){a.dispatchEvent(new N("onmoveend"))},40)}var i=f-c.time,k=c.gf*i*g>=0?Math.ceil(c.gf*i*g):Math.floor(c.gf*i*g),g=c.hf*i*g>=0?Math.ceil(c.hf*i*g):Math.floor(c.hf*i*g);if(k!=0&&g!=0){k=Math.round(k*0.7);g=Math.round(g*0.7)}c.time=f;a.He(a.offsetX+k,a.offsetY+g)},finish:function(){a.cb.time= ab();setTimeout(function(){a.NG()},a.cb.Ix)}})}}};Ka.prototype.NG=function(){var a=this,c=a.cb;a.R.Ai&&(c.gf=0,c.hf=0);if(a.R.kc){var d=ab(),e=d-c.time,f=Math.ceil(c.gf*e),e=Math.ceil(c.hf*e);c.time=d;a.He(a.offsetX+f,a.offsetY+e);setTimeout(function(){a.NG()},c.Ix)}else c.Zx=q,a.dispatchEvent(new N("onmoveend"))}}); ');
