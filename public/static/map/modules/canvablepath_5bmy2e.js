
 _jsload2&&_jsload2('canvablepath', 'function Yf(a){a=a.replace(/,/gm," ");a=a.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm,"$1 $2");a=a.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm,"$1 $2");a=a.replace(/([MmZzLlHhVvCcSsQqTtAa])([^\\s])/gm,"$1 $2");a=a.replace(/([^\\s])([MmZzLlHhVvCcSsQqTtAa])/gm,"$1 $2");a=a.replace(/([0-9])([+\\-])/gm,"$1 $2");a=a.replace(/(\\.[0-9]*)(\\.)/gm,"$1 $2");a=a.replace(/([Aa](\\s+[0-9]+){3})\\s+([01])\\s*([01])/gm,"$1 $3 $4 ");a=Yf.FV(a);a=Yf.trim(a);this.sP=new function(a){this.LF= a.split(" ");this.reset=function(){this.lh=-1;this.Ft=this.Hw="";this.start=new Yf.Yf(0,0);this.Iw=new Yf.Yf(0,0);this.hb=new Yf.Yf(0,0);this.ia=[];this.yo=[]};this.ZL=function(){return this.lh>=this.LF.length-1};this.xj=function(){return this.ZL()?o:this.LF[this.lh+1].match(/^[A-Za-z]$/)!=p};this.tE=function(){switch(this.Hw){case "m":case "l":case "h":case "v":case "c":case "s":case "q":case "t":case "a":case "z":return o}return q};this.EL=function(){this.lh++;return this.LF[this.lh]};this.rj=function(){return parseFloat(this.EL())}; this.RY=function(){this.Ft=this.Hw;this.Hw=this.EL()};this.tm=function(){return this.DY(new Yf.Yf(this.rj(),this.rj()))};this.zD=function(){var a=this.tm();return this.Iw=a};this.sk=function(){var a=this.tm();return this.hb=a};this.xL=function(){return"c"!=this.Ft.toLowerCase()&&"s"!=this.Ft.toLowerCase()&&"q"!=this.Ft.toLowerCase()&&"t"!=this.Ft.toLowerCase()?this.hb:new Yf.Yf(2*this.hb.x-this.Iw.x,2*this.hb.y-this.Iw.y)};this.DY=function(a){this.tE()&&(a.x+=this.hb.x,a.y+=this.hb.y);return a};this.dj= function(a,b,e){e!=p&&(0<this.yo.length&&this.yo[this.yo.length-1]==p)&&(this.yo[this.yo.length-1]=Math.atan2(e.y-this.ia[this.ia.length-1].y,e.x-this.ia[this.ia.length-1].x));this.PB(a,b==p?p:Math.atan2(a.y-b.y,a.x-b.x))};this.PB=function(a,b){this.ia.push(a);this.yo.push(b)}}(a);this.gb=function(){return this.hi(p)};this.hi=function(a){var c=this.sP;c.reset();var d=new Yf.$O;for(a!=p&&a.beginPath();!c.ZL();)switch(c.RY(),c.Hw){case "M":case "m":var e=c.sk();c.dj(e);d.ng(e.x,e.y);a!=p&&a.moveTo(e.x, e.y);for(c.start=c.hb;!c.xj();)e=c.sk(),c.dj(e,c.start),d.ng(e.x,e.y),a!=p&&a.lineTo(e.x,e.y);break;case "L":case "l":for(;!c.xj();){var f=c.hb,e=c.sk();c.dj(e,f);d.ng(e.x,e.y);a!=p&&a.lineTo(e.x,e.y)}break;case "H":case "h":for(;!c.xj();)e=new Yf.Yf((c.tE()?c.hb.x:0)+c.rj(),c.hb.y),c.dj(e,c.hb),c.hb=e,d.ng(c.hb.x,c.hb.y),a!=p&&a.lineTo(c.hb.x,c.hb.y);break;case "V":case "v":for(;!c.xj();)e=new Yf.Yf(c.hb.x,(c.tE()?c.hb.y:0)+c.rj()),c.dj(e,c.hb),c.hb=e,d.ng(c.hb.x,c.hb.y),a!=p&&a.lineTo(c.hb.x,c.hb.y); break;case "C":case "c":for(;!c.xj();){var g=c.hb,f=c.tm(),i=c.zD(),e=c.sk();c.dj(e,i,f);d.OB(g.x,g.y,f.x,f.y,i.x,i.y,e.x,e.y);a!=p&&a.bezierCurveTo(f.x,f.y,i.x,i.y,e.x,e.y)}break;case "S":case "s":for(;!c.xj();)g=c.hb,f=c.xL(),i=c.zD(),e=c.sk(),c.dj(e,i,f),d.OB(g.x,g.y,f.x,f.y,i.x,i.y,e.x,e.y),a!=p&&a.bezierCurveTo(f.x,f.y,i.x,i.y,e.x,e.y);break;case "Q":case "q":for(;!c.xj();)g=c.hb,i=c.zD(),e=c.sk(),c.dj(e,i,i),d.GJ(g.x,g.y,i.x,i.y,e.x,e.y),a!=p&&a.quadraticCurveTo(i.x,i.y,e.x,e.y);break;case "T":case "t":for(;!c.xj();)g= c.hb,i=c.xL(),c.Iw=i,e=c.sk(),c.dj(e,i,i),d.GJ(g.x,g.y,i.x,i.y,e.x,e.y),a!=p&&a.quadraticCurveTo(i.x,i.y,e.x,e.y);break;case "A":case "a":for(;!c.xj();){var g=c.hb,k=c.rj(),l=c.rj(),f=c.rj()*(Math.PI/180),m=c.rj(),i=c.rj(),e=c.sk(),n=new Yf.Yf(Math.cos(f)*(g.x-e.x)/2+Math.sin(f)*(g.y-e.y)/2,-Math.sin(f)*(g.x-e.x)/2+Math.cos(f)*(g.y-e.y)/2),u=Math.pow(n.x,2)/Math.pow(k,2)+Math.pow(n.y,2)/Math.pow(l,2);1<u&&(k*=Math.sqrt(u),l*=Math.sqrt(u));m=(m==i?-1:1)*Math.sqrt((Math.pow(k,2)*Math.pow(l,2)-Math.pow(k, 2)*Math.pow(n.y,2)-Math.pow(l,2)*Math.pow(n.x,2))/(Math.pow(k,2)*Math.pow(n.y,2)+Math.pow(l,2)*Math.pow(n.x,2)));isNaN(m)&&(m=0);var v=new Yf.Yf(m*k*n.y/l,m*-l*n.x/k),g=new Yf.Yf((g.x+e.x)/2+Math.cos(f)*v.x-Math.sin(f)*v.y,(g.y+e.y)/2+Math.sin(f)*v.x+Math.cos(f)*v.y),w=function(a,b){return(a[0]*b[0]+a[1]*b[1])/(Math.sqrt(Math.pow(a[0],2)+Math.pow(a[1],2))*Math.sqrt(Math.pow(b[0],2)+Math.pow(b[1],2)))},y=function(a,b){return(a[0]*b[1]<a[1]*b[0]?-1:1)*Math.acos(w(a,b))},m=y([1,0],[(n.x-v.x)/k,(n.y- v.y)/l]),u=[(n.x-v.x)/k,(n.y-v.y)/l],v=[(-n.x-v.x)/k,(-n.y-v.y)/l],n=y(u,v);-1>=w(u,v)&&(n=Math.PI);1<=w(u,v)&&(n=0);u=1-i?1:-1;v=m+u*(n/2);c.PB(new Yf.Yf(g.x+k*Math.cos(v),g.y+l*Math.sin(v)),v-u*Math.PI/2);c.PB(e,v-u*Math.PI);d.ng(e.x,e.y);a!=p&&(w=k>l?k:l,e=k>l?1:k/l,k=k>l?l/k:1,a.translate(g.x,g.y),a.rotate(f),a.scale(e,k),a.arc(0,0,w,m,m+n,1-i),a.scale(1/e,1/k),a.rotate(-f),a.translate(-g.x,-g.y))}break;case "Z":case "z":a!=p&&a.closePath(),c.hb=c.start}return d}} Yf.trim=function(a){return a.replace(/^\\s+|\\s+$/g,"")};Yf.FV=function(a){return a.replace(/[\\s\\r\\t\\n]+/gm," ")};Yf.Yf=function(a,b){this.x=a;this.y=b}; Yf.$O=function(){this.An=this.zn=this.Cj=this.Bj=Number.NaN;this.x=t("Bj");this.y=t("Cj");this.width=function(){return this.zn-this.Bj};this.height=function(){return this.An-this.Cj};this.ng=function(a,b){if(a!=p){if(isNaN(this.Bj)||isNaN(this.zn))this.zn=this.Bj=a;a<this.Bj&&(this.Bj=a);a>this.zn&&(this.zn=a)}if(b!=p){if(isNaN(this.Cj)||isNaN(this.An))this.An=this.Cj=b;b<this.Cj&&(this.Cj=b);b>this.An&&(this.An=b)}};this.TB=function(a){this.ng(a,p)};this.UB=function(a){this.ng(p,a)};this.GJ=function(a, b,c,d,e,f){c=a+2/3*(c-a);d=b+2/3*(d-b);this.OB(a,b,c,c+1/3*(e-a),d,d+1/3*(f-b),e,f)};this.OB=function(a,b,c,d,e,f,g,i){var k=[a,b],l=[c,d],m=[e,f],n=[g,i];this.ng(k[0],k[1]);this.ng(n[0],n[1]);for(Zf=0;1>=Zf;Zf++)if(a=function(a){return Math.pow(1-a,3)*k[Zf]+3*Math.pow(1-a,2)*a*l[Zf]+3*(1-a)*Math.pow(a,2)*m[Zf]+Math.pow(a,3)*n[Zf]},b=6*k[Zf]-12*l[Zf]+6*m[Zf],c=-3*k[Zf]+9*l[Zf]-9*m[Zf]+3*n[Zf],d=3*l[Zf]-3*k[Zf],0==c)0!=b&&(b=-d/b,0<b&&1>b&&(0==Zf&&this.TB(a(b)),1==Zf&&this.UB(a(b))));else if(d=Math.pow(b, 2)-4*d*c,!(0>d)&&(e=(-b+Math.sqrt(d))/(2*c),0<e&&1>e&&(0==Zf&&this.TB(a(e)),1==Zf&&this.UB(a(e))),b=(-b-Math.sqrt(d))/(2*c),0<b&&1>b))0==Zf&&this.TB(a(b)),1==Zf&&this.UB(a(b))};this.ng(j,j);this.ng(j,j)};z.aP=Yf; ');
