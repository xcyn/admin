
_jsload2&&_jsload2('newvectordrawlib', 'function zf(a){this.ZH=o;this.k=x.object.extend(a||{},{Xf:o});Ec.call(this,this.k);this.zg={};this.loaded=q;this.Bt=p;this.YB=q}zf.prototype=new Ec; zf.prototype.qa=function(a){if(!this.loaded){this.loaded=o;var b=this;b.map=a;b.bb=b.map.bb;b.map=a;this.Hb=this.map.oa();this.Ob=this.Hb.k.Ob;this.yc=this.map.K.devicePixelRatio;b.Tw=q;b.vK=p;b.Oe=b.k.style||"normal";b.ln=b.k.styleStr||p;b.bq=200;b.Dg=p;b.Yd=0;b.vb=this.bb.Mn(0);b.bb.md.appendChild(this.vb);b.bb.vb=b.vb;b.Ib=new z.NewVectorDrawLib(a);b.Ib.Ob=this.Hb.k.Ob;b.es="";b.Ib.nC=b.Oe;b.Yl();b.Oe&&"normal"!==b.Oe||b.ln&&0<b.ln.length?b.Kt(b.Oe,b.ln,function(){b.map.addEventListener("click", function(a){b.Yd++;if(1===b.Yd)b.Dg=setTimeout(function(){b.pu(a);b.Yd=0},b.bq);else return clearTimeout(b.Dg),b.Yd=0,q});b.vb.innerHTML="";b.Zd(o)}):(b.Zd(),b.map.addEventListener("click",function(a){b.Yd++;if(1===b.Yd)a.$a||(b.Dg=setTimeout(function(){b.pu(a);b.Yd=0},b.bq));else return clearTimeout(b.Dg),b.Yd=0,q}));b.map.K.nj&&(G()&&b.Df==j)&&(b.Df=new z.sG(b.map),b.map.Ia(b.Df))}}; x.extend(zf.prototype,{Yl:function(){var a=this;setTimeout(function(){a.map.addEventListener("moveend",function(b){"centerAndZoom"!=b.iH&&a.Zd()});a.map.addEventListener("zoomend",function(){a.Tw=q;a.Zd()});a.map.addEventListener("onresize",function(){a.Zd()});Ta()&&(a.map.addEventListener("onmoving",function(){a.Zd()}),a.map.addEventListener("onmaptypechange",function(){a.Zd()}));a.map.addEventListener("mousemove",function(b){a.map.Ub()&&a.FC(b)})},1);a.map.addEventListener("setcustomstyles",function(b){a.oC(b.target)})}, Kt:function(a,b,c){if(this.map.Ub()){var d=this,e=z.Hc+"custom/",f;b&&0<b.length?(f="setStyle_"+b.length,e+="mapstyle?styles="+encodeURIComponent(b)):(f="setStyle_"+a,e+="getstyle?customid="+a);f+=this.map.ba;window[f]=function(b,e){var k=x.extend({},d.Ib.nz);d.Ib.Db=x.extend(k,b);k=z.Bb.qe(d.Ib.Db["3181"][1]);d.map.K.zo=k;d.map.Na().style.backgroundColor=k;c(a);d.map.dispatchEvent(new N("onsetmapstylesuccess",e));delete window[f]};Qb(e+("&callback="+f+"&udt=20150526"),q)}},Ip:function(a){var b=this; b.Kt(a.style,a.styleStr,function(a){b.Oe=a;b.Ib.nC=b.Oe;var a=b.Ib.Js,d;for(d in a)delete a[d];b.$E()})},Zd:function(){this.map.fa();this.map.Ub()?(this.vb.style.display="block",this.Ib.As(this.xm())):(this.vb.style.display="none",this.vb.innerHTML="")},xm:function(){var a=this.map,b=this.Hb,c=a.fa(),d=a.lc,e=b.Bc(c),f=b.bE(c),b=a.ba.replace(/^TANGRAM_/,""),g=Math.ceil(d.lng/f);column=Math.ceil(d.lat/f);var i=this.Ob,k=[g,column,(d.lng-g*f)/f*i,(d.lat-column*f)/f*i],f=k[0]-Math.ceil((a.width/2-k[2])/ i),l=k[1]-Math.ceil((a.height/2-k[3])/i),m=k[0]+Math.ceil((a.width/2+k[2])/i),n=k[1]+Math.ceil((a.height/2+k[3])/i);for(this.Rc?this.Rc.length=0:this.Rc=[];f<m;f++)for(g=l;g<n;g++)this.Rc.push([f,g]);this.Rc.sort(function(a){return function(b,c){return 0.4*Math.abs(b[0]-a[0])+0.6*Math.abs(b[1]-a[1])-(0.4*Math.abs(c[0]-a[0])+0.6*Math.abs(c[1]-a[1]))}}([k[0]-1,k[1]-1]));d=[Math.round(-d.lng/e),Math.round(d.lat/e)];f=-a.offsetY+a.height/2;e=this.vb;e.style.left=-a.offsetX+a.width/2+"px";e.style.top= f+"px";this.Ke?this.Ke.length=0:this.Ke=[];f=0;for(a=e.childNodes.length;f<a;f++)g=e.childNodes[f],g.fr=q,this.Ke.push(g);if(f=this.Qm)for(var u in f)delete f[u];else this.Qm={};this.Le?this.Le.length=0:this.Le=[];f=0;for(a=this.Rc.length;f<a;f++){u=this.Rc[f][0];k=this.Rc[f][1];g=0;for(l=this.Ke.length;g<l;g++)if(m=this.Ke[g],m.id==b+"_"+u+"_"+k+"_"+c){m.fr=o;this.Qm[m.id]=m;break}}f=0;for(a=this.Ke.length;f<a;f++)m=this.Ke[f],m.fr||(m.Wd=p,delete m.Wd,this.Le.push(m));this.nn=[];g=i*this.yc;f=0; for(a=this.Rc.length;f<a;f++)u=this.Rc[f][0],k=this.Rc[f][1],l=u*i+d[0],m=(-1-k)*i+d[1],n=b+"_"+u+"_"+k+"_"+c,cvs=this.Qm[n],cvsStyle=p,cvs?(cvsStyle=cvs.style,cvsStyle.left=l+"px",cvsStyle.top=m+"px",cvs.Xe||(cvs.Wd=p,delete cvs.Wd,this.nn.push([u,k,cvs]))):(0<this.Le.length?(cvs=this.Le.shift(),cvs.getContext("2d").clearRect(0,0,g,g),cvsStyle=cvs.style):(cvs=document.createElement("canvas"),cvsStyle=cvs.style,cvsStyle.position="absolute",cvsStyle.background="#F5F3F0",cvsStyle.width=i+"px",cvsStyle.height= i+"px",this.Lx()&&(cvsStyle.WebkitTransform="scale(1.001)"),cvs.setAttribute("width",g),cvs.setAttribute("height",g),e.appendChild(cvs)),cvs.id=n,cvsStyle.left=l+"px",cvsStyle.top=m+"px",this.nn.push([u,k,cvs])),cvs.style.visibility="";f=0;for(a=this.Le.length;f<a;f++)this.Le[f].style.visibility="hidden";return this.nn},$E:function(){for(var a=this.vb,b=0,c=a.childNodes.length;b<c;b++)a.childNodes[b].Xe=q;this.Zd()},pu:function(a){this.map.K.nj&&(a=this.os(a),this.map.K.ww?this.map.K.ww(a):this.Mb(a))}, Mb:function(a){a?(Ta()&&this.Qz(a),G()&&this.Df&&this.Df.switchTo(a)):G()&&this.Df&&this.Df.U()},FC:function(a){this.map.K.nj&&(this.os(a)?(this.map.platform.style.cursor="pointer",this.map.R.Mx=o):(this.map.R.Mx=q,this.map.platform.style.cursor!=this.map.K.Wb&&0==this.map.R.Ne.length&&(this.map.platform.style.cursor=this.map.K.Wb)))},Qz:function(a){var b=a.uid;if(b){ua=$a.Fi.ok(2);ua.cu();var c=this;$c.ab(function(d){ua.xO();c.zz(b,d,a);ua.Oy();ua.Xm()},{qt:"inf",uid:b,operate:"mapclick",clicktype:"vector"})}}, zz:function(a,b,c){var d=this;if(b&&b.content){var e=b.content,f=e.pano||0,c=d.map.ub(c.point);if(!g)var g={};g.isFromMPC=o;var i=e.addr,g=e.street_id||"";if(1==e.poiType||3==e.poiType)i=P.unique(i.split(";")).join("; ");var k=e.tel;k&&(k=k.replace(/,/g,", "));d.Tq(e.cla);var l=K("div",{style:"font-size:12px;padding:5px 0;overflow:hidden;*zoom:1;"}),b=q;f&&(360>d.map.height?b=o:(f=[],f.push("<div class=\'panoInfoBox\' id=\'panoInfoBox\' title=\'"+e.name+"\\u5916\\u666f\' title=\'\\u67e5\\u770b\\u5168\\u666f\' >"), f.push("<img filter = \'pano_thumnail_img\' class=\'pano_thumnail_img\' width=323 height=101 border=\'0\' alt=\'"+e.name+"\\u5916\\u666f\' src=\'"+(z.url.proto+z.url.domain.pano[0]+"/pr/?qt=poiprv&uid="+g+"&width=323&height=101&quality=80&fovx=200")+"\' id=\'pano_"+a+"\'/>"),f.push("<div filter = \'panoInfoBoxTitleBg\' class=\'panoInfoBoxTitleBg\'></div><a href=\'javascript:void(0)\' filter=\'panoInfoBoxTitleContent\' class=\'panoInfoBoxTitleContent\' >\\u8fdb\\u5165\\u5168\\u666f&gt;&gt;</a>"),f.push("</div>"),l.innerHTML= f.join("")));i&&(f=K("p",{style:"padding:0;margin:0;line-height:18px;font-size:12px;color:#4d4d4d;"}),f.innerHTML="\\u5730\\u5740\\uff1a"+i,l.appendChild(f));k&&(f=K("p",{style:"padding:0;margin:0;line-height:18px;font-size:12px;color:#4d4d4d;"}),f.innerHTML="\\u7535\\u8bdd\\uff1a"+k,l.appendChild(f));e.tag&&(k=K("p",{style:"padding:0;margin:0;line-height:18px;font-size:12px;color:#4d4d4d;color:#7f7f7f;"}),k.innerHTML="\\u6807\\u7b7e\\uff1a"+e.tag,l.appendChild(k));a="http://api.map.baidu.com/place/detail?uid="+ a+"&output=html&source=jsapi&operate=mapclick&clicktype=vector";k="<div style=\'height:26px;\'><a href=\'"+a+"\' target=\'_blank\' style=\'font-size:14px;color:#4d4d4d;font-weight:bold;text-decoration:none;\' onmouseover=\'this.style.textDecoration=\\"underline\\";this.style.color=\\"#3d6dcc\\"\' onmouseout =\'this.style.textDecoration=\\"none\\";this.style.color=\\"#4d4d4d\\"\'>"+e.name+"</a>";a=new qc(l,{width:322,enableSearchTool:o,title:k+("<a href=\'"+a+"\' target=\'_blank\' style=\'font-size:12px;color:#3d6dcc;margin-left:5px;text-decoration:none;\' onmouseover=\'this.style.textDecoration=\\"underline\\"\' onmouseout =\'this.style.textDecoration=\\"none\\"\'>\\u8be6\\u60c5&raquo;</a>")+ "</div>",enableParano:b});b&&(a.street_id=g);a.addEventListener("open",function(){var a=x.$("panoInfoBox");if(a){var b=e.street_id||"";Ob(function(){Pa(5052);d.Bq(b)},a,"pano_thumnail_img|panoInfoBoxTitleBg|panoInfoBoxTitleContent")}});this.map.Mb(a,c)}},Bq:function(a){var b=z.tg("pano","scape/")[0],c=this,d=(new Date).getTime(),e="Pano"+d;z[e]=function(a){var b=c.map.rm(),a=a.content[0];b.rc(a.poiinfo.PID);b.show();b.Nc({heading:a.poiinfo.Dir,pitch:a.poiinfo.Pitch})};d=(new Date).getTime();Qb(b+ ("?qt=poi&udt=20131021&uid="+a+"&t="+d+"&fn=BMap."+e),q)},Tq:function(a){for(var b=[],c=0,d=a.length;c<d;c++)b.push(a[c][1]),c<d-1&&b.push(", ");return b.join("")},os:function(a){var b=this.vb.getElementsByTagName("canvas"),c=a.offsetX,d=a.offsetY,e=j,f=j;this.map.yb();for(var f=this.map.oa().k.Ob,g=0,i=b.length;g<i;g++){var k=this.Pf(b[g]);if(c>k.left&&c<=k.left+f&&d>k.top&&d<=k.top+f){e=b[g];break}}if(e==j||e.Wd==j)return q;f=e.Wd;b=0;for(i=f.length;b<i;b++){var c=f[b],d=c[0],g=c[1],l=this.Ib.Db[c[3]]|| window.Db[c[3]],m=l[0],l=this.Ib.Ss(l,this.Ib.Db[c[4]]||window.Db[c[4]])[1],n=c[5]||{};if(l==j||"empty"==l)break;if(2!=m&&(3!=m&&4!=m&&0<l.length&&n.u)&&(iconX=g[0]+k.left,iconY=g[1]+k.top,a.offsetX>=iconX-15&&a.offsetX<=iconX+15&&a.offsetY>=iconY-15&&a.offsetY<=iconY+15))return{type:c[5].c||"",name:d,uid:n.u||"",point:{x:iconX,y:iconY},clickFea:{tileId:e.id,tile:e,fea:c}}}return q},Lx:function(){return/M040/i.test(navigator.userAgent)},Pf:function(a){for(var b=a.offsetLeft,c=a.offsetTop,a=a.offsetParent;a&& a!=this.map.Na();)b+=a.offsetLeft,c+=a.offsetTop,a=a.offsetParent;return{top:c,left:b}},oC:function(a){if(this.map.Ub()){this.map.oa().k.Zb=18;var a=this.Bt=a,b;for(b in a)switch(b){case "style":this.Ip(a);break;case "styleStr":this.Ip(a);break;case "features":this.KN(a[b]);break;case "poiElements":this.SN(a[b])}}},cE:function(){this.lu();"dark"==this.Oe?x.D.Ta(this.vb,"light_gray_background"):x.D.Ta(this.vb,"gray_background")},lu:function(){x.D.Rb(this.vb,"gray_background");x.D.Rb(this.vb,"light_gray_background")}}); window.VectorLayer=zf;var Af=1,Bf=2,Cf=3,Df=4,Ef=5; function Ff(a){this.Hm=q;this.ct=[z.url.proto+z.url.domain.TILE_ONLINE_URLS[1]+"/"];this.QF=[z.url.proto+z.url.domain.TILE_ONLINE_URLS[1]+"/gvd/?",z.url.proto+z.url.domain.TILE_ONLINE_URLS[2]+"/gvd/?",z.url.proto+z.url.domain.TILE_ONLINE_URLS[3]+"/gvd/?",z.url.proto+z.url.domain.TILE_ONLINE_URLS[4]+"/gvd/?"];this.bb=p;this.qk={};this.map=a;this.Ue=this.lj=0;this.bi=p;this.Db=window.Db;this.nz=x.extend({},window.Db);this.dm={dark:{backColor:"#2D2D2D",textColor:"#bfbfbf",iconUrl:"vector/dicons"},normal:{backColor:"#F3F1EC", textColor:"#c61b1b",iconUrl:"vector/nicons_hd"},light:{backColor:"#EBF8FC",textColor:"#017fb4",iconUrl:"vector/licons"}};this.Js={};this.Ck=o;this.nk=p;this.Zl=/.*GT-I9300.*Version\\/\\d+.*Safari\\/\\d+\\.\\d+$/ig.test(navigator.userAgent)||/baiduboxapp/ig.test(navigator.userAgent)} Ff.prototype={As:function(a){var b=this.map,c=b.fa();this.Ue=a.length;this.lj=0;this.yc=this.map.K.devicePixelRatio;this.Hu=this.Iu=this.Gu=this.oq=0;b=b.Ja();new H(b.lng,b.lat);this.Ck?(ua.pc("vector_begin"),ua.MP=+new Date):this.map.Ka!=this.map.Cc&&(G()?(this.rf=$a.Fi.ok(104),this.JB=(new Date).getTime()):this.rf=$a.Fi.ok(4),this.rf.kz=+new Date,this.rf.cu());this.map.dispatchEvent(new N("onvectorbegin"));for(var b=0,d=this.Ue;b<d;b++){var e=a[b][2],f=a[b][0],g=a[b][1];e.Xe=q;e.nq=+new Date;this.fy(f, g,c,e)}},gK:function(){for(var a in this.qk)delete this.qk[a]},fy:function(a,b,c,d){var e=this,f=e.map,g=e.QF,i=Math.abs(parseInt(a,10)+parseInt(b,10))%g.length,k="x="+a+"&y="+b+"&z="+c,l="_"+(0>a?"_":"")+(0>b?"$":"")+parseInt(Math.abs(a)+""+Math.abs(b)+""+c,10).toString(36),g=g[i]+"qt=lgvd&layers=bg,df&"+k+"&styles=pl&f=jsapi&v=002&udt=20150526",g=g+("&fn=BMap."+l),f=f.Ja(),m=new H(f.lng,f.lat),n=e.map.fa();z[l]=function(f){if(f=f.content){d.lq=(new Date).getTime();var g=e.map,i=g.Ja(),g=g.fa(); if(!i.mb(m)||g!=n){delete z[l];return}f=(f.bg||[]).concat(f.df||[]);d.Wd=f;d.Xa="#c"+a+"r"+b+"z"+c;f&&e.Ko(f,d,m,n)}delete z[l]};Qb(g)},oj:function(a){var a=a.getContext("2d"),b=this.Ob*this.yc;this.Zl||(a.save(),a.clearRect(0,0,b,b),a.restore())},VC:function(a,b,c){a.fillStyle=c||"#F5F3F0";a.fillRect(0,0,b,b)},Ko:function(a,b,c,d){function e(){b.LP=+new Date;var e=i.map.Ja(),f=i.map.fa();if(e.mb(c)&&f==d){for(i.map.K.NF&&a.L_&&i.F1(g,a.L_);l<k;l++){var e=i.PE(a[l]),f=m[e[3]],n=m[e[4]],u=f[0];e.tc= f;e.Qc=n;u==Cf?i.Ww(g,e,d):u==Bf?i.oe(g,e[1],f,n,e[2]):u==Df?i.UC(g,e):i.WC(g,e)}b.Xe=o;b.HP=+new Date;i.Gu+=b.FP-b.JP;i.Iu+=b.GP-b.KP;i.Hu+=b.HP-b.LP;i.oq=i.Gu+i.Iu+i.Hu;i.lj++;i.Ue==i.lj&&(i.Ck&&(i.Ck=q,ua.pc("vector_loaded"),e={},4E3<+new Date-ua.kz&&(e.FirstScreenTime=+new Date-ua.kz,e.FST_V_B=+new Date-ua.MP,e.VectorDrawTime=i.oq,e.userAgent=navigator.userAgent,Pa(8080,e)),ua.pc("drawTime",i.oq),ua.pc("areaTime",i.Gu),ua.pc("roadTime",i.Iu),ua.pc("otherTime",i.Hu),ua.Xm(),z.Ij("cus.fire","time", {z_vectorfirstdrawtime:i.oq})),e=new N("onvectorloaded"),e.H1=i.oq,e.G1=i.lj,i.map.dispatchEvent(e),i.rf&&(i.rf.Oy(),i.rf.Xm(),i.rf=p,z.Ij("cus.fire","time",{z_vectorzoomtime:(new Date).getTime()-this.JB})),i.map.dispatchEvent(new N("ontilesloaded")))}}function f(){b.KP=+new Date;var e=i.map.Ja(),f=i.map.fa();if(e.mb(c)&&f==d){for(;l<k;l++){var e=a[l],f=m[e[3]],n=m[e[4]];17<=d&&(f[5]&&0<f[5].length&&1==f[5][0]&&6==f[5][1])&&(f[5].length=0,f[6]=0,n[6]=0);5<=d&&(9>=d&&f[5]&&0<f[5].length)&&(f[1]="115,115,115,0.3", f[5].length=0);e.tc=f;e.Qc=n;if(f[0]==Bf)i.PE(e);else break}i.gF(g,a,w,l,d);b.GP=+new Date}}b.JP=+new Date;var g=b.getContext("2d");1<this.yc&&!b.lg&&(g.scale(this.yc,this.yc),b.lg=o);g.textBaseline="bottom";this.VC(g,this.Ob,this.map.K.zo);for(var i=this,k=a.length,l=0,m=this.Db;l<k;l++){var n=a[l],u=m[n[3]]||window.Db[n[3]],v=m[n[4]]||window.Db[n[4]];n.tc=u;n.Qc=v;if(u[0]==Cf)i.Ww(g,i.PE(n),d);else break}b.FP=+new Date;var w=l;i.V2===o?(f(),e()):(window.setTimeout(f,1),window.setTimeout(e,1))}, PE:function(a){for(var b=a[1],c=0,d=0,e=0,f=b.length;e<f;e+=2)c+=b[e]/10,d+=b[e+1]/10,b[e]=c,b[e+1]=d;return a},Ww:function(a,b,c){var d=b.tc,e=d[2],b=b[1];a.fillStyle=z.Bb.qe(d[1]);a.beginPath();a.moveTo(b[0],b[1]);for(var d=2,f=b.length;d<f;d+=2)a.lineTo(b[d],b[d+1]);a.closePath();a.fill();0<e.length&&(a.strokeStyle=a.fillStyle,a.lineWidth=12<=c?3:e[3],a.stroke())},oe:function(a,b,c,d){if(c||d){var e=z.Bb.qe,f=z.Bb.lx,g=z.Bb.mx;if(this.ht(c,d))firstColor=backColor=(e=d&&d[5]&&0<d[5].length?o:q)? z.Bb.qe(c[1]):"rgba(0, 0, 0, 0)",backLineWidth=c[2],foreLineWidth=e?d[2]:c[2],intervalLen=e?d[5][0]:c[5][0],intervalColor=z.Bb.qe(e?d[1]:c[1]),z.Bb.rW(a,b,intervalLen,backLineWidth,foreLineWidth,firstColor,p,backColor,intervalColor);else if(1==c[7])a.strokeStyle=e(c[1]),a.fillStyle=a.strokeStyle,a.lineWidth=c[2],a.lineCap=f(c[3]),a.lineJoin=g(c[4]),z.Bb.JK(a,b,a.lineWidth);else{a.beginPath();a.moveTo(b[0],b[1]);for(var i=2,k=b.length;i<k;i+=2)a.lineTo(b[i],b[i+1]);a.strokeStyle=e(c[1]);a.lineCap= f(c[3]);a.lineJoin=g(c[4]);a.lineWidth=c[2];a.stroke();d&&(a.strokeStyle=e(d[1]),a.lineWidth=d[2],a.lineCap=f(d[3]),a.lineJoin=g(d[4]),a.stroke())}}},UC:function(a,b){var c=b[1],d=b.tc,e=z.Bb.qe,f=e(d[1]),g=e(d[2]),i=d[4],e=e(i[1]),i=i[2],d=d[5];z.Bb.YC(a,c,0,d,0,f,g,e,i)},WC:function(a,b){a.save();var c=b[1],d=b[0],e=b[2],f=this.Ss(b.tc,b.Qc),g=f[1],i=0;if(!("undefined"==typeof g||"number"==typeof g)){var k=-1<g.indexOf("biaopai");g.indexOf("ditie");if(0<g.length){var l="undefined"!=typeof TVC?TVC.QJ.a0: {},l=this.ct[g.length%this.ct.length]+this.dm.normal.iconUrl+"/"+g+".png?v="+(l.version?l.version:"002")+"&udt="+(l.mu?l.mu:"20150601"),m=new Image,n=c[0],u=c[1];2<c.length&&(i+=2);var v=this;m.onload=function(){var b=this.width,l=this.height;a.drawImage(this,n-b/4,u-l/4,b/2,l/2);k&&v.Bs(a,c,f,e,d,g,i,k);m.onload=p;delete m.onload;m=p};m.src=l}!k&&(f[2]&&0<f[2].length)&&this.Bs(a,c,f,e,d,g,i,k)}a.restore()},Bs:function(a,b,c,d,e,f,g,i){var k=z.Bb.qe,l=c[2];if(e&&0<l.length){var m=[],c=l[2],n=l[3], u=l[4],l=l[5];m.push(z.Bb.qL(u));x.platform.qE?(m.push("bold"),m.push(c+"px"),m.push("arial,\\u9ed1\\u4f53")):(m.push(c+"px"),m.push("\\u9ed1\\u4f53"));i||m.push("Helvetica Neue,Arial,Hiragino Sans GB,\\u9ed1\\u4f53,sans-serif");a.font=m.join(" ");a.fillStyle=k(n);if(m=z.Bb.aM(u))a.strokeStyle=k(l),a.lineWidth=i?0.5:2;for(var f=-1<f.indexOf("biaopai_xiandao"),n=e.split("\\\\"),v=0,w=n.length,y=b.length;v<w&&g<y;v++){var C=b[g],A=b[g+1],e=n[v],e=a.measureText(e).width,B=c,g=g+2;10<d&&350>d&&this.OF(a,C,A, d);var D=1;z.Bb.$L(u)&&(z.Bb.XK(a,C-e/2,A-B/2,e,B,{fillStyle:k(l)}),D=0);f?(a.save(),a.scale(0.9,0.9),m&&a.strokeText(n[v],(C-e/2+1)/0.9,(A+B/2+1)/0.9),a.fillText(n[v],(C-e/2+1)/0.9,(A+B/2+1)/0.9),a.restore()):(D=i?2:D,m&&a.strokeText(n[v],C-e/2,A+B/2+D),a.fillText(n[v],C-e/2,A+B/2+D))}}},Ss:function(a,b){var c=[Af,"",[]];a&&(a[0]==Ef?c[2]=a:c=a);b&&(b[0]==Ef?c[2]=b:c[1]=b[1]);return c},OF:function(a,b,c,d){d=d/180*Math.PI;cv=Math.cos(d);sv=Math.sin(d);yy=xx=cv;xy=sv;yx=-sv;x0=b-b*cv-c*sv;y0=c+b* sv-c*cv;a.transform(xx,yx,xy,yy,x0,y0)},gF:function(a,b,c,d,e){if(16>=e)for(var f=c;f<d;){for(var g=b[f],i=this.Ws(g.tc,g.Qc),c=f+1;c<d;c++){var k=b[c];if(i!=this.Ws(k.tc,k.Qc))break}for(g=f;g<c;g++){var l=b[g],m=l[1],i=l.tc,k=l.Qc;this.ht(i,k)?l.nE=o:10<=e&&13>=e?"228,218,201,1"!=i[1]&&this.oe(a,m,i,q):this.oe(a,m,i,q)}for(g=f;g<c;g++)l=b[g],m=l[1],i=l.tc,k=l.Qc,l.nE?this.oe(a,m,i,k,l[2],o):(10<=e&&13>=e&&"228,218,201,1"==i[1]&&(k[1]="231,231,157,1"),this.oe(a,m,k,q));f=c}else{for(f=c;f<d;f++)g= b[f],i=g.tc,k=g.Qc,e=i[6]&1?o:q,k&&!e&&(e=k[6]&1?o:q),e?g.wE=o:this.oe(a,g[1],i,q);for(f=c;f<d;f++)g=b[f],i=g.tc,k=g.Qc,g.wE?this.oe(a,g[1],i,k,g[2]):this.oe(a,g[1],k,q)}},Ws:function(a,b){if(!b)return 0;var c=a[6],d=b[6];if(1==c||1==d)return 1;switch(c){case 2:return 2==d?1:0;case 4:case 6:case 8:case 10:return 4<=d&&10>=d?1:0;default:return 0}},ht:function(a,b){return a&&0<a.length&&0<a[5].length||b&&0<b.length&&0<b[5].length?o:q}};z.NewVectorDrawLib=Ff; ');
 