
 _jsload2&&_jsload2('drawbyvml', 'function og(a){this.C=a;this.DU={strokeweight:"weight",strokecolor:"color",fillcolor:"color",strokeopacity:"opacity",fillopacity:"opacity",strokestyle:"dashstyle"};this.Lb="vml"}og.iK={orange:"#ffa500"};og.prototype=new z.Xy;var pg=og.prototype; pg.setAttribute=function(a,b,c){a&&(0==b.indexOf("stroke")?a=a.getElementsByTagName("stroke")[0]:0==b.indexOf("fill")&&(a=a.getElementsByTagName("fill")[0]),0<b.indexOf("color")&&(c?(a.on=o,og.iK[c]&&(c=og.iK[c])):a.on=q),"strokestyle"==b&&(c="solid"==c?"solid":"4 2 1 2"),"strokeweight"==b&&(c+="px"),a[this.Sq(b)]=c||"")};pg.Sq=function(a){return this.DU[a]||a};pg.wo=function(){return zb(this.C.Qf().ot,\'<v:shape style="behavior:url(#default#VML);z-index:1;width:1px;height:1px;position:absolute;left:0;top:0;"coordsize="1,1" coordorigin="0,0" filled="t" fillcolor="white"><v:stroke style="behavior:url(#default#VML);" endcap="round" oned="true" /><v:fill style="behavior:url(#default#VML)" /></v:shape>\')}; pg.ge=function(a,b){this.setAttribute(a,"path",this.hA(b));6==x.ea.la&&(a.style.display="none",a.style.display="")};pg.hA=function(a){if(0==a.length)return"";var b=[];x.jc.Fb(a,function(a){if(!(2>a.length)){b.push("m "+a[0].x+" "+a[0].y+" l");for(var d=1,e=a.length;d<e;d++)b.push(a[d].x),b.push(a[d].y);b.push("e")}});return b.join(" ")||" "};z.DP=og; ');