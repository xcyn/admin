
 _jsload2&&_jsload2('menu', 'x.object.extend(cc.prototype,{qa:function(a,b){if(this.B)return q;this.C=a;this.wl=b||p;this.za();var c=this,d=a.K.Wb;b&&b.z.ff&&(d="pointer");this.B.style.cursor=d;this.Ad&&(this.Ad.style.cursor=d);x.M(document,"mousedown",function(){c.B&&c.U()});x.M(this.B,"click",function(a){c.U();ma(a)});d=this.k.Ua;d||(d=a.Ua);this.wl?this.wl.addEventListener("rightclick",function(a){c.B&&c.cJ(a)}):a.addEventListener("rightclickex",function(a){c.B&&(!a.$a&&!a.zb)&&c.cJ(a)});for(var d=0,e=this.xa.length;d<e;d++)"menuitem"== this.xa[d].Lb&&this.xa[d].qa(a,this),"divider"==this.xa[d].Lb&&(this.Ae[this.xa[d].Oj].D=zb(this.B,"<div class=\'BMap_cmDivider\'></div>"));this.Tr()},wb:function(){this.C&&(this.qa(this.C,this.wl),this.Ph&&(this.Ph=q,this.show()))},remove:function(){this.B&&(this.B.parentNode.removeChild(this.B),this.B=p);this.Ad&&(this.Ad.parentNode.removeChild(this.Ad),this.Ad=p);for(var a=0,b=this.xa.length;a<b;a++)"menuitem"==this.xa[a].Lb&&(this.xa[a].B=p);this.C=this.wl=p},za:function(){this.B=zb(this.C.Ua,"<div unselectable=\'on\'></div>"); this.B.className="BMap_contextMenu";var a=this.B.style;a.font="12px "+F.fontFamily;9>x.ea.la?this.Ad=zb(this.C.Ua,"<div class=\'BMap_cmShadow\'></div>"):a.jV=a.pP=a.WebkitBoxShadow="1px 2px 6px #666";return this.B},ow:function(a){if(a&&!("menuitem"!=a.Lb||""==a.Vg||0>=a.aj)){for(var b=0,c=this.xa.length;b<c;b++)if(this.xa[b]===a)return;this.xa.push(a);this.Ff.push(a);this.C&&(a.qa(this.C,this),x.D.Ta(a.Hd(),"BMap_cmLstItem"),1<this.xa.length?"menuitem"==this.xa[this.xa.length-2].Lb&&x.D.Rb(this.xa[this.xa.length- 2].Hd(),"BMap_cmLstItem"):"menuitem"==this.xa[0].Lb&&x.D.Ta(this.xa[0].Hd(),"BMap_cmFstItem"),this.Tr())}},removeItem:function(a){if(a&&"menuitem"==a.Lb){for(var b=0,c=this.xa.length;b<c;b++)this.xa[b]===a&&(this.xa[b].remove(),this.xa.splice(b,1),c--);b=0;for(c=this.Ff.length;b<c;b++)this.Ff[b]===a&&(this.Ff[b].remove(),this.Ff.splice(b,1),c--);this.B&&(0<this.xa.length&&"menuitem"==this.xa[this.xa.length-1].Lb&&x.D.Ta(this.xa[this.xa.length-1].Hd(),"BMap_cmLstItem"),this.Tr())}},RB:function(){this.xa.push({Lb:"divider", Oj:this.Ae.length});this.Ae.push({D:p});this.B&&(this.Ae[this.Ae.length-1].D=zb(this.B,"<div class=\'BMap_cmDivider\'></div>"),this.Tr())},eF:function(a){if(this.Ae[a]){this.Ae[a].D&&this.Ae[a].D.parentNode&&this.Ae[a].D.parentNode.removeChild(this.Ae[a].D);for(var b=0,c=this.xa.length;b<c;b++)this.xa[b]&&("divider"==this.xa[b].Lb&&this.xa[b].Oj==a)&&(this.xa.splice(b,1),c--),this.xa[b]&&("divider"==this.xa[b].Lb&&this.xa[b].Oj>a)&&this.xa[b].Oj--;this.Ae.splice(a,1);this.Tr()}},sa:function(a,b){this.B.style.left= a+"px";this.B.style.top=b+"px";this.Ad&&(this.Ad.style.left=a+1+"px",this.Ad.style.top=b+2+"px")},show:function(){if(this.Ph!=o&&0!=this.Ff.length){this.Ph=o;this.B&&(this.B.style.visibility="visible");this.Ad&&(this.Ad.style.visibility="visible");var a=new N("onopen");a.point=this.Pw;a.pixel=this.gs;this.dispatchEvent(a)}},U:function(){if(this.Ph!=q){this.Ph=q;this.B&&(this.B.style.visibility="hidden");this.Ad&&(this.Ad.style.visibility="hidden");var a=new N("onclose");a.point=this.Pw;a.pixel=this.gs; this.dispatchEvent(a)}},NZ:function(a){if(a&&(this.k.cursor=a,this.B&&(this.B.style.cursor=this.k.cursor),this.Ad))this.Ad.style.cursor=this.k.cursor},Tr:function(){this.B&&this.Ad&&(this.Ad.style.width=this.B.offsetWidth+"px",this.Ad.style.height=this.B.offsetHeight+"px")},cJ:function(a){if(0!=this.Ff.length){this.gs=a.ib;this.Pw=this.C.ub(this.gs);var b=this.Hd().offsetHeight,c=this.Hd().offsetWidth,d=a.ib.x,e=a.ib.y;a.ib.x+c>this.C.width&&(d=a.ib.x-c);a.ib.y+b>this.C.height&&(e=a.ib.y-b);this.sa(d, e);this.show()}}});S(gf,{addItem:gf.ow,removeItem:gf.removeItem,addSeparator:gf.RB,removeSeparator:gf.eF});x.object.extend(fc.prototype,{qa:function(a,b){if(this.B)return q;this.C=a;this.Hh=b;b.Hd()&&(this.za(),this.ca(),this.Lh||(this.Lh=o,this.disable()));return o},remove:function(){this.B&&(this.B.parentNode.removeChild(this.B),this.B=p);this.C=this.Hh=p},wb:function(){this.Hh&&this.C&&this.qa(this.C,this.Hh)},za:function(){var a=this.k.Cm?"<div"+(this.k.id?" id=\'"+this.k.id+"\'":"")+" unselectable=\'on\'><div style=\'width: 17px;height: 17px;margin-right: 3px;display: inline-block;zoom: 1;*display: inline;vertical-align: middle;background: url("+ this.k.Cm+") no-repeat;\'></div><span style=\'vertical-align: middle;\'>"+this.Vg+"</span></div>":"<div"+(this.k.id?" id=\'"+this.k.id+"\'":"")+" unselectable=\'on\'><span>"+this.Vg+"</span></div>";this.B=zb(this.Hh.Hd(),a);this.k.Cm?(this.lv=this.B.firstChild,this.Pr=this.B.lastChild):this.Pr=this.B;a=this.B.style;a.padding="2px 6px";a.margin="0 2px";a.fontSize="14px";a.MozUserSelect="none";a.lineHeight="17px";a.width=this.k.width+"px";this.Lh?(a.color="#000",a.cursor="pointer"):(a.color="#aaa",a.cursor= this.C.K.Wb);return this.B},ca:function(){var a=this;x.M(this.B,"click",function(b){a.Lh?a.xz&&a.xz.call&&a.xz.call(a,a.Hh.Pw,a.Hh.gs,a.Hh.wl):ma(b)});x.M(this.B,"mousedown",function(a){ma(a)});x.M(this.B,"mouseover",function(){a.Lh&&(a.B.style.color="#6688cc")});x.M(this.B,"mouseout",function(){a.Lh&&(a.B.style.color="#000")})},Rt:function(a){a&&(this.Vg=a+"",this.Pr&&(this.Pr.innerHTML="<span>"+this.Vg+"</span>"))},Tb:function(a){a&&(this.k.Cm=a,this.lv?this.lv.style.background="url("+a+")":(this.B.innerHTML= "<div"+(this.k.id?" id=\'"+this.k.id+"\'":"")+" unselectable=\'on\'><div style=\'width: 17px;height: 17px;margin-right: 3px;display: inline-block;zoom: 1;*display: inline;vertical-align: middle;background: url("+this.k.Cm+") no-repeat;\'></div><span style=\'vertical-align: middle;\'>"+this.Vg+"</span></div>",this.lv=this.B.firstChild,this.Pr=this.B.lastChild))},enable:function(){this.Lh=o;this.B&&(this.B.style.color="#000",this.B.style.cursor="pointer")},disable:function(){this.Lh=q;this.B&&(this.B.style.color= "#aaa",this.B.style.cursor=this.C.K.Wb)}});S(jf,{setIcon:jf.Tb,setText:jf.Rt,enable:jf.enable,disable:jf.disable}); ');
