// Embedded qrcode-generator Library
var qrcode=function(){function i(t,r){function a(t,r){g=function(t){for(var r=new Array(t),e=0;e<t;e+=1){r[e]=new Array(t);for(var n=0;n<t;n+=1)r[e][n]=null}return r}(l=4*u+17),e(0,0),e(l-7,0),e(0,l-7),i(),o(),v(t,r),7<=u&&h(t),null==n&&(n=w(u,f,c)),d(n,r)}var u=t,f=y[r],g=null,l=0,n=null,c=[],s={},e=function(t,r){for(var e=-1;e<=7;e+=1)if(!(t+e<=-1||l<=t+e))for(var n=-1;n<=7;n+=1)r+n<=-1||l<=r+n||(g[t+e][r+n]=0<=e&&e<=6&&(0==n||6==n)||0<=n&&n<=6&&(0==e||6==e)||2<=e&&e<=4&&2<=n&&n<=4)},o=function(){for(var t=8;t<l-8;t+=1)null==g[t][6]&&(g[t][6]=t%2==0);for(var r=8;r<l-8;r+=1)null==g[6][r]&&(g[6][r]=r%2==0)},i=function(){for(var t=B.getPatternPosition(u),r=0;r<t.length;r+=1)for(var e=0;e<t.length;e+=1){var n=t[r],o=t[e];if(null==g[n][o])for(var i=-2;i<=2;i+=1)for(var a=-2;a<=2;a+=1)g[n+i][o+a]=-2==i||2==i||-2==a||2==a||0==i&&0==a}},h=function(t){for(var r=B.getBCHTypeNumber(u),e=0;e<18;e+=1){var n=!t&&1==(r>>e&1);g[Math.floor(e/3)][e%3+l-8-3]=n}for(e=0;e<18;e+=1){n=!t&&1==(r>>e&1);g[e%3+l-8-3][Math.floor(e/3)]=n}},v=function(t,r){for(var e=f<<3|r,n=B.getBCHTypeInfo(e),o=0;o<15;o+=1){var i=!t&&1==(n>>o&1);o<6?g[o][8]=i:o<8?g[o+1][8]=i:g[l-15+o][8]=i}for(o=0;o<15;o+=1){i=!t&&1==(n>>o&1);o<8?g[8][l-o-1]=i:o<9?g[8][15-o-1+1]=i:g[8][15-o-1]=i}g[l-8][8]=!t},d=function(t,r){for(var e=-1,n=l-1,o=7,i=0,a=B.getMaskFunction(r),u=l-1;0<u;u-=2)for(6==u&&(u-=1);;){for(var f=0;f<2;f+=1)if(null==g[n][u-f]){var c=!1;i<t.length&&(c=1==(t[i]>>>o&1)),a(n,u-f)&&(c=!c),g[n][u-f]=c,-1==(o-=1)&&(i+=1,o=7)}if((n+=e)<0||l<=n){n-=e,e=-e;break}}},w=function(t,r,e){for(var n=b.getRSBlocks(t,r),o=M(),i=0;i<e.length;i+=1){var a=e[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var u=0;for(i=0;i<n.length;i+=1)u+=n[i].dataCount;if(o.getLengthInBits()>8*u)throw"code length overflow. ("+o.getLengthInBits()+">"+8*u+")";for(o.getLengthInBits()+4<=8*u&&o.put(0,4);o.getLengthInBits()%8!=0;)o.putBit(!1);for(;!(o.getLengthInBits()>=8*u||(o.put(236,8),o.getLengthInBits()>=8*u));)o.put(17,8);return function(t,r){for(var e=0,n=0,o=0,i=new Array(r.length),a=new Array(r.length),u=0;u<r.length;u+=1){var f=r[u].dataCount,c=r[u].totalCount-f;n=Math.max(n,f),o=Math.max(o,c),i[u]=new Array(f);for(var g=0;g<i[u].length;g+=1)i[u][g]=255&t.getBuffer()[g+e];e+=f;var l=B.getErrorCorrectPolynomial(c),h=C(i[u],l.getLength()-1).mod(l);a[u]=new Array(l.getLength()-1);for(g=0;g<a[u].length;g+=1){var s=g+h.getLength()-a[u].length;a[u][g]=0<=s?h.getAt(s):0}}var v=0;for(g=0;g<r.length;g+=1)v+=r[g].totalCount;var d=new Array(v),w=0;for(g=0;g<n;g+=1)for(u=0;u<r.length;u+=1)g<i[u].length&&(d[w]=i[u][g],w+=1);for(g=0;g<o;g+=1)for(u=0;u<r.length;u+=1)g<a[u].length&&(d[w]=a[u][g],w+=1);return d}(o,n)};s.addData=function(t,r){var e=null;switch(r=r||"Byte"){case"Numeric":e=x(t);break;case"Alphanumeric":e=m(t);break;case"Byte":e=L(t);break;case"Kanji":e=D(t);break;default:throw"mode:"+r}c.push(e),n=null},s.isDark=function(t,r){if(t<0||l<=t||r<0||l<=r)throw t+","+r;return g[t][r]},s.getModuleCount=function(){return l},s.make=function(){if(u<1){for(var t=1;t<40;t++){for(var r=b.getRSBlocks(t,f),e=M(),n=0;n<c.length;n++){var o=c[n];e.put(o.getMode(),4),e.put(o.getLength(),B.getLengthInBits(o.getMode(),t)),o.write(e)}var i=0;for(n=0;n<r.length;n++)i+=r[n].dataCount;if(e.getLengthInBits()<=8*i)break}u=t}a(!1,function(){for(var t=0,r=0,e=0;e<8;e+=1){a(!0,e);var n=B.getLostPoint(s);(0==e||n<t)&&(t=n,r=e)}return r}())},s.createTableTag=function(t,r){t=t||2;var e="";e+='<table style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: "+(r=void 0===r?4*t:r)+"px;",e+='">',e+="<tbody>";for(var n=0;n<s.getModuleCount();n+=1){e+="<tr>";for(var o=0;o<s.getModuleCount();o+=1)e+='<td style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: 0px;",e+=" width: "+t+"px;",e+=" height: "+t+"px;",e+=" background-color: ",e+=s.isDark(n,o)?"#000000":"#ffffff",e+=";",e+='"/>';e+="</tr>"}return e+="</tbody>",e+="</table>"},s.createSvgTag=function(t,r,e,n){var o={};"object"==typeof t&&(t=(o=t).cellSize,r=o.margin,e=o.alt,n=o.title),t=t||2,r=void 0===r?4*t:r,(e="string"==typeof e?{text:e}:e||{}).text=e.text||null,e.id=e.text?e.id||"qrcode-description":null,(n="string"==typeof n?{text:n}:n||{}).text=n.text||null,n.id=n.text?n.id||"qrcode-title":null;var i,a,u,f,c=s.getModuleCount()*t+2*r,g="";for(f="l"+t+",0 0,"+t+" -"+t+",0 0,-"+t+"z ",g+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',g+=o.scalable?"":' width="'+c+'px" height="'+c+'px"',g+=' viewBox="0 0 '+c+" "+c+'" ',g+=' preserveAspectRatio="xMinYMin meet"',g+=n.text||e.text?' role="img" aria-labelledby="'+p([n.id,e.id].join(" ").trim())+'"':"",g+=">",g+=n.text?'<title id="'+p(n.id)+'">'+p(n.text)+"</title>":"",g+=e.text?'<description id="'+p(e.id)+'">'+p(e.text)+"</description>":"",g+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',g+='<path d="',a=0;a<s.getModuleCount();a+=1)for(u=a*t+r,i=0;i<s.getModuleCount();i+=1)s.isDark(a,i)&&(g+="M"+(i*t+r)+","+u+f);return g+='" stroke="transparent" fill="black"/>',g+="</svg>"},s.createDataURL=function(o,t){o=o||2,t=void 0===t?4*o:t;var r=s.getModuleCount()*o+2*t,i=t,a=r-t;return I(r,r,function(t,r){if(i<=t&&t<a&&i<=r&&r<a){var e=Math.floor((t-i)/o),n=Math.floor((r-i)/o);return s.isDark(n,e)?0:1}return 1})},s.createImgTag=function(t,r,e){t=t||2,r=void 0===r?4*t:r;var n=s.getModuleCount()*t+2*r,o="";return o+="<img",o+=' src="',o+=s.createDataURL(t,r),o+='"',o+=' width="',o+=n,o+='"',o+=' height="',o+=n,o+='"',e&&(o+=' alt="',o+=p(e),o+='"'),o+="/>"};var p=function(t){for(var r="",e=0;e<t.length;e+=1){var n=t.charAt(e);switch(n){case"<":r+="&lt;";break;case">":r+="&gt;";break;case"&":r+="&amp;";break;case'"':r+="&quot;";break;default:r+=n}}return r};return s.createASCII=function(t,r){if((t=t||1)<2)return function(t){t=void 0===t?2:t;var r,e,n,o,i,a=1*s.getModuleCount()+2*t,u=t,f=a-t,c={"██":"█","█ ":"▀"," █":"▄","  ":" "},g={"██":"▀","█ ":"▀"," █":" ","  ":" "},l="";for(r=0;r<a;r+=2){for(n=Math.floor((r-u)/1),o=Math.floor((r+1-u)/1),e=0;e<a;e+=1)i="█",u<=e&&e<f&&u<=r&&r<f&&s.isDark(n,Math.floor((e-u)/1))&&(i=" "),u<=e&&e<f&&u<=r+1&&r+1<f&&s.isDark(o,Math.floor((e-u)/1))?i+=" ":i+="█",l+=t<1&&f<=r+1?g[i]:c[i];l+="\n"}return a%2&&0<t?l.substring(0,l.length-a-1)+Array(1+a).join("▀"):l.substring(0,l.length-1)}(r);t-=1,r=void 0===r?2*t:r;var e,n,o,i,a=s.getModuleCount()*t+2*r,u=r,f=a-r,c=Array(t+1).join("██"),g=Array(t+1).join("  "),l="",h="";for(e=0;e<a;e+=1){for(o=Math.floor((e-u)/t),h="",n=0;n<a;n+=1)i=1,u<=n&&n<f&&u<=e&&e<f&&s.isDark(o,Math.floor((n-u)/t))&&(i=0),h+=i?c:g;for(o=0;o<t;o+=1)l+=h+"\n"}return l.substring(0,l.length-1)},s.renderTo2dContext=function(t,r){r=r||2;for(var e=s.getModuleCount(),n=0;n<e;n++)for(var o=0;o<e;o++)t.fillStyle=s.isDark(n,o)?"black":"white",t.fillRect(n*r,o*r,r,r)},s}i.stringToBytes=(i.stringToBytesFuncs={default:function(t){for(var r=[],e=0;e<t.length;e+=1){var n=t.charCodeAt(e);r.push(255&n)}return r}}).default,i.createStringToBytes=function(u,f){var i=function(){function t(){var t=r.read();if(-1==t)throw"eof";return t}for(var r=S(u),e=0,n={};;){var o=r.read();if(-1==o)break;var i=t(),a=t()<<8|t();n[String.fromCharCode(o<<8|i)]=a,e+=1}if(e!=f)throw e+" != "+f;return n}(),a="?".charCodeAt(0);return function(t){for(var r=[],e=0;e<t.length;e+=1){var n=t.charCodeAt(e);if(n<128)r.push(n);else{var o=i[t.charAt(e)];"number"==typeof o?(255&o)==o?r.push(o):(r.push(o>>>8),r.push(255&o)):r.push(a)}}return r}};var r,t,a=1,u=2,o=4,f=8,y={L:1,M:0,Q:3,H:2},e=0,n=1,c=2,g=3,l=4,h=5,s=6,v=7,B=(r=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],(t={}).getBCHTypeInfo=function(t){for(var r=t<<10;0<=d(r)-d(1335);)r^=1335<<d(r)-d(1335);return 21522^(t<<10|r)},t.getBCHTypeNumber=function(t){for(var r=t<<12;0<=d(r)-d(7973);)r^=7973<<d(r)-d(7973);return t<<12|r},t.getPatternPosition=function(t){return r[t-1]},t.getMaskFunction=function(t){switch(t){case e:return function(t,r){return(t+r)%2==0};case n:return function(t,r){return t%2==0};case c:return function(t,r){return r%3==0};case g:return function(t,r){return(t+r)%3==0};case l:return function(t,r){return(Math.floor(t/2)+Math.floor(r/3))%2==0};case h:return function(t,r){return t*r%2+t*r%3==0};case s:return function(t,r){return(t*r%2+t*r%3)%2==0};case v:return function(t,r){return(t*r%3+(t+r)%2)%2==0};default:throw"bad maskPattern:"+t}},t.getErrorCorrectPolynomial=function(t){for(var r=C([1],0),e=0;e<t;e+=1)r=r.multiply(C([1,w.gexp(e)],0));return r},t.getLengthInBits=function(t,r){if(1<=r&&r<10)switch(t){case a:return 10;case u:return 9;case o:case f:return 8;default:throw"mode:"+t}else if(r<27)switch(t){case a:return 12;case u:return 11;case o:return 16;case f:return 10;default:throw"mode:"+t}else{if(!(r<41))throw"type:"+r;switch(t){case a:return 14;case u:return 13;case o:return 16;case f:return 12;default:throw"mode:"+t}}},t.getLostPoint=function(t){for(var r=t.getModuleCount(),e=0,n=0;n<r;n+=1)for(var o=0;o<r;o+=1){for(var i=0,a=t.isDark(n,o),u=-1;u<=1;u+=1)if(!(n+u<0||r<=n+u))for(var f=-1;f<=1;f+=1)o+f<0||r<=o+f||0==u&&0==f||a==t.isDark(n+u,o+f)&&(i+=1);5<i&&(e+=3+i-5)}for(n=0;n<r-1;n+=1)for(o=0;o<r-1;o+=1){var c=0;t.isDark(n,o)&&(c+=1),t.isDark(n+1,o)&&(c+=1),t.isDark(n,o+1)&&(c+=1),t.isDark(n+1,o+1)&&(c+=1),0!=c&&4!=c||(e+=3)}for(n=0;n<r;n+=1)for(o=0;o<r-6;o+=1)t.isDark(n,o)&&!t.isDark(n,o+1)&&t.isDark(n,o+2)&&t.isDark(n,o+3)&&t.isDark(n,o+4)&&!t.isDark(n,o+5)&&t.isDark(n,o+6)&&(e+=40);for(o=0;o<r;o+=1)for(n=0;n<r-6;n+=1)t.isDark(n,o)&&!t.isDark(n+1,o)&&t.isDark(n+2,o)&&t.isDark(n+3,o)&&t.isDark(n+4,o)&&!t.isDark(n+5,o)&&t.isDark(n+6,o)&&(e+=40);var g=0;for(o=0;o<r;o+=1)for(n=0;n<r;n+=1)t.isDark(n,o)&&(g+=1);return e+=Math.abs(100*g/r/r-50)/5*10},t);function d(t){for(var r=0;0!=t;)r+=1,t>>>=1;return r}var w=function(){for(var r=new Array(256),e=new Array(256),t=0;t<8;t+=1)r[t]=1<<t;for(t=8;t<256;t+=1)r[t]=r[t-4]^r[t-5]^r[t-6]^r[t-8];for(t=0;t<255;t+=1)e[r[t]]=t;var n={glog:function(t){if(t<1)throw"glog("+t+")";return e[t]},gexp:function(t){for(;t<0;)t+=255;for(;256<=t;)t-=255;return r[t]}};return n}();function C(n,o){if(void 0===n.length)throw n.length+"/"+o;var r=function(){for(var t=0;t<n.length&&0==n[t];)t+=1;for(var r=new Array(n.length-t+o),e=0;e<n.length-t;e+=1)r[e]=n[e+t];return r}(),i={getAt:function(t){return r[t]},getLength:function(){return r.length},multiply:function(t){for(var r=new Array(i.getLength()+t.getLength()-1),e=0;e<i.getLength();e+=1)for(var n=0;n<t.getLength();n+=1)r[e+n]^=w.gexp(w.glog(i.getAt(e))+w.glog(t.getAt(n)));return C(r,0)},mod:function(t){if(i.getLength()-t.getLength()<0)return i;for(var r=w.glog(i.getAt(0))-w.glog(t.getAt(0)),e=new Array(i.getLength()),n=0;n<i.getLength();n+=1)e[n]=i.getAt(n);for(n=0;n<t.getLength();n+=1)e[n]^=w.gexp(w.glog(t.getAt(n))+r);return C(e,0).mod(t)}};return i}function p(){var e=[],o={writeByte:function(t){e.push(255&t)},writeShort:function(t){o.writeByte(t),o.writeByte(t>>>8)},writeBytes:function(t,r,e){r=r||0,e=e||t.length;for(var n=0;n<e;n+=1)o.writeByte(t[n+r])},writeString:function(t){for(var r=0;r<t.length;r+=1)o.writeByte(t.charCodeAt(r))},toByteArray:function(){return e},toString:function(){var t="";t+="[";for(var r=0;r<e.length;r+=1)0<r&&(t+=","),t+=e[r];return t+="]"}};return o}var k,A,b=(k=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],(A={}).getRSBlocks=function(t,r){var e=function(t,r){switch(r){case y.L:return k[4*(t-1)+0];case y.M:return k[4*(t-1)+1];case y.Q:return k[4*(t-1)+2];case y.H:return k[4*(t-1)+3];default:return}}(t,r);if(void 0===e)throw"bad rs block @ typeNumber:"+t+"/errorCorrectionLevel:"+r;for(var n,o,i=e.length/3,a=[],u=0;u<i;u+=1)for(var f=e[3*u+0],c=e[3*u+1],g=e[3*u+2],l=0;l<f;l+=1)a.push((n=g,o=void 0,(o={}).totalCount=c,o.dataCount=n,o));return a},A),M=function(){var e=[],n=0,o={getBuffer:function(){return e},getAt:function(t){var r=Math.floor(t/8);return 1==(e[r]>>>7-t%8&1)},put:function(t,r){for(var e=0;e<r;e+=1)o.putBit(1==(t>>>r-e-1&1))},getLengthInBits:function(){return n},putBit:function(t){var r=Math.floor(n/8);e.length<=r&&e.push(0),t&&(e[r]|=128>>>n%8),n+=1}};return o},x=function(t){var r=a,n=t,e={getMode:function(){return r},getLength:function(t){return n.length},write:function(t){for(var r=n,e=0;e+2<r.length;)t.put(o(r.substring(e,e+3)),10),e+=3;e<r.length&&(r.length-e==1?t.put(o(r.substring(e,e+1)),4):r.length-e==2&&t.put(o(r.substring(e,e+2)),7))}},o=function(t){for(var r=0,e=0;e<t.length;e+=1)r=10*r+i(t.charAt(e));return r},i=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-"0".charCodeAt(0);throw"illegal char :"+t};return e},m=function(t){var r=u,n=t,e={getMode:function(){return r},getLength:function(t){return n.length},write:function(t){for(var r=n,e=0;e+1<r.length;)t.put(45*o(r.charAt(e))+o(r.charAt(e+1)),11),e+=2;e<r.length&&t.put(o(r.charAt(e)),6)}},o=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-"0".charCodeAt(0);if("A"<=t&&t<="Z")return t.charCodeAt(0)-"A".charCodeAt(0)+10;switch(t){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+t}};return e},L=function(t){var r=o,e=i.stringToBytes(t),n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=0;r<e.length;r+=1)t.put(e[r],8)}};return n},D=function(t){var r=f,e=i.stringToBytesFuncs.SJIS;if(!e)throw"sjis not supported.";!function(){var t=e("友");if(2!=t.length||38726!=(t[0]<<8|t[1]))throw"sjis not supported."}();var o=e(t),n={getMode:function(){return r},getLength:function(t){return~~(o.length/2)},write:function(t){for(var r=o,e=0;e+1<r.length;){var n=(255&r[e])<<8|255&r[e+1];if(33088<=n&&n<=40956)n-=33088;else{if(!(57408<=n&&n<=60351))throw"illegal char at "+(e+1)+"/"+n;n-=49472}n=192*(n>>>8&255)+(255&n),t.put(n,13),e+=2}if(e<r.length)throw"illegal char at "+(e+1)}};return n},S=function(t){var e=t,n=0,o=0,i=0,r={read:function(){for(;i<8;){if(n>=e.length){if(0==i)return-1;throw"unexpected end of file./"+i}var t=e.charAt(n);if(n+=1,"="==t)return i=0,-1;t.match(/^\s$/)||(o=o<<6|a(t.charCodeAt(0)),i+=6)}var r=o>>>i-8&255;return i-=8,r}},a=function(t){if(65<=t&&t<=90)return t-65;if(97<=t&&t<=122)return t-97+26;if(48<=t&&t<=57)return t-48+52;if(43==t)return 62;if(47==t)return 63;throw"c:"+t};return r},I=function(t,r,e){for(var n=function(t,r){var n=t,o=r,l=new Array(t*r),e={setPixel:function(t,r,e){l[r*n+t]=e},write:function(t){t.writeString("GIF87a"),t.writeShort(n),t.writeShort(o),t.writeByte(128),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(255),t.writeByte(255),t.writeByte(255),t.writeString(","),t.writeShort(0),t.writeShort(0),t.writeShort(n),t.writeShort(o),t.writeByte(0);var r=i(2);t.writeByte(2);for(var e=0;255<r.length-e;)t.writeByte(255),t.writeBytes(r,e,255),e+=255;t.writeByte(r.length-e),t.writeBytes(r,e,r.length-e),t.writeByte(0),t.writeString(";")}},i=function(t){for(var r=1<<t,e=1+(1<<t),n=t+1,o=h(),i=0;i<r;i+=1)o.add(String.fromCharCode(i));o.add(String.fromCharCode(r)),o.add(String.fromCharCode(e));var a=p(),u=function(t){var e=t,n=0,o=0,r={write:function(t,r){if(t>>>r!=0)throw"length over";for(;8<=n+r;)e.writeByte(255&(t<<n|o)),r-=8-n,t>>>=8-n,n=o=0;o|=t<<n,n+=r},flush:function(){0<n&&e.writeByte(o)}};return r}(a);u.write(r,n);var f=0,c=String.fromCharCode(l[f]);for(f+=1;f<l.length;){var g=String.fromCharCode(l[f]);f+=1,o.contains(c+g)?c+=g:(u.write(o.indexOf(c),n),o.size()<4095&&(o.size()==1<<n&&(n+=1),o.add(c+g)),c=g)}return u.write(o.indexOf(c),n),u.write(e,n),u.flush(),a.toByteArray()},h=function(){var r={},e=0,n={add:function(t){if(n.contains(t))throw"dup key:"+t;r[t]=e,e+=1},size:function(){return e},indexOf:function(t){return r[t]},contains:function(t){return void 0!==r[t]}};return n};return e}(t,r),o=0;o<r;o+=1)for(var i=0;i<t;i+=1)n.setPixel(i,o,e(i,o));var a=p();n.write(a);for(var u=function(){function e(t){a+=String.fromCharCode(r(63&t))}var n=0,o=0,i=0,a="",t={},r=function(t){if(t<0);else{if(t<26)return 65+t;if(t<52)return t-26+97;if(t<62)return t-52+48;if(62==t)return 43;if(63==t)return 47}throw"n:"+t};return t.writeByte=function(t){for(n=n<<8|255&t,o+=8,i+=1;6<=o;)e(n>>>o-6),o-=6},t.flush=function(){if(0<o&&(e(n<<6-o),o=n=0),i%3!=0)for(var t=3-i%3,r=0;r<t;r+=1)a+="="},t.toString=function(){return a},t}(),f=a.toByteArray(),c=0;c<f.length;c+=1)u.writeByte(f[c]);return u.flush(),"data:image/gif;base64,"+u};return i}();qrcode.stringToBytesFuncs["UTF-8"]=function(t){return function(t){for(var r=[],e=0;e<t.length;e++){var n=t.charCodeAt(e);n<128?r.push(n):n<2048?r.push(192|n>>6,128|63&n):n<55296||57344<=n?r.push(224|n>>12,128|n>>6&63,128|63&n):(e++,n=65536+((1023&n)<<10|1023&t.charCodeAt(e)),r.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|63&n))}return r}(t)},function(t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports&&(module.exports=t())}(function(){return qrcode});
window.qrcode = qrcode;

/* ==========================================================================
   ViVoo - Client-Side Prototype Logic
   Features: TikTok Feed, Smart Seating POV, Apple Pay, Split Payment,
             Dynamic QR Wallet, UGC Curation Loop, and Simulation Engine.
   ========================================================================== */

// Register PWA Service Worker with auto-reload on update
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('[PWA] Service Worker registered:', reg.scope);
        
        // Force update check immediately on app startup
        reg.update();
        
        reg.addEventListener('updatefound', () => {
          const installingWorker = reg.installing;
          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] New update installed. Reloading...');
              window.location.reload();
            }
          });
        });
      })
      .catch(err => console.error('[PWA] Service Worker registration failed:', err));
  });

  // Automatically reload when a new service worker claims the page
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      console.log('[PWA] Controller changed, refreshing page...');
      window.location.reload();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {

  
  // --------------------------------------------------------------------------
  // 1. DATABASE & AUTHENTICATION STATE MANAGEMENT
  // --------------------------------------------------------------------------
  
  // Global App State
  const state = {
    credit: 0, 
    activeScreen: 'auth-screen', // default screen is now auth-screen
    currentVibe: 'all',
    currentPlayingIndex: 0,
    selectedEvent: null,
    selectedSeat: null,
    groupBuyCount: 3,
    splitSession: null,
    tickets: [], // Purchased tickets from DB
    isMuted: true,
    gridCityFilter: 'all',
    gridPriceFilter: 'all',
    selectedTicketId: null,
    navigationHistory: [],
    user: null,  // Logged in user details
    token: null  // For bearer authentication (stores userId)
  };

  let eventsData = [];
  let activeFeedEvents = [];

  // API Request Headers Helper
  function getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (state.token) {
      headers['Authorization'] = `Bearer ${state.token}`;
    }
    return headers;
  }

  // API Call Helpers
  async function apiFetch(endpoint, options = {}) {
    const defaultHeaders = getHeaders();
    const mergedOptions = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    };
    try {
      const response = await fetch(endpoint, mergedOptions);
      if (!response.ok) {
        return await apiMockFallback(endpoint, options);
      }
      try {
        const data = await response.json();
        if (data.success === false) {
          throw new Error(data.error || `HTTP error ${response.status}`);
        }
        return data;
      } catch (jsonErr) {
        // Response is not JSON, probably static hosting 404 HTML fallback
        return await apiMockFallback(endpoint, options);
      }
    } catch (networkErr) {
      // Network failure, endpoint blocked, or offline
      return await apiMockFallback(endpoint, options);
    }
  }

  // Client-Side Mock Database Fallback for Static Hostings
  const mockEventsList = [
    {
      id: 'metronome_festival',
      title: 'Metronome Festival Prague 2026',
      tag: 'FESTIVAL',
      vibe: 'festivaly',
      location: 'Výstaviště Praha, Praha 7',
      date: 'Čt 18. – So 20. června 2026',
      lineup: 'Raye, Milky Chance, Michael Kiwanuka',
      weather: { temp: '24°C', text: 'Letní slunečno', icon: 'clear' },
      videoUrl: './videos/metronome_festival.mp4',
      bgImg: './images/metronome_festival.jpg',
      priceMin: 1890,
      priceMax: 3490,
      isFree: false,
      sectors: [
        { name: '3-Day Pass General Admission', price: 1890, povType: 'dancefloor-back' },
        { name: 'VIP Platform Lounge', price: 3490, povType: 'dancefloor-front' }
      ]
    },
    {
      id: 'concert_hvezdy',
      title: 'Koncert pod živými hvězdami',
      tag: 'HUDBA',
      vibe: 'koncerty',
      location: 'Riegrovy sady, Praha 3',
      date: 'Ne 18. října 2026 · 15:00',
      lineup: 'Xindl X, Pokáč',
      weather: { temp: '18°C', text: 'Jasná obloha', icon: 'clear' },
      videoUrl: './videos/xindl_live.mp4',
      bgImg: './images/xindl_live.jpg',
      priceMin: 400,
      priceMax: 1200,
      isFree: false,
      sectors: [
        { name: 'Sektor A (Stání u pódia)', price: 400, povType: 'dancefloor-front' },
        { name: 'VIP Sezení Terasa', price: 1200, povType: 'backstage' }
      ]
    },
    {
      id: 'derby',
      title: 'AC Sparta Praha vs SK Slavia Praha',
      tag: 'SPORT',
      vibe: 'sport',
      location: 'epet ARENA, Praha 7',
      date: 'So 12. října 2026 · 18:00',
      lineup: '312. Pražské Derby · Chance Liga',
      weather: { temp: '16°C', text: 'Jasno', icon: 'clear' },
      videoUrl: './videos/prague_derby.mp4',
      bgImg: './images/prague_derby.jpg',
      priceMin: 390,
      priceMax: 1100,
      isFree: false,
      sectors: [
        { name: 'Sektor C (Galerie)', price: 390, povType: 'far-stadium' },
        { name: 'Sektor B (Střed)', price: 650, povType: 'mid-stadium' },
        { name: 'Sektor A (Hřiště)', price: 1100, povType: 'near-stadium' }
      ]
    },
    {
      id: 'beats_for_love',
      title: 'Beats for Love 2026',
      tag: 'FESTIVAL',
      vibe: 'party',
      location: 'Dolní Vítkovice, Ostrava',
      date: 'St 1. – So 4. července 2026',
      lineup: 'Armin van Buuren, Lost Frequencies, Sub Focus',
      weather: { temp: '26°C', text: 'Jasno', icon: 'clear' },
      videoUrl: './videos/beats_for_love.mp4',
      bgImg: './images/beats_for_love.jpg',
      priceMin: 1490,
      priceMax: 2990,
      isFree: false,
      sectors: [
        { name: 'Celofestivalová vstupenka GA', price: 1490, povType: 'dancefloor-back' },
        { name: 'VIP Deck Pass', price: 2990, povType: 'dancefloor-front' }
      ]
    },
    {
      id: 'ballet',
      title: 'Labutí jezero – Balet ND',
      tag: 'DIVADLO',
      vibe: 'divadlo',
      location: 'Národní divadlo, Praha 1',
      date: 'Pá 27. listopadu 2026 · 19:00',
      lineup: 'Orchestr & Balet Národního divadla',
      weather: { temp: '14°C', text: 'Chladno', icon: 'indoor' },
      videoUrl: './videos/labuti_jezero.mp4',
      bgImg: './images/labuti_jezero.jpg',
      priceMin: 790,
      priceMax: 1850,
      isFree: false,
      sectors: [
        { name: 'Balkón 2. pořadí', price: 790, povType: 'fountain-far' },
        { name: 'Přízemí Lóže', price: 1850, povType: 'fountain-near' }
      ]
    },
    {
      id: 'basketball',
      title: 'NBL All-Star Game 2026',
      tag: 'SPORT',
      vibe: 'sport',
      location: 'UNYP Arena, Praha 9',
      date: 'Ne 14. února 2027 · 17:00',
      lineup: 'Slam Dunk Contest & 3pt Shooting Show',
      weather: { temp: '19°C', text: 'Hala', icon: 'indoor' },
      videoUrl: './videos/allstar_game.mp4',
      bgImg: './images/allstar_game.jpg',
      priceMin: 290,
      priceMax: 690,
      isFree: false,
      sectors: [
        { name: 'Stání Fanzóna', price: 290, povType: 'dancefloor-back' },
        { name: 'Sezení Palubovka', price: 690, povType: 'dancefloor-front' }
      ]
    }
  ];

  async function apiMockFallback(endpoint, options = {}) {
    console.log(`[API Fallback Mock] Intercepted request to: ${endpoint}`);
    
    let pathPart = endpoint.split('?')[0];
    // Strip host if absolute URL
    if (pathPart.startsWith('http')) {
      const match = pathPart.match(/^https?:\/\/[^\/]+(\/.*)/);
      if (match) pathPart = match[1];
    }
    
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : {};
    
    // Helper to get authenticated user from Authorization header
    const getAuthUserMock = () => {
      const headers = options.headers || {};
      const authHeader = headers['Authorization'] || getHeaders()['Authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
      const userId = parseInt(authHeader.split(' ')[1], 10);
      const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
      return users.find(u => u.id === userId) || null;
    };

    // Helper to save a user
    const saveUserMock = (user) => {
      const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const idx = users.findIndex(u => u.id === user.id);
      if (idx >= 0) users[idx] = user;
      else users.push(user);
      localStorage.setItem('mock_users', JSON.stringify(users));
    };

    // 1. APPLE BIOMETRIC SIGN-IN
    if (pathPart === '/api/auth/apple' && method === 'POST') {
      const randId = Math.floor(1000 + Math.random() * 9000);
      const user = {
        id: randId,
        username: `apple_user_${randId}`,
        full_name: `Apple User ${randId}`,
        bio: 'Immersive events fan, authenticated via Apple ID.',
        cashless_credit: 400
      };
      saveUserMock(user);
      
      const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const activities = JSON.parse(localStorage.getItem('mock_activities') || '[]');
      activities.push({
        user_id: user.id,
        type: 'bonus',
        title: 'Account Registration Bonus',
        time: `Today, ${timeStr}`,
        amount: 50
      });
      localStorage.setItem('mock_activities', JSON.stringify(activities));

      return { success: true, user };
    }

    // 2. SEND OTP
    if (pathPart === '/api/auth/otp/send' && method === 'POST') {
      if (!body.identity) {
        throw new Error('Email or Phone Number is required.');
      }
      return { success: true, message: 'Verification code sent. Use test code: 1234' };
    }

    // 2.5 VERIFY OTP & SIGN IN/UP
    if (pathPart === '/api/auth/otp/verify' && method === 'POST') {
      const { identity, code } = body;
      if (!identity || !code) {
        throw new Error('Identity and verification code are required.');
      }
      if (code !== '1234') {
        throw new Error('Invalid verification code. Enter 1234 to verify.');
      }

      const cleanIdentity = identity.trim().toLowerCase();
      const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
      let user = users.find(u => u.username === cleanIdentity);

      if (!user) {
        const randId = Math.floor(100000 + Math.random() * 900000);
        let fullName = 'Viver User';
        if (cleanIdentity.includes('@')) {
          const part = cleanIdentity.split('@')[0];
          fullName = part.charAt(0).toUpperCase() + part.slice(1);
        } else {
          fullName = 'Member ' + cleanIdentity.slice(-4);
        }

        user = {
          id: randId,
          username: cleanIdentity,
          full_name: fullName,
          bio: 'Verified event goer.',
          cashless_credit: 400
        };
        saveUserMock(user);

        const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const activities = JSON.parse(localStorage.getItem('mock_activities') || '[]');
        activities.push({
          user_id: user.id,
          type: 'bonus',
          title: 'Account Registration Bonus',
          time: `Today, ${timeStr}`,
          amount: 50
        });
        localStorage.setItem('mock_activities', JSON.stringify(activities));
      }

      return { success: true, user };
    }

    // 3. ME
    if (pathPart === '/api/auth/me' && method === 'GET') {
      const user = getAuthUserMock();
      if (!user) throw new Error('Unauthorized');
      return { success: true, user };
    }

    // 4. EVENTS
    if (pathPart === '/api/events' && method === 'GET') {
      return { success: true, events: mockEventsList };
    }

    // 5. TICKETS (GET)
    if (pathPart === '/api/tickets' && method === 'GET') {
      const user = getAuthUserMock();
      if (!user) throw new Error('Unauthorized');

      const tickets = JSON.parse(localStorage.getItem('mock_tickets') || '[]');
      const userTickets = tickets.filter(t => t.user_id === user.id);
      
      const formattedTickets = userTickets.map(t => {
        const event = mockEventsList.find(e => e.id === t.event_id);
        return {
          id: t.id,
          event: {
            id: t.event_id,
            title: event ? event.title : 'Unknown Event',
            location: event ? event.location : 'Unknown Location',
            bgImg: event ? event.bgImg : '',
            tag: event ? event.tag : ''
          },
          seat: {
            name: t.sector_name,
            price: t.price
          },
          holderName: t.holder_name,
          isGroup: !!t.is_group,
          isScanned: t.status === 'used'
        };
      });

      return { success: true, tickets: formattedTickets };
    }

    // 6. TICKETS PURCHASE (POST)
    if (pathPart === '/api/tickets/purchase' && method === 'POST') {
      const user = getAuthUserMock();
      if (!user) throw new Error('Unauthorized');

      const { eventId, sectorName, price, holderName, isGroup } = body;
      if (user.cashless_credit < price) {
        throw new Error('Insufficient cashless credit. Please top up your wallet in the profile tab.');
      }

      user.cashless_credit -= price;
      saveUserMock(user);

      const ticketId = `TICK-${Math.floor(100000 + Math.random() * 900000)}`;
      const tickets = JSON.parse(localStorage.getItem('mock_tickets') || '[]');
      const newTicket = {
        id: ticketId,
        user_id: user.id,
        event_id: eventId,
        sector_name: sectorName,
        price: price,
        holder_name: holderName || user.full_name,
        is_group: isGroup ? 1 : 0,
        status: 'active'
      };
      tickets.push(newTicket);
      localStorage.setItem('mock_tickets', JSON.stringify(tickets));

      const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const activities = JSON.parse(localStorage.getItem('mock_activities') || '[]');
      activities.push({
        user_id: user.id,
        type: 'purchase',
        title: `Ticket Purchase - ${sectorName}`,
        time: `Today, ${timeStr}`,
        amount: -price
      });
      localStorage.setItem('mock_activities', JSON.stringify(activities));

      const event = mockEventsList.find(e => e.id === eventId);

      return {
        success: true,
        newCredit: user.cashless_credit,
        ticket: {
          id: ticketId,
          event: {
            id: eventId,
            title: event ? event.title : 'Unknown Event',
            location: event ? event.location : 'Unknown Location',
            bgImg: event ? event.bgImg : ''
          },
          seat: {
            name: sectorName,
            price: price
          },
          holderName: holderName || user.full_name,
          isGroup: !!isGroup,
          isScanned: false
        }
      };
    }

    // 7. TICKETS SCAN (POST)
    if (pathPart === '/api/tickets/scan' && method === 'POST') {
      const user = getAuthUserMock();
      if (!user) throw new Error('Unauthorized');

      const tickets = JSON.parse(localStorage.getItem('mock_tickets') || '[]');
      tickets.forEach(t => {
        if (t.user_id === user.id) {
          t.status = 'used';
        }
      });
      localStorage.setItem('mock_tickets', JSON.stringify(tickets));
      return { success: true };
    }

    // 8. WALLET UPDATE (POST)
    if (pathPart === '/api/wallet/update' && method === 'POST') {
      const user = getAuthUserMock();
      if (!user) throw new Error('Unauthorized');

      const { amount, title, type } = body;
      user.cashless_credit += amount;
      saveUserMock(user);

      const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const activities = JSON.parse(localStorage.getItem('mock_activities') || '[]');
      activities.push({
        user_id: user.id,
        type: type || 'reward',
        title: title || 'Credits Adjustment',
        time: `Today, ${timeStr}`,
        amount: amount
      });
      localStorage.setItem('mock_activities', JSON.stringify(activities));

      return { success: true, newCredit: user.cashless_credit };
    }

    // 9. WALLET ACTIVITIES (GET)
    if (pathPart === '/api/wallet/activities' && method === 'GET') {
      const user = getAuthUserMock();
      if (!user) throw new Error('Unauthorized');

      const activities = JSON.parse(localStorage.getItem('mock_activities') || '[]');
      const userActivities = activities.filter(a => a.user_id === user.id).reverse();
      return { success: true, activities: userActivities };
    }

    // 10. SPLIT CREATE (POST)
    if (pathPart === '/api/split/create' && method === 'POST') {
      const user = getAuthUserMock();
      if (!user) throw new Error('Unauthorized');

      const { eventId, sectorName, price, totalSeats } = body;
      if (user.cashless_credit < price) {
        throw new Error('Insufficient cashless credit. Please top up your wallet in the profile tab.');
      }

      user.cashless_credit -= price;
      saveUserMock(user);

      const sessionId = Math.random().toString(36).substring(2, 6).toLowerCase();
      const sessions = JSON.parse(localStorage.getItem('mock_split_sessions') || '[]');
      sessions.push({
        id: sessionId,
        host_user_id: user.id,
        event_id: eventId,
        sector_name: sectorName,
        price: price,
        total_seats: totalSeats,
        paid_seats: 1,
        created_at: Date.now(),
        status: 'active'
      });
      localStorage.setItem('mock_split_sessions', JSON.stringify(sessions));

      const members = JSON.parse(localStorage.getItem('mock_split_members') || '[]');
      members.push({
        id: Math.floor(Math.random() * 100000),
        session_id: sessionId,
        user_id: user.id,
        name: user.full_name,
        status: 'paid'
      });

      for (let i = 1; i < totalSeats; i++) {
        const guestName = i === 1 ? 'Honza' : i === 2 ? 'Karel' : `Friend Guest ${i}`;
        members.push({
          id: Math.floor(Math.random() * 100000),
          session_id: sessionId,
          name: guestName,
          status: 'pending'
        });
      }
      localStorage.setItem('mock_split_members', JSON.stringify(members));

      const ticketId = `TICK-${Math.floor(100000 + Math.random() * 900000)}`;
      const tickets = JSON.parse(localStorage.getItem('mock_tickets') || '[]');
      tickets.push({
        id: ticketId,
        user_id: user.id,
        event_id: eventId,
        sector_name: sectorName,
        price: price,
        holder_name: `${user.full_name} (Host)`,
        is_group: 1,
        status: 'active'
      });
      localStorage.setItem('mock_tickets', JSON.stringify(tickets));

      const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const activities = JSON.parse(localStorage.getItem('mock_activities') || '[]');
      activities.push({
        user_id: user.id,
        type: 'purchase',
        title: `Group Booking Host - ${sectorName}`,
        time: `Today, ${timeStr}`,
        amount: -price
      });
      localStorage.setItem('mock_activities', JSON.stringify(activities));

      return {
        success: true,
        sessionId,
        newCredit: user.cashless_credit,
        ticketId
      };
    }

    // 11. SPLIT STATUS (GET)
    if (pathPart === '/api/split/status' && method === 'GET') {
      const urlObj = new URL(endpoint, window.location.origin);
      const sessionId = urlObj.searchParams.get('sessionId');
      if (!sessionId) throw new Error('Session ID required');

      const sessions = JSON.parse(localStorage.getItem('mock_split_sessions') || '[]');
      const session = sessions.find(s => s.id === sessionId);
      if (!session) throw new Error('Session not found');

      const members = JSON.parse(localStorage.getItem('mock_split_members') || '[]');
      const sessionMembers = members.filter(m => m.session_id === sessionId);

      const event = mockEventsList.find(e => e.id === session.event_id);

      return {
        success: true,
        session: {
          id: session.id,
          eventId: session.event_id,
          eventTitle: event ? event.title : 'Unknown Event',
          eventLocation: event ? event.location : 'Unknown Location',
          eventBgImg: event ? event.bgImg : '',
          sectorName: session.sector_name,
          price: session.price,
          totalSeats: session.total_seats,
          paidSeats: session.paid_seats,
          createdAt: session.created_at,
          status: session.status
        },
        members: sessionMembers
      };
    }

    // 12. SPLIT PAY (POST)
    if (pathPart === '/api/split/pay' && method === 'POST') {
      const { sessionId, memberId } = body;

      const sessions = JSON.parse(localStorage.getItem('mock_split_sessions') || '[]');
      const session = sessions.find(s => s.id === sessionId);
      if (!session) throw new Error('Session not found');

      const members = JSON.parse(localStorage.getItem('mock_split_members') || '[]');
      const member = members.find(m => m.id === memberId && m.session_id === sessionId);
      if (!member) throw new Error('Member not found');

      if (member.status === 'paid') {
        return { success: true, message: 'Already paid' };
      }

      member.status = 'paid';
      localStorage.setItem('mock_split_members', JSON.stringify(members));

      session.paid_seats += 1;
      if (session.paid_seats >= session.total_seats) {
        session.status = 'completed';
      }
      localStorage.setItem('mock_split_sessions', JSON.stringify(sessions));

      return { success: true, newPaidCount: session.paid_seats };
    }

    throw new Error(`API endpoint not found: ${pathPart}`);
  }

  // Modern Auth Screen Elements
  const authStepEntry = document.getElementById('auth-step-entry');
  const authStepOtp = document.getElementById('auth-step-otp');
  const authIdentityForm = document.getElementById('auth-identity-form');
  const authIdentityInput = document.getElementById('auth-identity');
  const authError = document.getElementById('auth-error-msg');
  const otpSentTarget = document.getElementById('otp-sent-target');
  const otpDigits = document.querySelectorAll('.otp-digit');
  
  const authAppleBtn = document.getElementById('auth-apple-btn');
  const authBiometricOverlay = document.getElementById('auth-biometric-overlay');
  const bioScanStatus = document.getElementById('bio-scan-status');

  let currentIdentity = '';

  // 1. Apple Sign-In Biometric flow
  if (authAppleBtn && authBiometricOverlay) {
    authAppleBtn.addEventListener('click', () => {
      authError.classList.add('hidden');
      authBiometricOverlay.classList.remove('hidden');
      bioScanStatus.textContent = 'Verifying Apple ID...';

      setTimeout(() => {
        bioScanStatus.textContent = 'Face ID Matched!';
        
        setTimeout(async () => {
          try {
            const data = await apiFetch('/api/auth/apple', {
              method: 'POST',
              body: JSON.stringify({})
            });
            authBiometricOverlay.classList.add('hidden');
            loginSuccess(data.user);
          } catch (err) {
            authBiometricOverlay.classList.add('hidden');
            authError.textContent = err.message;
            authError.classList.remove('hidden');
          }
        }, 800);
      }, 1500);
    });
  }

  // 2. Identity Input (Email/Phone) Form Submit
  if (authIdentityForm) {
    authIdentityForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      authError.classList.add('hidden');
      const identity = authIdentityInput.value.trim();
      if (!identity) return;

      try {
        const data = await apiFetch('/api/auth/otp/send', {
          method: 'POST',
          body: JSON.stringify({ identity })
        });
        
        currentIdentity = identity;
        otpSentTarget.textContent = identity;
        authStepEntry.classList.add('hidden');
        authStepOtp.classList.remove('hidden');
        
        otpDigits.forEach(input => input.value = '');
        if (otpDigits[0]) otpDigits[0].focus();
      } catch (err) {
        authError.textContent = err.message;
        authError.classList.remove('hidden');
      }
    });
  }

  // 3. OTP Digits Input Auto-focus progression & Submit
  otpDigits.forEach((input, idx) => {
    input.addEventListener('input', async (e) => {
      authError.classList.add('hidden');
      const val = input.value.replace(/[^0-9]/g, '');
      input.value = val;

      if (val && idx < otpDigits.length - 1) {
        otpDigits[idx + 1].focus();
      } else if (val && idx === otpDigits.length - 1) {
        await verifyOtpCode();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && idx > 0) {
        otpDigits[idx - 1].focus();
      }
    });
  });

  async function verifyOtpCode() {
    const code = Array.from(otpDigits).map(input => input.value).join('');
    if (code.length < 4) return;

    try {
      const data = await apiFetch('/api/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ identity: currentIdentity, code })
      });
      loginSuccess(data.user);
    } catch (err) {
      authError.textContent = err.message;
      authError.classList.remove('hidden');
      otpDigits.forEach(input => input.value = '');
      if (otpDigits[0]) otpDigits[0].focus();
    }
  }

  // Resend code trigger
  const btnOtpResend = document.getElementById('btn-otp-resend');
  if (btnOtpResend) {
    btnOtpResend.addEventListener('click', async () => {
      authError.classList.add('hidden');
      try {
        await apiFetch('/api/auth/otp/send', {
          method: 'POST',
          body: JSON.stringify({ identity: currentIdentity })
        });
        alert('Test verification code resent! Enter 1234.');
        otpDigits.forEach(input => input.value = '');
        if (otpDigits[0]) otpDigits[0].focus();
      } catch (err) {
        authError.textContent = err.message;
        authError.classList.remove('hidden');
      }
    });
  }

  // Back button from OTP screen
  const btnOtpBack = document.getElementById('btn-otp-back');
  if (btnOtpBack) {
    btnOtpBack.addEventListener('click', () => {
      authError.classList.add('hidden');
      authStepOtp.classList.add('hidden');
      authStepEntry.classList.remove('hidden');
    });
  }

  function loginSuccess(user) {
    state.user = user;
    state.token = user.id;
    state.credit = user.cashless_credit;
    localStorage.setItem('viv_user', JSON.stringify(user));
    localStorage.setItem('viv_token', user.id);
    
    updateCreditUI();
    updateProfileUI();
    
    initAppContent().then(() => {
      navigateTo('feed-screen');
    });
  }

  function logout() {
    state.user = null;
    state.token = null;
    state.credit = 0;
    state.tickets = [];
    localStorage.removeItem('viv_user');
    localStorage.removeItem('viv_token');
    
    if (authIdentityForm) authIdentityForm.reset();
    authStepOtp.classList.add('hidden');
    authStepEntry.classList.remove('hidden');
    
    const statusPill = document.querySelector('.tester-panel .status-pill');
    if (statusPill) {
      statusPill.textContent = 'Not Linked';
      statusPill.className = 'status-pill';
    }

    navigateTo('auth-screen');
  }

  const btnSignOut = document.getElementById('btn-sign-out');
  if (btnSignOut) {
    btnSignOut.addEventListener('click', () => {
      logout();
    });
  }

  function updateCreditUI() {
    const profileCreditStat = document.getElementById('profile-wallet-credit-stat');
    const testerCredit = document.getElementById('tester-credit');
    if (profileCreditStat) profileCreditStat.textContent = state.credit;
    if (testerCredit) testerCredit.textContent = state.credit;
    const feedHeaderCredit = document.getElementById('feed-header-credit-badge');
    if (feedHeaderCredit) {
      feedHeaderCredit.textContent = `${state.credit} CZK`;
    }
  }

  function updateProfileUI() {
    if (!state.user) return;
    const nameEl = document.querySelector('.profile-header-main h2');
    const usernameEl = document.querySelector('.profile-header-main .profile-username');
    const bioEl = document.querySelector('.profile-header-main .profile-bio');
    
    if (nameEl) nameEl.textContent = state.user.full_name;
    if (usernameEl) usernameEl.textContent = `@${state.user.username}`;
    if (bioEl) bioEl.textContent = state.user.bio || 'No bio provided.';
  }

  async function initAppContent() {
    try {
      await fetchEvents();
      activeFeedEvents = [...(eventsData || [])];
      renderFeed();
      renderDiscoveryGrid();

      try {
        await fetchTickets();
        await fetchActivities();
      } catch (subErr) {
        console.warn('[App Init] Non-critical user tickets/activities fetch error:', subErr);
      }
      
      // Update tester status
      const statusPill = document.querySelector('.tester-panel .status-pill');
      if (statusPill && state.user) {
        statusPill.textContent = `Linked (@${state.user.username})`;
        statusPill.className = 'status-pill status-linked';
      }
      window.navigateTo = navigateTo;
      window.openEventDetails = openEventDetails;
      window.eventsData = eventsData || mockEventsList;
    } catch (e) {
      console.error('[App Init] Failed to load user content:', e);
      if (!activeFeedEvents || activeFeedEvents.length === 0) {
        activeFeedEvents = [...mockEventsList];
        eventsData = [...mockEventsList];
        renderFeed();
        renderDiscoveryGrid();
      }
      window.navigateTo = navigateTo;
      window.openEventDetails = openEventDetails;
      window.eventsData = eventsData || mockEventsList;
    }
  }

  async function fetchEvents() {
    const data = await apiFetch('/api/events');
    eventsData = data.events;
  }

  async function fetchTickets() {
    const data = await apiFetch('/api/tickets');
    state.tickets = data.tickets;
    renderTicketsList();
  }

  async function fetchActivities() {
    const data = await apiFetch('/api/wallet/activities');
    renderActivitiesList(data.activities);
  }

  function renderActivitiesList(activities) {
    const container = document.querySelector('.history-list');
    if (!container) return;
    container.innerHTML = '';
    
    if (activities.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding: 10px; color: var(--color-text-muted); font-size:0.75rem;">No activity log found.</div>';
      return;
    }
    
    activities.forEach(act => {
      const item = document.createElement('div');
      item.className = 'history-item';
      
      let iconType = 'reward';
      let iconSvg = '';
      
      if (act.type === 'purchase') {
        iconType = 'purchase';
        iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;
      } else if (act.type === 'refund') {
        iconType = 'refund';
        iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`;
      } else {
        iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`;
      }
      
      const isPositive = act.amount > 0;
      const amtStr = isPositive ? `+${act.amount} CZK` : `${act.amount} CZK`;
      const valClass = isPositive ? 'history-val positive' : 'history-val';
      
      item.innerHTML = `
        <div class="history-icon ${iconType}">
          ${iconSvg}
        </div>
        <div class="history-details">
          <span class="history-item-title">${act.title}</span>
          <span class="history-item-time">${act.time}</span>
        </div>
        <strong class="${valClass}">${amtStr}</strong>
      `;
      container.appendChild(item);
    });
  }

  function showToast(message, isError = false) {
    const existing = document.getElementById('viv-global-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'viv-global-toast';
    toast.style.position = 'absolute';
    toast.style.bottom = '105px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    toast.style.background = isError ? 'rgba(239, 68, 68, 0.95)' : 'rgba(16, 185, 129, 0.95)';
    toast.style.color = '#fff';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '24px';
    toast.style.fontFamily = 'var(--font-family-title)';
    toast.style.fontSize = '0.8rem';
    toast.style.fontWeight = '700';
    toast.style.boxShadow = isError ? '0 10px 25px rgba(239, 68, 68, 0.3)' : '0 10px 25px rgba(16, 185, 129, 0.3)';
    toast.style.zIndex = '9999';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    toast.style.whiteSpace = 'nowrap';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '8px';

    const icon = isError 
      ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
      : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;

    toast.innerHTML = `${icon} <span>${message}</span>`;
    
    const container = document.getElementById('app-container') || document.body;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
      toast.style.opacity = '1';
    }, 10);

    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(-10px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 350);
    }, 3000);
  }

  async function initAuth() {
    const cachedUser = localStorage.getItem('viv_user');
    const cachedToken = localStorage.getItem('viv_token');
    
    if (cachedUser && cachedToken) {
      try {
        state.user = JSON.parse(cachedUser);
        state.token = cachedToken;
        state.credit = state.user.cashless_credit || 2360;
        
        updateCreditUI();
        updateProfileUI();
        await initAppContent();
        navigateTo('feed-screen');
      } catch (err) {
        console.error('Session restore fallback to default guest user', err);
        await setupDefaultGuestSession();
      }
    } else {
      await setupDefaultGuestSession();
    }
  }

  async function setupDefaultGuestSession() {
    const defaultUser = {
      id: 'usr_default',
      username: 'jakub_dostal',
      name: 'Jakub Dostál',
      email: 'jakub@dostal.cz',
      cashless_credit: 2360
    };
    state.user = defaultUser;
    state.token = defaultUser.id;
    state.credit = defaultUser.cashless_credit;
    localStorage.setItem('viv_user', JSON.stringify(defaultUser));
    localStorage.setItem('viv_token', defaultUser.id);
    
    // Save to mock_users for apiMockFallback
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    if (!users.some(u => u.id === defaultUser.id)) {
      users.push(defaultUser);
      localStorage.setItem('mock_users', JSON.stringify(users));
    }
    
    updateCreditUI();
    updateProfileUI();
    await initAppContent();
    navigateTo('feed-screen');
  }

  // --------------------------------------------------------------------------
  // 2. VIEW ROUTER (SPA navigation with View Transitions support)
  // --------------------------------------------------------------------------
  
  function navigateTo(screenId, pushToHistory = true) {
    if (state.activeScreen === screenId) return;

    // Clean up secure ticket intervals & hologram loops when navigating away
    if (screenId !== 'ticket-screen') {
      if (ticketCountdownInterval) {
        clearInterval(ticketCountdownInterval);
        ticketCountdownInterval = null;
      }
      if (hologramAnimFrame) {
        cancelAnimationFrame(hologramAnimFrame);
        hologramAnimFrame = null;
      }
      const oldCanvas = document.getElementById('pass-hologram-canvas');
      if (oldCanvas && oldCanvas._cleanup) {
        oldCanvas._cleanup();
      }
      state.selectedTicketId = null;
    }

    const mainTabs = ['feed-screen', 'grid-screen', 'ticket-screen', 'profile-screen'];

    // Track active screen routing stack
    if (pushToHistory) {
      if (mainTabs.includes(screenId)) {
        state.navigationHistory = []; // Reset subscreen stack on tab switches
      } else {
        if (state.navigationHistory.length === 0 || state.navigationHistory[state.navigationHistory.length - 1] !== state.activeScreen) {
          state.navigationHistory.push(state.activeScreen);
        }
      }
    }

    const updateDOM = () => {
      const newScreen = document.getElementById(screenId);
      document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
      if (newScreen) newScreen.classList.add('active');
      
      // Bottom navigation capsule visibility
      const capsuleNav = document.querySelector('.bottom-nav-capsule');
      if (mainTabs.includes(screenId)) {
        capsuleNav.classList.remove('hidden');
        syncCapsuleNav(screenId);
      } else {
        capsuleNav.classList.add('hidden');
      }

      // Screen specific entrance logic
      if (screenId === 'feed-screen') {
        playCurrentVideo();
      } else {
        pauseAllVideos();
      }

      if (screenId === 'grid-screen') {
        renderDiscoveryGrid();
      }

      if (screenId === 'ticket-screen') {
        renderTicketsList();
      }

      if (screenId === 'profile-screen') {
        renderProfileScreen();
      }

      state.activeScreen = screenId;
    };

    window.navigateTo = navigateTo;

    // Use view transitions API if supported
    if (document.startViewTransition) {
      document.startViewTransition(() => updateDOM());
    } else {
      updateDOM();
    }
  }

  function navigateBack() {
    if (state.navigationHistory && state.navigationHistory.length > 0) {
      const prev = state.navigationHistory.pop();
      navigateTo(prev, false);
    } else {
      navigateTo('feed-screen', false);
    }
  }

  // Highlight positioning logic
  const capsule = document.querySelector('.bottom-nav-capsule');
  const highlight = document.getElementById('capsule-nav-highlight');
  const navButtons = document.querySelectorAll('.capsule-nav-item');
  
  let isDragging = false;

  function updateHighlightToButton(btn, animate = true) {
    if (!highlight || !btn) return;
    
    if (animate) {
      capsule.classList.remove('is-dragging');
    } else {
      capsule.classList.add('is-dragging');
    }
    
    const highlightWidth = 84; // Matching Figma 3054:153 spec (84x52px)
    const btnCenterX = btn.offsetLeft + btn.offsetWidth / 2;
    const targetX = btnCenterX - highlightWidth / 2;
    
    highlight.style.width = `${highlightWidth}px`;
    highlight.style.transform = `translate3d(${targetX}px, 0, 0)`;
    
    // Clear any temporary rubber-band translate on snap back
    capsule.style.transform = '';
  }

  function updateHighlightToX(pointerX, animate = false) {
    if (!highlight) return;
    
    if (animate) {
      capsule.classList.remove('is-dragging');
    } else {
      capsule.classList.add('is-dragging');
    }
    
    const highlightWidth = 84;
    const minCenterX = 8 + highlightWidth / 2;
    const maxCenterX = capsule.offsetWidth - 8 - highlightWidth / 2;
    
    let targetX = 0;
    let stretchedWidth = highlightWidth;
    let shiftX = 0;
    
    // Elastic rubber-banding physics calculations when pulling near limits
    if (pointerX < minCenterX) {
      const overflow = minCenterX - pointerX;
      stretchedWidth = highlightWidth + overflow * 0.45; // Stretch width elastically
      targetX = 8 - (overflow * 0.15); // Slide left slightly with high resistance
      targetX = Math.max(2, targetX);
      shiftX = -overflow * 0.2; // Rubber-band shift the entire nav bar in direction of pull
    } else if (pointerX > maxCenterX) {
      const overflow = pointerX - maxCenterX;
      stretchedWidth = highlightWidth + overflow * 0.45; // Stretch width elastically
      targetX = (capsule.offsetWidth - 8 - highlightWidth) + (overflow * 0.15); // Slide right slightly with high resistance
      targetX = Math.min(capsule.offsetWidth - stretchedWidth - 2, targetX);
      shiftX = overflow * 0.2; // Rubber-band shift the entire nav bar in direction of pull
    } else {
      stretchedWidth = highlightWidth;
      targetX = pointerX - highlightWidth / 2;
      shiftX = 0;
    }
    
    highlight.style.width = `${stretchedWidth}px`;
    highlight.style.transform = `translate3d(${targetX}px, 0, 0)`;
    
    // Apply horizontal translation shift to the nav capsule
    capsule.style.transform = `translateX(-50%) translate3d(${shiftX}px, 0, 0)`;
    
    // Update button active state as we drag (using highlight's center coordinate)
    updateActiveIconProximity(targetX + stretchedWidth / 2);
  }

  function updateActiveIconProximity(centerX) {
    let minDistance = Infinity;
    let closestBtn = null;
    
    navButtons.forEach(btn => {
      const btnCenterX = btn.offsetLeft + btn.offsetWidth / 2;
      const distance = Math.abs(centerX - btnCenterX);
      if (distance < minDistance) {
        minDistance = distance;
        closestBtn = btn;
      }
    });
    
    navButtons.forEach(btn => {
      if (btn === closestBtn) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function syncCapsuleNav(screenId) {
    navButtons.forEach(btn => {
      if (btn.dataset.screen === screenId) {
        btn.classList.add('active');
        updateHighlightToButton(btn, true);
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Pointer event listeners for touch drag interaction
  if (capsule) {
    capsule.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      
      isDragging = true;
      capsule.classList.add('is-dragging');
      capsule.setPointerCapture(e.pointerId);
      
      const rect = capsule.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      
      updateHighlightToX(pointerX, false);
    });

    capsule.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      
      const rect = capsule.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      
      updateHighlightToX(pointerX, false);
    });

    capsule.addEventListener('pointerup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      capsule.releasePointerCapture(e.pointerId);
      capsule.classList.remove('is-dragging');
      
      // Snap to the closest button and navigate
      const rect = capsule.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      
      let minDistance = Infinity;
      let closestBtn = null;
      
      navButtons.forEach(btn => {
        const btnCenterX = btn.offsetLeft + btn.offsetWidth / 2;
        const distance = Math.abs(pointerX - btnCenterX);
        if (distance < minDistance) {
          minDistance = distance;
          closestBtn = btn;
        }
      });
      
      if (closestBtn) {
        updateHighlightToButton(closestBtn, true);
        navigateTo(closestBtn.dataset.screen);
      } else {
        capsule.style.transform = '';
      }
    });

    capsule.addEventListener('pointercancel', (e) => {
      if (!isDragging) return;
      isDragging = false;
      capsule.releasePointerCapture(e.pointerId);
      capsule.classList.remove('is-dragging');
      
      // Snap back to the current active screen button
      const activeBtn = capsule.querySelector('.capsule-nav-item.active');
      if (activeBtn) {
        updateHighlightToButton(activeBtn, true);
      } else {
        capsule.style.transform = '';
      }
    });

    // Handle window resize to keep highlight aligned
    window.addEventListener('resize', () => {
      const activeBtn = capsule.querySelector('.capsule-nav-item.active');
      if (activeBtn) {
        updateHighlightToButton(activeBtn, false);
      }
    });

    // Initialize highlight position on load and pre-fill wallet with placeholder tickets
    setTimeout(() => {
      const activeBtn = capsule.querySelector('.capsule-nav-item.active');
      if (activeBtn) {
        updateHighlightToButton(activeBtn, false);
      }
      
      initAuth();
    }, 150);
  }

  // Back button routing
  document.getElementById('detail-back-btn').addEventListener('click', () => navigateBack());
  document.getElementById('checkout-back-btn').addEventListener('click', () => navigateBack());
  document.getElementById('ugc-back-btn').addEventListener('click', () => navigateBack());

  // Global bottom nav capsule click bindings
  document.querySelectorAll('.capsule-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo(btn.dataset.screen);
    });
  });

  // Feed profile badge navigates to profile
  const feedProfileBtn = document.getElementById('feed-header-profile-btn');
  if (feedProfileBtn) {
    feedProfileBtn.addEventListener('click', () => navigateTo('profile-screen'));
  }

  // --------------------------------------------------------------------------
  // 3. DISCOVERY FEED ENGINE
  // --------------------------------------------------------------------------
  
  const videoFeed = document.getElementById('video-feed');

  function renderFeed() {
    videoFeed.innerHTML = '';
    
    if (activeFeedEvents.length === 0) {
      videoFeed.innerHTML = `
        <div class="empty-tickets-view">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M23 12c0 5.52-4.48 10-10 10S3 17.52 3 12 7.48 2 13 2s10 4.48 10 10z"/><line x1="13" y1="8" x2="13" y2="12"/><line x1="13" y1="16" x2="13.01" y2="16"/></svg>
          <p>No vibe clips match this nálada filter.</p>
        </div>`;
      return;
    }

    activeFeedEvents.forEach((ev, idx) => {
      const isUGC = ev.isUGC ? ' (Social UGC Proof)' : '';
      const feedItem = document.createElement('div');
      feedItem.className = 'feed-item';
      feedItem.dataset.index = idx;
      
      state.savedEventIds = state.savedEventIds || [];
      const isSaved = state.savedEventIds.includes(ev.id);

      const shortDate = ev.date ? (ev.date.split('•')[0] ? ev.date.split('•')[0].trim() : ev.date) : 'Ne 18. října · 15:00';
      const vibeClass = (ev.vibe || 'hudba').toLowerCase();

      feedItem.innerHTML = `
        <video class="feed-video" loop playsinline autoplay muted poster="${ev.bgImg}">
          <source src="${ev.videoUrl}" type="video/mp4">
        </video>
        
        <!-- Scrim dark gradient overlay (Figma Component: Scrim 3067:197) -->
        <div class="feed-scrim-overlay"></div>

        <!-- Video State Indicator -->
        <div class="video-state-overlay">
          <svg class="overlay-icon" width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </div>

        <!-- Bottom Left Overlay Info Container (Figma Frame 19: Full Width) -->
        <div class="feed-info-container">
          <div class="feed-badge-row">
            <span class="card-tag-badge badge-${vibeClass}">${ev.tag}</span>
          </div>
          <h2 class="feed-event-title">${ev.title}</h2>
          <div class="feed-meta-row">
            <span class="feed-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
              ${ev.location}
            </span>
            <span class="feed-meta-bullet">•</span>
            <span class="feed-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="8.01" y2="14"/><line x1="12" y1="14" x2="12.01" y2="14"/><line x1="16" y1="14" x2="16.01" y2="14"/><line x1="8" y1="18" x2="8.01" y2="18"/><line x1="12" y1="18" x2="12.01" y2="18"/><line x1="16" y1="18" x2="16.01" y2="18"/></svg>
              ${shortDate}
            </span>
          </div>
        </div>
        
        <!-- Right Side Action Bar (Pushed UP above text, transparent floating icons) -->
        <div class="feed-right-actions">
          <!-- Save Bookmark (Frame 17) -->
          <button class="feed-action-btn btn-save-feed ${isSaved ? 'saved' : ''}" aria-label="Save">
            <div class="feed-action-icon-box">
              <svg class="save-icon" width="24" height="26" viewBox="0 0 24 26" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 23l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </div>
            <span class="feed-action-text">Uložit</span>
          </button>

          <!-- Ticket Buy (Frame 16) -->
          <button class="feed-action-btn btn-ticket-feed" aria-label="Buy Ticket">
            <div class="feed-action-icon-box">
              <svg width="26" height="20" viewBox="0 0 26 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6a3 3 0 0 1 0 6v3a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-3a3 3 0 0 1 0-6V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3z"/><line x1="13" y1="2" x2="13" y2="18" stroke-dasharray="2 2"/></svg>
            </div>
            <span class="feed-action-text">Lístek</span>
          </button>
        </div>

        <!-- Progress bar tracking timeline -->
        <div class="video-progress-bar-outer">
          <div class="video-progress-bar-inner" id="progress-${idx}"></div>
        </div>
      `;
      
      const video = feedItem.querySelector('.feed-video');
      const soundBtn = feedItem.querySelector('.btn-sound');
      const saveBtn = feedItem.querySelector('.btn-save-feed');
      const likeBtn = feedItem.querySelector('.btn-like-feed');
      const ticketBtn = feedItem.querySelector('.btn-ticket-feed');
      const metaCta = feedItem.querySelector('.feed-meta');
      const overlay = feedItem.querySelector('.video-state-overlay');
      const overlayIcon = feedItem.querySelector('.overlay-icon');
      const discSpinner = feedItem.querySelector(`#disc-${idx}`);

      // Click video: Toggle Play/Pause
      video.addEventListener('click', () => {
        if (video.paused) {
          video.play();
          overlayIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; // Play icon
        } else {
          video.pause();
          overlayIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'; // Pause icon
        }
        overlay.classList.remove('trigger-anim');
        void overlay.offsetWidth; // Trigger reflow
        overlay.classList.add('trigger-anim');
      });

      // Sound button click
      if (soundBtn) {
        soundBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleMuteAll();
        });
      }

      // Like button click
      if (likeBtn) {
        likeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const likeIcon = likeBtn.querySelector('.heart-icon');
          const likeLbl = likeBtn.querySelector('.action-label');
          const isLiked = likeBtn.classList.toggle('liked');
          if (likeIcon && likeLbl) {
            if (isLiked) {
              likeIcon.setAttribute('fill', 'var(--color-accent-crimson)');
              likeIcon.setAttribute('stroke', 'var(--color-accent-crimson)');
              likeLbl.textContent = '2.5K';
            } else {
              likeIcon.setAttribute('fill', 'none');
              likeIcon.setAttribute('stroke', 'currentColor');
              likeLbl.textContent = '2.4K';
            }
          }
        });
      }

      // Save Bookmark button click
      if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          state.savedEventIds = state.savedEventIds || [];
          const index = state.savedEventIds.indexOf(ev.id);
          const saveIcon = saveBtn.querySelector('.save-icon');
          if (index > -1) {
            state.savedEventIds.splice(index, 1);
            saveBtn.classList.remove('saved');
            if (saveIcon) saveIcon.setAttribute('fill', 'none');
          } else {
            state.savedEventIds.push(ev.id);
            saveBtn.classList.add('saved');
            if (saveIcon) saveIcon.setAttribute('fill', 'currentColor');
          }
        });
      }

      // Ticket button click (Instantly opens detail checkout page)
      if (ticketBtn) {
        ticketBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openEventDetails(ev);
        });
      }

      // Clicking bottom left details opens detail page
      const infoContainer = feedItem.querySelector('.feed-info-container');
      if (infoContainer) {
        infoContainer.addEventListener('click', (e) => {
          e.stopPropagation();
          openEventDetails(ev);
        });
      }

      if (metaCta) {
        metaCta.addEventListener('click', (e) => {
          e.stopPropagation();
          openEventDetails(ev);
        });
      }

      // Progress bar updater
      video.addEventListener('timeupdate', () => {
        if (!isNaN(video.duration)) {
          const percent = (video.currentTime / video.duration) * 100;
          const progressBar = feedItem.querySelector(`#progress-${idx}`);
          if (progressBar) {
            progressBar.style.width = `${percent}%`;
          }
        }
      });

      video.addEventListener('play', () => {
        if (discSpinner) discSpinner.classList.remove('paused');
      });

      video.addEventListener('pause', () => {
        if (discSpinner) discSpinner.classList.add('paused');
      });

      videoFeed.appendChild(feedItem);
    });

    // Start checking scroll to play videos
    setupFeedScrollListener();
    playCurrentVideo();
  }

  function setupFeedScrollListener() {
    videoFeed.addEventListener('scroll', debounce(() => {
      const items = videoFeed.querySelectorAll('.feed-item');
      let currentVisibleIndex = 0;
      let maxVisibleHeight = 0;

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const containerRect = videoFeed.getBoundingClientRect();
        
        // Calculate intersection height
        const visibleHeight = Math.max(0, Math.min(rect.bottom, containerRect.bottom) - Math.max(rect.top, containerRect.top));
        if (visibleHeight > maxVisibleHeight) {
          maxVisibleHeight = visibleHeight;
          currentVisibleIndex = parseInt(item.dataset.index);
        }
      });

      if (state.currentPlayingIndex !== currentVisibleIndex) {
        state.currentPlayingIndex = currentVisibleIndex;
        playCurrentVideo();
      }
    }, 100));
  }

  function playCurrentVideo() {
    const items = videoFeed.querySelectorAll('.feed-item');
    if (items.length === 0) return;

    items.forEach((item, idx) => {
      const video = item.querySelector('.feed-video');
      if (!video) return;

      // Sync mute status
      video.muted = state.isMuted;

      if (idx === state.currentPlayingIndex) {
        if (video.paused) {
          // Play matching video element
          video.play().catch(err => {
            console.log('[PWA] Autoplay blocked, trying muted play:', err);
            video.muted = true;
            video.play().catch(e => console.error('[PWA] Failed to play muted video:', e));
          });
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }

  function pauseAllVideos() {
    const videos = videoFeed.querySelectorAll('.feed-video');
    videos.forEach(v => v.pause());
  }

  function toggleMuteAll() {
    state.isMuted = !state.isMuted;
    const videos = videoFeed.querySelectorAll('.feed-video');
    videos.forEach(v => v.muted = state.isMuted);

    // Update sound icons in the feed DOM
    renderFeedSoundIcons();
  }

  function renderFeedSoundIcons() {
    const items = videoFeed.querySelectorAll('.feed-item');
    items.forEach(item => {
      const soundBtn = item.querySelector('.btn-sound');
      if (soundBtn) {
        soundBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${state.isMuted 
              ? '<line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v6a3 3 0 0 0 3 3h1.586l4.707 4.707A1 1 0 0 0 20 22V4a1 1 0 0 0-1.707-.707L13.586 8H12a3 3 0 0 0-3 3z"/>' 
              : '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>'}
          </svg>
        `;
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3.1 DYNAMIC TIKTOK-STYLE HEADER TABS & SWIPE RECOGNITION
  // --------------------------------------------------------------------------
  
  const videoFeedContainer = document.getElementById('video-feed');
  const vibes = ['all', 'sport', 'culture', 'fun', 'networking', 'music'];

  // Switch vibe function
  function switchVibe(selectedVibe) {
    state.currentVibe = selectedVibe;
    state.gridVibeFilter = selectedVibe;
    state.currentPlayingIndex = 0;

    // 1. Sync Feed top bar pills (.feed-glass-pill)
    document.querySelectorAll('.feed-glass-pill').forEach(pill => {
      if (pill.dataset.vibe === selectedVibe) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // 2. Sync Search Grid fast filter pills (.fast-filter-pill)
    document.querySelectorAll('.fast-filter-pill').forEach(pill => {
      if (pill.dataset.vibe === selectedVibe) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // 3. Filter feed content
    if (selectedVibe === 'all') {
      activeFeedEvents = [...eventsData];
    } else {
      activeFeedEvents = eventsData.filter(e => e.vibe === selectedVibe);
    }

    // 4. Re-render views
    renderFeed();
    renderDiscoveryGrid();
  }

  // Bind tap events on Feed top bar glass pills & Search grid filter pills
  document.querySelectorAll('.feed-glass-pill, .fast-filter-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      switchVibe(pill.dataset.vibe);
    });
  });

  // Bind top bar global sound toggle
  const globalSoundToggle = document.getElementById('feed-global-sound-toggle');
  if (globalSoundToggle) {
    globalSoundToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMuteAll();
    });
  }

  // Bind swipe gestures on the vertical feed container
  if (videoFeedContainer) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    videoFeedContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    videoFeedContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Swipe threshold requirements:
      // deltaX > 60: swipe right (move to previous vibe)
      // deltaX < -60: swipe left (move to next vibe)
      // Math.abs(deltaY) < 40: ensures gesture is mostly horizontal to not block vertical scrolls
      if (Math.abs(deltaX) > 60 && Math.abs(deltaY) < 45) {
        const currentActive = state.currentVibe || 'all';
        const currentIndex = vibes.indexOf(currentActive);
        
        if (deltaX < 0) {
          // Swipe Left -> Next Vibe
          if (currentIndex < vibes.length - 1) {
            switchVibe(vibes[currentIndex + 1]);
          }
        } else {
          // Swipe Right -> Previous Vibe
          if (currentIndex > 0) {
            switchVibe(vibes[currentIndex - 1]);
          }
        }
      }
    }, { passive: true });
  }

  // Fast filter pills on discovery grid
  document.querySelectorAll('.fast-filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      switchVibe(pill.dataset.vibe);
    });
  });

  // Pricing segmented toggle switch on discovery grid
  document.querySelectorAll('.pricing-switch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pricing-segment-switch .pricing-switch-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.gridPriceFilter = btn.dataset.priceFilter;
      renderDiscoveryGrid();
    });
  });

  // Location selector inline dropdown handlers
  const locationSelector = document.getElementById('grid-location-selector');
  const locationDropdown = document.getElementById('location-dropdown');
  const dropdownItems = document.querySelectorAll('.location-dropdown-item');
  const currentLocationText = document.getElementById('current-location-text');

  if (locationSelector && locationDropdown) {
    locationSelector.addEventListener('click', (e) => {
      e.stopPropagation();
      locationDropdown.classList.toggle('active');
    });
  }

  // Close dropdown on clicking outside
  document.addEventListener('click', () => {
    if (locationDropdown) {
      locationDropdown.classList.remove('active');
    }
  });

  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const selectedLoc = item.dataset.location;
      state.gridCityFilter = selectedLoc;

      // Update selected state of item list
      dropdownItems.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');

      // Update location pill button label
      if (currentLocationText) {
        if (selectedLoc === 'all') {
          currentLocationText.textContent = 'All';
        } else if (selectedLoc === 'prague') {
          currentLocationText.textContent = 'Prague';
        } else if (selectedLoc === 'olomouc') {
          currentLocationText.textContent = 'Olomouc';
        }
      }

      locationDropdown.classList.remove('active');
      renderDiscoveryGrid();
    });
  });

  // Search input typing handler
  const searchInput = document.getElementById('grid-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.gridSearchQuery = e.target.value;
      renderDiscoveryGrid();
    });
  }

  // Render Discovery Grid (Hero Card + Multi-category 2-Column Grids matching Figma Spec)
  function renderDiscoveryGrid() {
    const heroSpotlight = document.getElementById('grid-hero-spotlight');
    const sectionsContainer = document.getElementById('grid-sections-container');
    
    if (!sectionsContainer) return;
    sectionsContainer.innerHTML = '';

    if (heroSpotlight) {
      heroSpotlight.innerHTML = '';
      heroSpotlight.style.display = 'none';
    }

    const query = (state.gridSearchQuery || '').toLowerCase().trim();
    const vibe = state.gridVibeFilter || 'all';

    let events = [...(eventsData && eventsData.length > 0 ? eventsData : mockEventsList)];
    
    if (vibe !== 'all') {
      const vibeFiltered = events.filter(ev => ev.vibe === vibe);
      if (vibeFiltered.length > 0) events = vibeFiltered;
    }

    if (query) {
      events = events.filter(ev => 
        ev.title.toLowerCase().includes(query) || 
        ev.lineup.toLowerCase().includes(query) ||
        ev.location.toLowerCase().includes(query)
      );
    }

    if (events.length === 0) {
      sectionsContainer.innerHTML = `<span class="empty-cards-msg" style="text-align: center; padding: 40px 0; color: var(--color-text-muted);">Žádné akce neodpovídají vašim filtrům.</span>`;
      return;
    }

    const formatPrice = (price) => price === 0 ? 'ZDARMA' : `od ${price} Kč`;

    // Render Hero Card (first event)
    const heroEv = events[0];
    if (heroSpotlight && heroEv) {
      heroSpotlight.style.display = 'block';
      heroSpotlight.innerHTML = `
        <div class="hero-bg-container">
          <img src="${heroEv.bgImg}" alt="${heroEv.title}">
        </div>
        <div class="hero-gradient-overlay"></div>
        <div class="hero-spotlight-badge">${(heroEv.tag || 'HUDBA').toUpperCase()}</div>
        <div class="hero-play-indicator">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2.5"><polygon points="6 3 20 12 6 21 6 3"/></svg>
        </div>
        <div class="hero-info-card">
          <div class="hero-info-left">
            <span class="hero-title">${heroEv.title}</span>
            <span class="hero-meta">${heroEv.location.split(',')[0]} • ${heroEv.date}</span>
          </div>
          <div class="hero-info-right">
            <span class="hero-price">${formatPrice(heroEv.priceMin)}</span>
          </div>
        </div>
      `;
      heroSpotlight.onclick = () => openEventDetails(heroEv);
    }

    // Define Figma 2-Column Sections
    const sections = [
      {
        title: 'Dnes v Praze',
        items: [
          { title: 'Coachella 2025', loc: 'Indio, California', price: '$499', badge: 'SOLD OUT', img: 'images/techno.jpg', ev: events[0] },
          { title: 'Tomorrowland', loc: 'Boom, Belgium', price: '$299', badge: 'VIP', img: 'images/summerbeats.jpg', ev: events[1] || events[0] },
          { title: 'Lollapalooza', loc: 'Grant Park, Chicago', price: '$450', badge: 'EARLY BIRD', img: 'images/derby.jpg', ev: events[2] || events[0] },
          { title: 'Rolling Loud', loc: 'Miami, Florida', price: '$199', badge: 'LIMITED', img: 'images/ballet.jpg', ev: events[3] || events[0] }
        ]
      },
      {
        title: 'Tento víkend',
        items: [
          { title: 'Glastonbury', loc: 'Pilton, Somerset', price: '$350', badge: 'FESTIVAL', img: 'images/flora.jpg', ev: events[4] || events[0] },
          { title: 'Electric Daisy Carnival', loc: 'Las Vegas, Nevada', price: '$450', badge: 'FESTIVAL', img: 'images/fun.jpg', ev: events[1] || events[0] },
          { title: 'Primavera Sound', loc: 'Parc del Fòrum', price: '$280', badge: 'HUDBA', img: 'images/techno.jpg', ev: events[2] || events[0] },
          { title: 'Austin City Limits', loc: 'Zilker Park', price: '$325', badge: 'FESTIVAL', img: 'images/summerbeats.jpg', ev: events[3] || events[0] }
        ]
      },
      {
        title: 'Akce plné adrenalinu',
        items: [
          { title: 'Bonnaroo', loc: 'Great Stage Park', price: '$380', badge: 'HUDBA', img: 'images/derby.jpg', ev: events[1] || events[0] },
          { title: 'Sonar Festival', loc: 'Fira Barcelona', price: '$240', badge: 'FESTIVAL', img: 'images/ballet.jpg', ev: events[2] || events[0] },
          { title: 'Ultra Music Festival', loc: 'Bayfront Park', price: '$399', badge: 'FESTIVAL', img: 'images/techno.jpg', ev: events[3] || events[0] },
          { title: 'Rock in Rio', loc: 'Parque Olímpico', price: '$550', badge: 'FESTIVAL', img: 'images/summerbeats.jpg', ev: events[0] }
        ]
      }
    ];

    sections.forEach(sec => {
      const secWrapper = document.createElement('div');
      secWrapper.className = 'grid-section-block';

      const secTitle = document.createElement('h3');
      secTitle.className = 'grid-section-title';
      secTitle.textContent = sec.title;
      secWrapper.appendChild(secTitle);

      const gridRow = document.createElement('div');
      gridRow.className = 'figma-2col-grid';

      sec.items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'figma-grid-card';
        
        let badgeStyle = 'badge-red';
        if (item.badge === 'VIP') badgeStyle = 'badge-gold';
        if (item.badge === 'EARLY BIRD' || item.badge === 'LIMITED') badgeStyle = 'badge-dark';

        card.innerHTML = `
          <div class="figma-card-image-wrap">
            <span class="figma-card-badge ${badgeStyle}">${item.badge}</span>
            <img src="${item.img}" alt="${item.title}" loading="lazy">
          </div>
          <div class="figma-card-meta">
            <h4 class="figma-card-title">${item.title}</h4>
            <p class="figma-card-sub">${item.loc}</p>
            <span class="figma-card-price">${item.price}</span>
          </div>
        `;

        card.addEventListener('click', () => openEventDetails(item.ev));
        gridRow.appendChild(card);
      });

      secWrapper.appendChild(gridRow);
      sectionsContainer.appendChild(secWrapper);
    });
  }

  // Helper to construct tilted event card
  function createTiltedCardElement(ev) {
    const card = document.createElement('div');
    card.className = 'tilted-card';
    
    const shortDate = ev.date.split('•')[0].split(',')[1] ? ev.date.split('•')[0].split(',')[1].trim() : ev.date.split('•')[0].trim();

    card.innerHTML = `
      <div class="tilted-card-date-badge">${shortDate}</div>
      <div class="card-image-container">
        <img src="${ev.bgImg}" alt="${ev.title}" loading="lazy" onerror="this.style.display='none'; this.parentNode.classList.add('fallback-bg');">
      </div>
      <div class="card-gradient-overlay"></div>
      <div class="tilted-card-details">
        <span class="tilted-card-title">${ev.title}</span>
        <div class="tilted-card-meta">
          <span>${ev.location.split(',')[0]}</span>
          <strong class="tilted-card-price">${ev.priceMin === 0 ? 'ZDARMA' : 'od ' + ev.priceMin + ' Kč'}</strong>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      openEventDetails(ev);
    });

    return card;
  }

  // Helper to construct event card matching UI Kit Classic Card spec
  function createEventCardElement(ev) {
    const card = document.createElement('div');
    card.className = 'event-card event-card-classic';
    
    const formatPrice = (price) => price === 0 ? 'ZDARMA' : `od ${price} Kč`;
    const shortDate = ev.date ? (ev.date.split('•')[0] ? ev.date.split('•')[0].trim() : ev.date) : 'Ne 15. 10.';
    const vibeClass = (ev.vibe || 'hudba').toLowerCase();

    card.innerHTML = `
      <div class="card-tag-badge badge-${vibeClass}">${ev.tag}</div>
      <div class="card-image-container">
        <img src="${ev.bgImg}" alt="${ev.title}" loading="lazy" onerror="this.style.display='none'; this.parentNode.classList.add('fallback-bg');">
      </div>
      <div class="card-info-content">
        <h4 class="card-title">${ev.title}</h4>
        <div class="card-meta-row">
          <span class="card-meta-location">${ev.location.split(',')[0]} · ${shortDate}</span>
          <span class="card-meta-price">${formatPrice(ev.priceMin)}</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      openEventDetails(ev);
    });

    return card;
  }

  // Render Profile/Cashless wallet page details
  function renderProfileScreen() {
    const balance = document.getElementById('profile-wallet-credit-stat');
    if (balance) {
      balance.textContent = state.credit;
    }
  }

  // Debouncer helper
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Initialize feed
  renderFeed();

  // --------------------------------------------------------------------------
  // 4. ACTION DETAIL & SMART SEATING ENGINE
  // --------------------------------------------------------------------------
  
  const budgetSlider = document.getElementById('seating-budget-slider');
  const budgetValueDisp = document.getElementById('seating-budget-value');
  const allocatedSeatName = document.getElementById('allocated-seat-name');
  const allocatedSeatPrice = document.getElementById('allocated-seat-price');
  const stickyCtaSeat = document.getElementById('sticky-cta-seat');

  function openEventDetails(eventObj) {
    window.openEventDetails = openEventDetails;
    state.selectedEvent = eventObj;
    
    // Set text elements safely
    const titleEl = document.getElementById('detail-event-title');
    if (titleEl) titleEl.textContent = eventObj.title;

    const tagEl = document.getElementById('detail-event-tag');
    if (tagEl) {
      tagEl.textContent = eventObj.tag ? eventObj.tag.replace(/⚡|🎉|🍃/g, '').trim() : 'Hudba';
      tagEl.className = `card-tag-badge badge-${(eventObj.vibe || 'hudba').toLowerCase()}`;
    }

    const locEl = document.getElementById('detail-event-location');
    if (locEl) locEl.textContent = eventObj.location;

    const dateEl = document.getElementById('detail-event-date');
    if (dateEl) dateEl.textContent = eventObj.date;

    const headlinerName = document.getElementById('detail-headliner-name');
    if (headlinerName) headlinerName.textContent = eventObj.lineup ? eventObj.lineup.split(',')[0].split('•')[0] : 'Xindl X';

    const headlinerSub = document.getElementById('detail-headliner-sub');
    if (headlinerSub) headlinerSub.textContent = 'Headliner · 20:00';

    const headlinerAvatar = document.getElementById('detail-headliner-avatar');
    if (headlinerAvatar) headlinerAvatar.src = eventObj.bgImg;

    const footerPrice = document.getElementById('detail-footer-price');
    if (footerPrice) footerPrice.textContent = `${eventObj.priceMin || 400} Kč`;

    // Set Hero Background Image
    const heroBg = document.getElementById('detail-hero-bg');
    if (heroBg) heroBg.style.backgroundImage = `url(${eventObj.bgImg})`;

    // Reset budget slider range constraints based on event pricing
    if (budgetSlider) {
      budgetSlider.min = eventObj.priceMin || 200;
      budgetSlider.max = eventObj.priceMax || 1800;
      budgetSlider.value = Math.round(((eventObj.priceMin || 200) + (eventObj.priceMax || 1800)) / 2);
    }
    
    updateSeatSelection();
    navigateTo('detail-screen');
  }

  function renderWeatherIcon(iconType) {
    const weatherIconContainer = document.getElementById('detail-weather-icon');
    let svgContent = '';
    
    if (iconType === 'clear') {
      svgContent = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    } else if (iconType === 'windy') {
      svgContent = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>`;
    } else {
      // Indoor / House icon
      svgContent = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
    }
    
    weatherIconContainer.innerHTML = svgContent;
  }

  // Seat Allocator matching budget
  function updateSeatSelection() {
    if (!state.selectedEvent) return;

    const budget = parseInt(budgetSlider.value);
    budgetValueDisp.textContent = budget;

    // Find best sector matching budget limits
    // We want the most premium sector that has price <= budget
    // If all are more expensive, assign cheapest. If budget allows multiple, choose most expensive <= budget.
    const sectors = state.selectedEvent.sectors;
    let selectedSector = sectors[0]; // Default cheapest
    
    sectors.forEach(sec => {
      if (sec.price <= budget) {
        selectedSector = sec;
      }
    });

    state.selectedSeat = {
      name: `${selectedSector.name}, Řada ${Math.floor(Math.random() * 8) + 1}, Sedadlo ${Math.floor(Math.random() * 20) + 1}`,
      price: selectedSector.price,
      povType: selectedSector.povType
    };

    // Update UI elements safely
    if (allocatedSeatName) allocatedSeatName.textContent = state.selectedSeat.name.split(',')[0] + ', ' + state.selectedSeat.name.split(',')[1];
    if (allocatedSeatPrice) allocatedSeatPrice.textContent = state.selectedSeat.price;
    if (stickyCtaSeat) stickyCtaSeat.textContent = `${state.selectedSeat.name.split(',')[0]} (Price: ${state.selectedSeat.price} CZK)`;
    
    // Draw POV stadium representation
    drawSeatPOV(state.selectedSeat.povType);
  }

  budgetSlider.addEventListener('input', updateSeatSelection);

  // SVG POV visual stadium generator
  function drawSeatPOV(povType) {
    const canvas = document.getElementById('seat-pov-canvas');
    let svgMarkup = '';

    // Main coordinates / elements of stadium representation
    if (povType.includes('stadium')) {
      // Football Field
      const opacityC = povType === 'near-stadium' ? 1.0 : (povType === 'mid-stadium' ? 0.6 : 0.3);
      const strokeW = povType === 'near-stadium' ? 3 : (povType === 'mid-stadium' ? 2 : 1.5);
      const stageScale = povType === 'near-stadium' ? 1.3 : (povType === 'mid-stadium' ? 1.0 : 0.7);
      
      svgMarkup = `
        <!-- Background Dark Gradient -->
        <rect width="100%" height="100%" fill="#06060a"/>
        
        <!-- Stadium Lights Glow -->
        <circle cx="50" cy="20" r="100" fill="rgba(211, 16, 53, 0.15)" filter="blur(20px)"/>
        <circle cx="250" cy="20" r="100" fill="rgba(138, 15, 74, 0.15)" filter="blur(20px)"/>

        <!-- Football Pitch lines drawn in perspective -->
        <g transform="translate(150, 140) scale(${stageScale})" stroke="rgba(255, 255, 255, 0.25)" stroke-width="${strokeW}" fill="none">
          <!-- Outer border -->
          <polygon points="-70,-40 70,-40 100,10 -100,10" fill="rgba(16, 185, 129, ${0.1 + (opacityC*0.1)})"/>
          <!-- Halfway line -->
          <line x1="0" y1="-40" x2="0" y2="10" stroke="rgba(255, 255, 255, 0.3)"/>
          <!-- Penalty box near -->
          <polygon points="-40,10 -30,-15 30,-15 40,10" stroke="rgba(255,255,255,0.4)"/>
          <!-- Center Circle -->
          <ellipse cx="0" cy="-15" rx="20" ry="8" stroke="rgba(255, 255, 255, 0.3)"/>
          
          <!-- Crowd / Stadium walls behind -->
          <path d="M-90,-60 L90,-60 L80,-48 L-80,-48 Z" fill="rgba(255, 255, 255, 0.05)"/>
        </g>
        
        <!-- Spectator Hand Silhouettes in VIP rows -->
        ${povType === 'near-stadium' ? `
          <g fill="rgba(255,255,255,0.12)">
            <path d="M10,160 Q20,130 35,160 M70,160 Q75,135 90,160 M220,160 Q235,120 250,160 M270,160 Q280,140 290,160"/>
          </g>
        ` : ''}

        <!-- Seating sector viewpoint label overlay -->
        <text x="15" y="25" fill="#a0a0ab" font-size="9" font-family="'Outfit', sans-serif" font-weight="600" letter-spacing="0.5">VIEW FROM SEAT</text>
        <text x="15" y="42" fill="#fff" font-size="14" font-family="'Outfit', sans-serif" font-weight="700">
          ${povType === 'near-stadium' ? 'Pitchside VIP (Row 2)' : (povType === 'mid-stadium' ? 'Lower Grandstand' : 'Sky Gallery Section C')}
        </text>
      `;
    } else if (povType.includes('dancefloor') || povType === 'backstage') {
      // Concert venue stage POV
      const scaleS = povType === 'backstage' ? 1.5 : (povType === 'dancefloor-front' ? 1.1 : 0.7);
      const isBackstage = povType === 'backstage';
      
      svgMarkup = `
        <rect width="100%" height="100%" fill="#050508"/>
        
        <!-- Lasers rays -->
        <line x1="0" y1="10" x2="300" y2="150" stroke="rgba(211, 16, 53, 0.2)" stroke-width="2"/>
        <line x1="300" y1="10" x2="0" y2="150" stroke="rgba(138, 15, 74, 0.2)" stroke-width="2"/>
        <line x1="150" y1="10" x2="70" y2="160" stroke="rgba(211, 16, 53, 0.25)" stroke-width="3"/>
        <line x1="150" y1="10" x2="230" y2="160" stroke="rgba(211, 16, 53, 0.25)" stroke-width="3"/>

        <!-- Concert Stage -->
        <g transform="translate(150, ${isBackstage ? 130 : 90}) scale(${scaleS})">
          <!-- Stage floor -->
          <polygon points="-80,20 80,20 60,-10 -60,-10" fill="#0c0c0f" stroke="#222" stroke-width="1"/>
          <!-- DJ Booth / Deck -->
          <rect x="-20" y="-5" width="40" height="18" fill="#15151c" stroke="var(--color-accent-crimson)" stroke-width="1.5"/>
          <circle cx="-10" cy="0" r="3" fill="var(--color-accent-crimson)"/>
          <circle cx="10" cy="0" r="3" fill="#fff"/>
          
          <!-- Stage Background screens -->
          <rect x="-55" y="-35" width="110" height="25" fill="rgba(211, 16, 53, 0.1)"/>
          <!-- LED graphic simulator circles -->
          <circle cx="-30" cy="-22" r="6" fill="rgba(211, 16, 53, 0.3)"/>
          <circle cx="0" cy="-22" r="8" fill="rgba(138, 15, 74, 0.4)"/>
          <circle cx="30" cy="-22" r="6" fill="rgba(211, 16, 53, 0.3)"/>
        </g>
        
        <!-- Audience crowd silhouettes (foreground) -->
        ${!isBackstage ? `
          <g fill="rgba(255,255,255,${povType === 'dancefloor-front' ? 0.08 : 0.2})">
            <!-- Heads and raised hands -->
            <path d="M0,160 Q10,135 25,160 M40,160 Q48,138 58,160 M80,160 Q95,120 110,160 M140,160 Q150,130 162,160 M200,160 Q215,125 230,160 M260,160 Q272,135 285,160"/>
            <!-- Raised hands -->
            <line x1="90" y1="135" x2="85" y2="120" stroke="rgba(255,255,255,0.2)" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="210" y1="135" x2="215" y2="118" stroke="rgba(255,255,255,0.2)" stroke-width="2.5" stroke-linecap="round"/>
          </g>
        ` : `
          <!-- Backstage perspective: artists in front of crowds -->
          <g fill="rgba(211, 16, 53, 0.12)">
            <ellipse cx="150" cy="140" rx="90" ry="12"/>
          </g>
          <text x="150" y="143" fill="rgba(255,255,255,0.4)" font-size="6" text-anchor="middle" font-weight="700">STAGE BACKSTAGE ZONE</text>
        `}

        <text x="15" y="25" fill="#a0a0ab" font-size="9" font-family="'Outfit', sans-serif" font-weight="600" letter-spacing="0.5">VIEW FROM SEAT</text>
        <text x="15" y="42" fill="#fff" font-size="14" font-family="'Outfit', sans-serif" font-weight="700">
          ${isBackstage ? 'Backstage VIP deck' : (povType === 'dancefloor-front' ? 'Front Pitch Area' : 'Main Arena General Admission')}
        </text>
      `;
    } else {
      // Fountain / Theatre setup
      const zoom = povType === 'fountain-near' ? 1.4 : (povType === 'fountain-mid' ? 1.0 : 0.65);
      svgMarkup = `
        <rect width="100%" height="100%" fill="#040406"/>
        <circle cx="150" cy="110" r="80" fill="rgba(211, 16, 53, 0.05)" filter="blur(16px)"/>
        
        <!-- Water jets vector -->
        <g transform="translate(150, 110) scale(${zoom})" stroke="var(--color-accent-crimson)" stroke-width="1.5" fill="none">
          <!-- Center vertical jet -->
          <path d="M0,20 C-10,-40 10,-40 0,-60" stroke-width="2.5"/>
          <!-- Curved jets sides -->
          <path d="M-30,20 C-60,-20 -20,-20 -10,-40"/>
          <path d="M30,20 C60,-20 20,-20 10,-40"/>
          <!-- Stage floor -->
          <ellipse cx="0" cy="20" rx="60" ry="10" fill="#09090c" stroke="rgba(255,255,255,0.1)"/>
        </g>
        
        <!-- Stage Lights beams -->
        <polygon points="20,10 90,110 50,110" fill="rgba(211, 16, 53, 0.06)"/>
        <polygon points="280,10 210,110 250,110" fill="rgba(138, 15, 74, 0.06)"/>

        <text x="15" y="25" fill="#a0a0ab" font-size="9" font-family="'Outfit', sans-serif" font-weight="600" letter-spacing="0.5">VIEW FROM SEAT</text>
        <text x="15" y="42" fill="#fff" font-size="14" font-family="'Outfit', sans-serif" font-weight="700">
          ${povType === 'fountain-near' ? 'Front Rows Section A' : (povType === 'fountain-mid' ? 'Middle Tier Section B' : 'Upper Grandstand Section C')}
        </text>
      `;
    }

    if (canvas) canvas.innerHTML = svgMarkup;
  }

  // Handle click of "Get Ticket" CTA on detail view
  document.getElementById('detail-buy-btn').addEventListener('click', () => {
    if (!state.selectedEvent || !state.selectedSeat) return;

    // Populate checkout screen text elements
    document.getElementById('checkout-event-title').textContent = state.selectedEvent.title;
    document.getElementById('checkout-event-seat').textContent = state.selectedSeat.name;
    document.getElementById('checkout-event-price').textContent = `${state.selectedSeat.price} CZK`;
    
    // Group configuration update
    document.getElementById('group-single-price').textContent = state.selectedSeat.price;

    // Direct mode check by default
    document.getElementById('pay-direct').checked = true;
    document.getElementById('group-buy-config').classList.add('hidden');
    document.querySelector('label[for="pay-direct"]').classList.add('selected');
    document.querySelector('label[for="pay-group"]').classList.remove('selected');
    
    // Apple Pay checkout button text update
    document.getElementById('checkout-pay-btn').innerHTML = `<span class="btn-apple-logo"></span> Pay with Apple Pay`;

    navigateTo('checkout-screen');
  });

  // --------------------------------------------------------------------------
  // 5. ZERO-FRICTION CHECKOUT & SPLIT PAYMENT
  // --------------------------------------------------------------------------
  
  const payModeRadios = document.querySelectorAll('input[name="checkout-mode"]');
  const groupConfig = document.getElementById('group-buy-config');
  const payBtn = document.getElementById('checkout-pay-btn');

  payModeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      // Toggle selected class on parent elements
      document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
      radio.closest('.payment-option').classList.add('selected');

      if (radio.value === 'group') {
        groupConfig.classList.remove('hidden');
        payBtn.innerHTML = ` Set Group Booking & Pay ${state.selectedSeat.price} CZK`;
      } else {
        groupConfig.classList.add('hidden');
        payBtn.innerHTML = `<span class="btn-apple-logo"></span> Pay with Apple Pay`;
      }
    });
  });

  // Split Seats buttons selector click handler
  const grpBtns = document.querySelectorAll('.grp-btn');
  grpBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      grpBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.groupBuyCount = parseInt(btn.dataset.count);
    });
  });

  // Trigger Apple Pay Sheet Open
  payBtn.addEventListener('click', () => {
    const isGroup = document.getElementById('pay-group').checked;
    
    // Populate Apple Pay sheet values
    document.getElementById('apple-pay-desc').textContent = isGroup ? `Group Booking Deposit (${state.selectedEvent.title})` : state.selectedEvent.title;
    document.getElementById('apple-pay-amount').textContent = `${state.selectedSeat.price} CZK`;

    // Reset Biometrics UI
    const bioIcon = document.getElementById('bio-face-id');
    const bioText = document.getElementById('bio-text');
    const bioWrapper = document.getElementById('face-id-trigger');
    if (bioWrapper) {
      bioWrapper.classList.remove('success', 'scanning');
    }
    if (bioIcon) {
      bioIcon.setAttribute('stroke', '#ffffff');
    }
    if (bioText) {
      bioText.textContent = 'Tap Face ID to authorize payment';
    }

    // Show Sheet Drawer
    document.getElementById('apple-pay-sheet').classList.remove('hidden');
  });

  // Close Apple Pay Sheet
  document.getElementById('apple-pay-close').addEventListener('click', () => {
    document.getElementById('apple-pay-sheet').classList.add('hidden');
  });

  // Handle biometric Face ID click simulation
  const bioWrapper = document.getElementById('face-id-trigger');
  if (bioWrapper) {
    bioWrapper.addEventListener('click', () => {
      const bioIcon = document.getElementById('bio-face-id');
      const bioText = document.getElementById('bio-text');
      const isGroup = document.getElementById('pay-group').checked;

      if (bioWrapper.classList.contains('scanning') || bioWrapper.classList.contains('success')) return;

      bioWrapper.classList.add('scanning');
      bioText.textContent = 'Scanning Face ID...';
      
      // Simulate biometric matching
      setTimeout(() => {
        bioWrapper.classList.remove('scanning');
        bioWrapper.classList.add('success');
        if (bioIcon) bioIcon.setAttribute('stroke', '#10b981'); // Change to green
        bioText.textContent = 'Payment Authorized! Processing ticket...';
        
        // Delay screen redirection
        setTimeout(async () => {
          // Hide Apple Pay Sheet
          document.getElementById('apple-pay-sheet').classList.add('hidden');

        try {
          if (isGroup) {
            // Initialize Split Payment dashboard via API
            const data = await apiFetch('/api/split/create', {
              method: 'POST',
              body: JSON.stringify({
                eventId: state.selectedEvent.id,
                sectorName: state.selectedSeat.name,
                price: state.selectedSeat.price,
                totalSeats: state.groupBuyCount
              })
            });
            state.credit = data.newCredit;
            updateCreditUI();
            await fetchTickets();
            await fetchActivities();
            startSplitPaymentFlow(data.sessionId);
          } else {
            // Complete direct booking: create ticket in DB
            const data = await apiFetch('/api/tickets/purchase', {
              method: 'POST',
              body: JSON.stringify({
                eventId: state.selectedEvent.id,
                sectorName: state.selectedSeat.name,
                price: state.selectedSeat.price,
                holderName: state.user.full_name,
                isGroup: false
              })
            });
            state.credit = data.newCredit;
            updateCreditUI();
            await fetchTickets();
            await fetchActivities();
            navigateTo('ticket-screen');
          }
        } catch (e) {
          showToast(e.message, true);
          // Reset Biometrics UI on failure so they can try again
          const bioIcon = document.getElementById('bio-face-id');
          const bioText = document.getElementById('bio-text');
          const bioWrapper = document.getElementById('face-id-trigger');
          if (bioWrapper) {
            bioWrapper.classList.remove('success', 'scanning');
          }
          if (bioIcon) {
            bioIcon.setAttribute('stroke', '#ffffff');
          }
          if (bioText) {
            bioText.textContent = 'Tap Face ID to authorize payment';
          }
        }
      }, 1000);
    }, 1500);
    });
  }

  // --------------------------------------------------------------------------
  // 6. SPLIT PAYMENT LIVE COUNTDOWN DASHBOARD
  // --------------------------------------------------------------------------
  
  let splitTimerInterval = null;

  async function startSplitPaymentFlow(sessionId) {
    try {
      const data = await apiFetch(`/api/split/status?sessionId=${sessionId}`);
      
      state.splitSessionId = sessionId;
      state.splitSession = {
        event: {
          id: data.session.eventId,
          title: data.session.eventTitle,
          location: data.session.eventLocation,
          bgImg: data.session.eventBgImg
        },
        seat: {
          name: data.session.sectorName,
          price: data.session.price
        },
        totalSeats: data.session.totalSeats,
        paidSeats: data.session.paidSeats,
        secondsRemaining: 45, // Demo accelerated timer
        members: data.members
      };

      // Enable tester panel friend triggers
      document.getElementById('sim-friend-pay-1').disabled = false;
      if (state.splitSession.totalSeats >= 3) {
        document.getElementById('sim-friend-pay-2').disabled = false;
      }
      document.getElementById('sim-trigger-expiry').disabled = false;

      // Set Dashboard labels
      document.getElementById('paid-count').textContent = data.session.paidSeats;
      document.getElementById('total-count').textContent = data.session.totalSeats;
      document.getElementById('share-link-url').value = `https://vivoo.cz/split/${sessionId}`;

      renderSplitFriendsList();
      startSplitTimer();
      navigateTo('split-dashboard-screen');
    } catch (e) {
      console.error('Failed to load split session:', e);
    }
  }

  function renderSplitFriendsList() {
    const container = document.getElementById('friends-list-container');
    container.innerHTML = '';

    if (!state.splitSession || !state.splitSession.members) return;

    state.splitSession.members.forEach(member => {
      const isHost = member.user_id === state.user.id;
      const isPaid = member.status === 'paid';
      const statusHtml = isPaid 
        ? `<div class="friend-status status-check">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
             <span>Paid</span>
           </div>`
        : `<div class="friend-status status-waiting">
             <span class="loading-dots">Waiting</span>
           </div>`;

      const avatarLetter = isHost ? 'ME' : member.name.charAt(0).toUpperCase();
      const avatarStyle = isHost ? 'style="background:var(--color-accent-crimson)"' : '';
      const nameText = isHost ? 'You (Organizer)' : member.name;

      const row = document.createElement('div');
      row.className = 'friend-row';
      row.innerHTML = `
        <div class="friend-info">
          <div class="friend-avatar" ${avatarStyle}>${avatarLetter}</div>
          <span class="friend-name">${nameText}</span>
        </div>
        ${statusHtml}
      `;
      container.appendChild(row);
    });
  }

  function startSplitTimer() {
    if (splitTimerInterval) clearInterval(splitTimerInterval);

    const timerDisp = document.getElementById('split-timer');
    const progressBar = document.getElementById('split-progress-bar');
    const totalDuration = state.splitSession.secondsRemaining;

    splitTimerInterval = setInterval(() => {
      if (!state.splitSession) {
        clearInterval(splitTimerInterval);
        return;
      }

      state.splitSession.secondsRemaining--;
      const rem = state.splitSession.secondsRemaining;

      // Translate 45 seconds total timer to a ticking 15:00 mock display
      // 45 seconds remaining = 15:00 minutes. 1 second of clock = 20 seconds.
      const mockMinutes = Math.floor((rem * 20) / 60);
      const mockSeconds = (rem * 20) % 60;
      
      timerDisp.textContent = `${mockMinutes.toString().padStart(2, '0')}:${mockSeconds.toString().padStart(2, '0')}`;
      
      // Update progress bar width
      const percentage = (rem / totalDuration) * 100;
      progressBar.style.width = `${percentage}%`;

      // Warning color triggers under 5 seconds left (approx 1:40 min mock remaining)
      if (rem <= 5) {
        timerDisp.classList.add('pulse-red');
      }

      if (rem <= 0) {
        clearInterval(splitTimerInterval);
        handleSplitTimeout();
      }
    }, 1000);
  }

  // Handle Split timer expiring (Release Seats back to inventory)
  function handleSplitTimeout() {
    clearInterval(splitTimerInterval);
    const session = state.splitSession;
    if (!session) return;

    // Release states and notify
    disableSplitSimButtons();
    
    // Check if friends paid or not
    const allPaid = session.friends.every(f => f.status === 'paid');
    
    if (allPaid) {
      // Completed group purchase successfully
      alert(`Success! Group booking complete. All ${state.groupBuyCount} tickets added to your wallet!`);
      // Add organizer ticket + friend tickets to the wallet
      for (let i = 0; i < state.groupBuyCount; i++) {
        createMockTicket(session.event, session.seat, true, i === 0 ? 'Organizer' : `Friend Guest ${i}`);
      }
    } else {
      // Timeout triggered without all paying. Release unpaid seats
      const paidNum = session.friends.filter(f => f.status === 'paid').length + 1; // organizers + paid friends
      
      alert(`Split Booking Expired!\nUnpaid seats released back to public inventory.\nYour single ticket was finalized and added to your wallet.`);
      
      // Add only organizer ticket to wallet
      createMockTicket(session.event, session.seat, false, 'Organizer');
    }

    state.splitSession = null;
    navigateTo('ticket-screen');
  }

  // Copy link action button
  document.getElementById('share-copy-btn').addEventListener('click', () => {
    const input = document.getElementById('share-link-url');
    input.select();
    input.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(input.value);
    
    // visual feedback (temporary hover state)
    const btn = document.getElementById('share-copy-btn');
    const oldIcon = btn.innerHTML;
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    setTimeout(() => { btn.innerHTML = oldIcon; }, 1500);
  });

  // Organizer decides to close split dashboard and wait in background
  document.getElementById('split-close-btn').addEventListener('click', () => {
    // We add organizer's pending ticket directly to wallet and let split run in background
    if (state.splitSession) {
      createMockTicket(state.splitSession.event, state.splitSession.seat, true, 'Organizer (Pending Group)');
    }
    navigateTo('ticket-screen');
  });

  function disableSplitSimButtons() {
    document.getElementById('sim-friend-pay-1').disabled = true;
    document.getElementById('sim-friend-pay-2').disabled = true;
    document.getElementById('sim-trigger-expiry').disabled = true;
  }

  // --------------------------------------------------------------------------
  // 7. SMART TICKETING & WALLET ENGINE (Animated QR Code & Apple Wallet)
  // --------------------------------------------------------------------------
  
  let qrRotationInterval = null;

  function createMockTicket(eventObj, seatObj, isGroupBooking = false, holderName = 'Organizer') {
    const newTicket = {
      id: `TICK-${Math.floor(100000 + Math.random() * 900000)}`,
      event: eventObj,
      seat: seatObj,
      holderName: holderName,
      isGroup: isGroupBooking,
      isScanned: false
    };

    state.tickets.push(newTicket);
  }

  let ticketCountdownInterval = null;
  let ticketCountdownTime = 60;
  let ticketQrState = 0;
  let hologramAnimFrame = null;

  function renderTicketsList() {
    const wrapper = document.getElementById('tickets-list-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = '';

    // Stop previous intervals
    if (ticketCountdownInterval) {
      clearInterval(ticketCountdownInterval);
      ticketCountdownInterval = null;
    }
    if (qrRotationInterval) {
      clearInterval(qrRotationInterval);
      qrRotationInterval = null;
    }
    if (hologramAnimFrame) {
      cancelAnimationFrame(hologramAnimFrame);
      hologramAnimFrame = null;
    }

    if (state.tickets.length === 0) {
      wrapper.innerHTML = `
        <div class="empty-tickets-view">
          <div class="empty-tickets-glow"></div>
          <div class="empty-tickets-card">
            <div class="empty-tickets-icon-wrapper">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                <rect x="2" y="4" width="20" height="16" rx="3" stroke="url(#wallet-glow-grad)" />
                <path d="M18 10h.01M18 14h.01" stroke-width="2" stroke-linecap="round" />
                <path d="M2 12c3 0 3-3 6-3s3 3 6 3 3-3 6-3v6c-3 0-3-3-6-3s-3 3-6 3-3-3-6-3v-6z" stroke="url(#wallet-glow-grad)" stroke-dasharray="2 1" />
                <defs>
                  <linearGradient id="wallet-glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="var(--color-accent-crimson)" />
                    <stop offset="100%" stop-color="var(--color-accent-magenta)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h3>Your Wallet is Empty</h3>
            <p>Secure active access passes from the Discovery Feed to unlock vertical video streams and geofence scanner check-ins.</p>
            <button type="button" class="btn btn-primary btn-block empty-explore-btn" id="btn-empty-explore">
              Explore Events
            </button>
          </div>
        </div>`;
      
      const exploreBtn = document.getElementById('btn-empty-explore');
      if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
          navigateTo('feed-screen');
        });
      }
      return;
    }

    if (!state.selectedTicketId) {
      // 1. RENDER PASSES LIST FOLDER
      const grid = document.createElement('div');
      grid.className = 'passes-folder-grid';
      
      state.tickets.forEach(ticket => {
        const card = document.createElement('div');
        card.className = 'pass-folder-card scroll-child';
        card.id = `pass-folder-card-${ticket.id}`;
        
        const priceValue = ticket.seat.price >= 800 ? 'ELITE' : ticket.seat.price >= 450 ? 'ADVANCED' : 'SPORT';
        const visuals = getDivisionVisuals(priceValue);
        
        card.innerHTML = `
          <div class="pass-folder-card-bg" style="background-image: url('${ticket.event.bgImg}');"></div>
          <div class="pass-folder-card-overlay"></div>
          <div class="pass-folder-card-badge ${visuals.tagClass}">${visuals.name}</div>
          <div class="pass-folder-card-details">
            <span class="pass-folder-card-serial">${ticket.id} • ${ticket.code || 'VVO-2026'}</span>
            <h3 class="pass-folder-card-title">${ticket.event.title}</h3>
            <div class="pass-folder-card-meta">
              <span>${ticket.event.location.split(',')[0]}</span>
              <strong>${ticket.seat.name.split(' (')[0]}</strong>
            </div>
          </div>
        `;
        
        card.addEventListener('click', () => {
          state.selectedTicketId = ticket.id;
          renderTicketsList();
        });
        
        grid.appendChild(card);
      });
      
      wrapper.appendChild(grid);
    } else {
      try {
        // 2. RENDER PASS DETAILS (WODCOMP / EVENTOO INSPIRED SECURE TICKET)
        const ticket = state.tickets.find(t => t.id === state.selectedTicketId);
        if (!ticket) {
          state.selectedTicketId = null;
          renderTicketsList();
          return;
        }

        // Initialize dynamic properties if missing
        ticket.gate = ticket.gate || 'GATE ' + String.fromCharCode(65 + Math.floor(Math.random() * 3));
        ticket.seatNum = ticket.seatNum || 'LANE ' + Math.floor(1 + Math.random() * 8);
        ticket.code = ticket.code || 'VVO-2026-' + ticket.id.split('-')[1];
        ticket.organizer = ticket.event.title.includes('Derby') ? 'AC Sparta Praha' : ticket.event.title.includes('Techno') ? 'Basement Syndicate' : 'ViVoo Events';
        ticket.division = ticket.seat.price >= 800 ? 'ELITE' : ticket.seat.price >= 450 ? 'ADVANCED' : 'SPORT';
        ticket.mintAddress = ticket.mintAddress || '';
        ticket.isAddedToWallet = ticket.isAddedToWallet || false;

        const visuals = getDivisionVisuals(ticket.division);

        const passDetails = document.createElement('div');
        passDetails.className = 'pass-details-view animate-fadeIn';

        passDetails.innerHTML = `
          <!-- Back Link -->
          <div class="pass-back-row">
            <button class="pass-back-btn" id="btn-pass-back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back to My Passes
            </button>
          </div>

          <!-- The Pass visual card -->
          <div class="pass-stub-wrapper">
            <!-- Floating Division Badge Pill -->
            <div class="pass-division-badge ${visuals.tagClass}">
              ${visuals.name}
            </div>

            <div class="pass-stub-panel ticket-stub-texture">
              <!-- Moving iridescent hologram canvas overlay -->
              <canvas id="pass-hologram-canvas" class="pass-hologram-canvas"></canvas>

              <!-- Ambient radial color glow behind QR -->
              <div class="pass-glow-ambient" style="background: radial-gradient(circle, ${visuals.glowColor}25 0%, transparent 70%);"></div>

              <!-- Secure Pass Header -->
              <div class="pass-header-meta">
                <div class="pass-header-left">
                  <span class="pass-dot-indicator ${visuals.dotClass}"></span>
                  <span class="pass-header-tag-text">${visuals.name} PASS</span>
                </div>
                <span class="pass-header-serial">${ticket.code}</span>
              </div>

              <!-- Event Hero info -->
              <div class="pass-event-hero">
                <h2 class="pass-event-title">${ticket.event.title}</h2>
                <div class="pass-event-subinfo">
                  <span class="pass-edition-badge">${ticket.event.tag.toUpperCase()}</span>
                  <span class="pass-event-location-text">${ticket.event.location}</span>
                </div>
                <div class="pass-event-date-row">
                  <span class="pass-date-label">Confirmed Attendance</span>
                </div>
              </div>

              <!-- SafeTix Rotating QR Container -->
              <div class="pass-qr-container">
                <div class="pass-qr-bracket-box">
                  <!-- Tech corner brackets -->
                  <div class="qr-bracket top-left"></div>
                  <div class="qr-bracket top-right"></div>
                  <div class="qr-bracket bottom-left"></div>
                  <div class="qr-bracket bottom-right"></div>

                  <!-- QR code visual block -->
                  <div class="pass-qr-image-wrapper">
                    <img id="secure-qr-img" src="" alt="Dynamic Secure QR">
                    
                    <!-- Scan laser line animation -->
                    <div class="scan-laser-line" style="background: linear-gradient(to bottom, transparent, ${visuals.accentColor}, transparent);"></div>

                    <!-- Twin-state label overlay -->
                    <div class="pass-twin-state-overlay">
                      <span id="qr-state-dot" class="state-dot"></span>
                      <span id="qr-state-label" class="state-text">STATE A</span>
                    </div>
                  </div>
                </div>

                <!-- Security Refresh Timer -->
                <div class="pass-timer-row">
                  <svg class="pass-timer-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                  <span class="pass-timer-text">
                    Access Code Refreshes In <strong id="pass-countdown-timer">00:60</strong>
                  </span>
                </div>
              </div>

              <!-- On-Chain Security Metadata Collapsible -->
              <div class="pass-collapsible-wrapper">
                <button class="pass-collapse-btn" id="btn-toggle-security-keys">
                  <span class="btn-collapse-title-left">
                    <span class="collapse-dot"></span>
                    On-Chain Security Keys
                  </span>
                  <span id="collapse-toggle-text">Show Keys</span>
                </button>
                
                <div class="pass-collapse-content hidden" id="security-keys-content">
                  <div class="key-field">
                    <label>SOLANA NFT MINT</label>
                    <strong id="onchain-nft-mint" class="selectable-key">${ticket.mintAddress || 'Not yet minted on Solana Testnet'}</strong>
                  </div>
                  <div class="key-field">
                    <label>ATHLETE PUBLIC KEY</label>
                    <strong class="selectable-key">VVOO-JAKUB-DOSTAL-SOL-KEY-2026</strong>
                  </div>
                  <div class="key-field">
                    <label>ACTIVE SIGNATURE (ED25519)</label>
                    <strong id="onchain-active-sig" class="selectable-key italic">-</strong>
                  </div>
                  <div class="key-row-grid">
                    <div class="key-field">
                      <label>VALIDITY EPOCH</label>
                      <strong id="onchain-validity-epoch">-</strong>
                    </div>
                    <div class="key-field">
                      <label>STATE NONCE</label>
                      <strong id="onchain-state-nonce">-</strong>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Perforation Line with Stub Cutouts -->
              <div class="pass-perforation-divider">
                <div class="stub-cutout left"></div>
                <div class="perforation-dashed-line"></div>
                <div class="stub-cutout right"></div>
              </div>

              <!-- Info details grid -->
              <div class="pass-info-details-grid">
                <div class="info-details-box">
                  <span class="info-box-label">GATE (VSTUP)</span>
                  <strong class="info-box-value">${ticket.gate}</strong>
                </div>
                <div class="info-details-box">
                  <span class="info-box-label">KATEGORIE (SECTOR)</span>
                  <strong class="info-box-value">${ticket.seat.name.split(' (')[0]}</strong>
                </div>
                <div class="info-details-box">
                  <span class="info-box-label">ORGANIZÁTOR</span>
                  <strong class="info-box-value">${ticket.organizer}</strong>
                </div>
                <div class="info-details-box">
                  <span class="info-box-label">LANE / ROW (DRÁHA)</span>
                  <strong class="info-box-value">${ticket.seatNum}</strong>
                </div>
              </div>

              <!-- Czech Description block -->
              <div class="pass-description-block">
                <span class="desc-header">INFORMACE O ZÁVODU</span>
                <div class="desc-content">
                  This entry ticket certifies registration for ${ticket.event.title}. Access code rotates on-chain every 60 seconds to prevent unauthorized copy. Present this secure QR at the stadium gate.
                </div>
              </div>

              <!-- Pass Action buttons -->
              <div class="pass-actions-area">
                ${!ticket.mintAddress ? `
                  <button class="btn btn-mint-nft-solana" id="btn-mint-ticket-nft">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                    Mint Ticket NFT on Solana Testnet
                  </button>
                ` : `
                  <button class="btn btn-solana-explorer-link" id="btn-sol-explorer">
                    View NFT on Solana Explorer
                  </button>
                `}

                <button class="btn btn-refund-resale btn-resale-detail" id="btn-refund-ticket">
                  1-Click Resale & 80% Refund
                </button>

                <button class="btn btn-add-apple-wallet" id="btn-add-wallet">
                  ${ticket.isAddedToWallet ? '✓ Added to Apple Wallet' : 'Add to Apple Wallet'}
                </button>
              </div>
            </div>
          </div>
        `;

        wrapper.appendChild(passDetails);

        // Back button click listener
        document.getElementById('btn-pass-back').onclick = () => {
          state.selectedTicketId = null;
          renderTicketsList();
        };

        // Toggle collapsible keys
        document.getElementById('btn-toggle-security-keys').onclick = () => {
          const content = document.getElementById('security-keys-content');
          const text = document.getElementById('collapse-toggle-text');
          if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            text.textContent = 'Hide Keys';
          } else {
            content.classList.add('hidden');
            text.textContent = 'Show Keys';
          }
        };

        // Mint Solana NFT Simulation
        const btnMint = document.getElementById('btn-mint-ticket-nft');
        if (btnMint) {
          btnMint.onclick = () => {
            btnMint.disabled = true;
            btnMint.innerHTML = `
              <svg class="pass-timer-icon animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              Minting on Solana Testnet...
            `;
            
            setTimeout(() => {
              ticket.mintAddress = 'SOL-MINT-' + Array.from({length: 12}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
              alert('NFT Minted successfully on Solana Testnet!');
              renderTicketsList();
            }, 1800);
          };
        }

        // View Solana Explorer
        const btnExplorer = document.getElementById('btn-sol-explorer');
        if (btnExplorer) {
          btnExplorer.onclick = () => {
            window.open(`https://explorer.solana.com/address/${ticket.mintAddress}?cluster=testnet`, '_blank');
          };
        }

        // Apple Wallet click listener
        const btnWallet = document.getElementById('btn-add-wallet');
        if (btnWallet) {
          btnWallet.onclick = () => {
            ticket.isAddedToWallet = true;
            btnWallet.textContent = '✓ Added to Apple Wallet';
            btnWallet.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            btnWallet.style.background = 'rgba(16, 185, 129, 0.1)';
            btnWallet.style.color = '#10b981';
            alert(`${ticket.event.title} ticket pass added to Apple Wallet!`);
          };
        }

        // Resale click listener
        document.getElementById('btn-refund-ticket').onclick = () => {
          if(confirm('Are you sure you want to list this ticket on Fan Exchange for an 80% refund?')) {
            processTicketResaleRefund(ticket.id);
          }
        };

        // Start Hologram shader canvas loop
        const holoCanvas = document.getElementById('pass-hologram-canvas');
        if (holoCanvas) {
          initPassHologram(holoCanvas, ticket.division);
        }

        // Start Countdown and dynamic QR rotation loop
        ticketCountdownTime = 60;
        ticketQrState = 0;
        updateDynamicQRCode(ticket);

        ticketCountdownInterval = setInterval(() => {
          ticketQrState = ticketQrState === 0 ? 1 : 0;
          ticketCountdownTime--;
          if (ticketCountdownTime <= 0) {
            ticketCountdownTime = 60;
          }
          updateDynamicQRCode(ticket);
        }, 1000);
      } catch (err) {
        console.error('[renderTicketsList Error]', err);
      }
    }
  }

  function getDivisionVisuals(division) {
    switch (division) {
      case 'ELITE':
        return {
          name: 'ELITE DIVISION',
          dotClass: 'div-dot-elite',
          tagClass: 'div-tag-elite',
          glowColor: '#fbbf24',
          accentColor: '#fbbf24'
        };
      case 'ADVANCED':
        return {
          name: 'ADVANCED DIVISION',
          dotClass: 'div-dot-advanced',
          tagClass: 'div-tag-advanced',
          glowColor: '#f472b6',
          accentColor: '#f472b6'
        };
      default: // SPORT
        return {
          name: 'SPORT DIVISION',
          dotClass: 'div-dot-sport',
          tagClass: 'div-tag-sport',
          glowColor: '#10b981',
          accentColor: '#10b981'
        };
    }
  }

  function initPassHologram(canvas, division) {
    let gl = null;
    try {
      gl = canvas.getContext('webgl', { alpha: false, depth: false });
    } catch (e) {
      // Ignore fallback
    }

    // Color multipliers and intensities from Eventoo-app
    let mult = { r: 0.5, g: 0.8, b: 1.2 }; // Default / SPORT / NEWBIES
    let intensity = 0.35;

    if (division === 'ELITE') {
      mult = { r: 1.2, g: 1.0, b: 0.3 };
      intensity = 0.4;
    } else if (division === 'ADVANCED') {
      mult = { r: 1.3, g: 0.3, b: 0.9 };
      intensity = 0.38;
    } else if (division === 'SPORT') {
      mult = { r: 0.2, g: 1.3, b: 0.8 };
      intensity = 0.35;
    }

    let ro = null;

    if (gl) {
      // WebGL path
      const vsSource = `
        attribute vec2 a_position;
        varying vec2 v_texCoord;
        void main() {
          v_texCoord = a_position * 0.5 + 0.5;
          gl_Position = vec4(a_position, 0.0, 1.0);
        }
      `;

      const fsSource = `
        precision highp float;
        varying vec2 v_texCoord;
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec3 u_multiplier;
        uniform float u_intensity;

        void main() {
          vec2 uv = v_texCoord;
          vec2 p = -1.0 + 2.0 * uv;
          p.x *= u_resolution.x / u_resolution.y;

          float t = u_time * 0.4;
          
          // Iridescent/Holographic noise calculations
          float r = 0.5 + 0.5 * sin(p.x * 2.2 + t + cos(p.y * 2.8 + t));
          float g = 0.5 + 0.5 * sin(p.y * 1.8 - t + sin(p.x * 3.2 + t));
          float b = 0.5 + 0.5 * sin((p.x + p.y) * 2.0 + t * 1.3);
          
          // Liquid metal shimmering details
          float shimmer = sin(p.x * 12.0 + p.y * 12.0 + t * 4.5);
          shimmer = smoothstep(0.84, 1.0, shimmer) * 0.15;
          
          vec3 baseColor = vec3(r, g, b) * u_multiplier;
          baseColor += shimmer;
          
          baseColor *= u_intensity;
          baseColor += vec3(0.04, 0.04, 0.08); // Ambient deep navy lift

          gl_FragColor = vec4(baseColor, 1.0);
        }
      `;

      const createShader = (glCtx, type, source) => {
        const shader = glCtx.createShader(type);
        if (!shader) return null;
        glCtx.shaderSource(shader, source);
        glCtx.compileShader(shader);
        if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
          console.warn("Shader compile error:", glCtx.getShaderInfoLog(shader));
          glCtx.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

      if (vs && fs) {
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
          gl.useProgram(program);

          const positionBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
          gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
          );

          const positionLocation = gl.getAttribLocation(program, "a_position");
          gl.enableVertexAttribArray(positionLocation);
          gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

          const timeLocation = gl.getUniformLocation(program, "u_time");
          const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
          const multiplierLocation = gl.getUniformLocation(program, "u_multiplier");
          const intensityLocation = gl.getUniformLocation(program, "u_intensity");

          const resize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width || 350;
            canvas.height = rect.height || 600;
            gl.viewport(0, 0, canvas.width, canvas.height);
          };

          resize();
          ro = new ResizeObserver(() => resize());
          ro.observe(canvas);

          const render = (time) => {
            if (!gl) return;
            gl.uniform1f(timeLocation, time * 0.001);
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
            gl.uniform3f(multiplierLocation, mult.r, mult.g, mult.b);
            gl.uniform1f(intensityLocation, intensity);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            hologramAnimFrame = requestAnimationFrame(render);
          };

          hologramAnimFrame = requestAnimationFrame(render);
        }
      }
    } else {
      // 2D fallback path
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let t = 0;
        const resize = () => {
          const rect = canvas.getBoundingClientRect();
          const dpr = window.devicePixelRatio || 1;
          canvas.width = (rect.width || 350) * dpr;
          canvas.height = (rect.height || 600) * dpr;
          ctx.scale(dpr, dpr);
        };

        resize();
        ro = new ResizeObserver(() => resize());
        ro.observe(canvas);

        const render2D = () => {
          t += 0.015;
          const w = canvas.width / (window.devicePixelRatio || 1);
          const h = canvas.height / (window.devicePixelRatio || 1);

          ctx.clearRect(0, 0, w, h);

          // Render multi-layered liquid mesh approximation
          const cx = w / 2 + Math.sin(t) * 90;
          const cy = h / 2 + Math.cos(t * 0.7) * 130;
          const grad = ctx.createRadialGradient(cx, cy, 30, w / 2, h / 2, h * 0.75);

          const r = Math.floor((128 + 127 * Math.sin(t)) * mult.r);
          const g = Math.floor((128 + 127 * Math.cos(t * 0.6)) * mult.g);
          const b = Math.floor((128 + 127 * Math.sin(t * 0.4 + 1)) * mult.b);

          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${intensity})`);
          grad.addColorStop(0.5, "rgba(22, 19, 45, 0.45)");
          grad.addColorStop(1, "rgba(9, 9, 12, 0.98)");

          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Rotating specular light line
          const shimmerY = ((t * 80) % (h + 200)) - 100;
          const shimmerGrad = ctx.createLinearGradient(0, shimmerY, w, shimmerY + 60);
          shimmerGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          shimmerGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)');
          shimmerGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = shimmerGrad;
          ctx.fillRect(0, 0, w, h);

          hologramAnimFrame = requestAnimationFrame(render2D);
        };

        hologramAnimFrame = requestAnimationFrame(render2D);
      }
    }

    canvas._cleanup = () => {
      if (ro) ro.disconnect();
      if (hologramAnimFrame) {
        cancelAnimationFrame(hologramAnimFrame);
      }
      gl = null;
    };
  }

  function updateDynamicQRCode(ticket) {
    const qrImg = document.getElementById('secure-qr-img');
    const qrDot = document.getElementById('qr-state-dot');
    const qrLabel = document.getElementById('qr-state-label');
    const timerText = document.getElementById('pass-countdown-timer');

    const epochLabel = document.getElementById('onchain-validity-epoch');
    const nonceLabel = document.getElementById('onchain-state-nonce');
    const sigLabel = document.getElementById('onchain-active-sig');

    if (!qrImg) return;

    // Format Countdown String
    const formattedSeconds = String(ticketCountdownTime).padStart(2, '0');
    if (timerText) timerText.textContent = `00:${formattedSeconds}`;

    // Update state visuals
    if (qrDot) {
      qrDot.className = `state-dot ${ticketQrState === 0 ? 'bg-[#00eefc]' : 'bg-pink-500'}`;
    }
    if (qrLabel) {
      qrLabel.textContent = `STATE ${ticketQrState === 0 ? 'A' : 'B'}`;
    }

    const currentEpoch = Math.floor(Date.now() / 60000) * 60000;
    const currentSig = "sig_" + Math.random().toString(36).substring(2, 12).toUpperCase();

    // Populate Key Metadatas
    if (epochLabel) epochLabel.textContent = currentEpoch;
    if (nonceLabel) nonceLabel.textContent = `Nonce: ${ticketQrState}`;
    if (sigLabel) sigLabel.textContent = currentSig;

    // Generate real QR payload
    const tokenPayload = {
      m: ticket.mintAddress || ticket.id,
      o: "Jakub Dostál (0xVVOO)",
      t: currentEpoch,
      n: ticketQrState,
      s: currentSig
    };

    try {
      const qr = qrcode(10, 'L');
      qr.addData(JSON.stringify(tokenPayload));
      qr.make();
      const qrDataUrl = qr.createDataURL(6);
      qrImg.src = qrDataUrl;
    } catch (e) {
      console.error('Failed to update secure QR code:', e);
    }
  }

  // 1-Click resale refund process
  function processTicketResaleRefund(ticketId) {
    const idx = state.tickets.findIndex(t => t.id === ticketId);
    if (idx === -1) return;
    
    const ticket = state.tickets[idx];
    const refundValue = Math.round(ticket.seat.price * 0.8);

    if (confirm(`Resell this ticket?\nWe will return it to inventory and credit your cashless balance +${refundValue} CZK (80% value refund).`)) {
      // Visual feedback transition
      const ticketCard = document.getElementById(`ticket-card-${ticketId}`);
      if (ticketCard) {
        ticketCard.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        ticketCard.style.transform = 'scale(0.8) translateY(-100px)';
        ticketCard.style.opacity = '0';
      }

      setTimeout(() => {
        // Add credit refund
        updateCashlessCredits(refundValue);
        
        // Remove ticket
        state.tickets.splice(idx, 1);
        
        // Refresh ticket wallet screen
        renderTicketsList();
        
        // Float fly animation simulation on credit badge
        animateCreditUpdate(refundValue);
      }, 500);
    }
  }

  // --------------------------------------------------------------------------
  // 8. UGC LOOP & RETENTION FLOW (Post-Event UGC Curation)
  // --------------------------------------------------------------------------
  
  const notificationBanner = document.getElementById('notification-banner');
  const closeNotification = document.getElementById('close-notification');
  const simNotificationBtn = document.getElementById('sim-send-notification');
  const simScanBtn = document.getElementById('sim-scan-ticket');
  const prefilledClipBtns = document.querySelectorAll('.prefilled-clip-btn');
  const ugcFileInput = document.getElementById('ugc-file-input');
  const dragZone = document.getElementById('ugc-drag-zone');
  const submitUgcBtn = document.getElementById('ugc-submit-btn');

  let selectedUgcType = null;

  // Gate Scan Click Simulator
  simScanBtn.addEventListener('click', async () => {
    // Requires a ticket to scan
    if (state.tickets.length === 0) {
      alert('Please purchase a ticket first before simulating gate scan entry!');
      return;
    }

    try {
      await apiFetch('/api/tickets/scan', { method: 'POST' });
      await fetchTickets();
      alert('Security Gate: Ticket scanned successfully. Geofence activated: User has entered the venue.');
      
      // Advance simulation controls
      simNotificationBtn.disabled = false;
    } catch (e) {
      console.error('Failed to scan ticket:', e);
    }
  });

  // Next-day UGC reminder notification click
  simNotificationBtn.addEventListener('click', () => {
    notificationBanner.classList.remove('hidden');
    
    // Automatically close notification after 15 seconds
    setTimeout(() => {
      notificationBanner.classList.add('hidden');
    }, 15000);
  });

  closeNotification.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationBanner.classList.add('hidden');
  });

  // Clicking push notification opens UGC upload flow
  notificationBanner.addEventListener('click', () => {
    notificationBanner.classList.add('hidden');
    
    // Open UGC Screen
    resetUgcUploadZone();
    navigateTo('ugc-upload-screen');
  });

  // UGC select clip triggers
  prefilledClipBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      prefilledClipBtns.forEach(b => b.classList.remove('btn-primary'));
      btn.classList.add('btn-primary');
      
      selectedUgcType = btn.dataset.type;
      submitUgcBtn.disabled = false;
    });
  });

  // Upload Zone trigger drag properties
  dragZone.addEventListener('click', () => {
    ugcFileInput.click();
  });

  ugcFileInput.addEventListener('change', () => {
    if (ugcFileInput.files.length > 0) {
      selectedUgcType = 'music'; // default fallback clip simulation
      submitUgcBtn.disabled = false;
      dragZone.querySelector('span').textContent = ugcFileInput.files[0].name;
    }
  });

  // Drag over states
  dragZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragZone.classList.add('dragover');
  });

  dragZone.addEventListener('dragleave', () => {
    dragZone.classList.remove('dragover');
  });

  dragZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dragZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      selectedUgcType = 'music';
      submitUgcBtn.disabled = false;
      dragZone.querySelector('span').textContent = e.dataTransfer.files[0].name;
    }
  });

  // UGC Video Upload execution
  submitUgcBtn.addEventListener('click', () => {
    if (!selectedUgcType) return;

    // Show uploading progression UI
    document.getElementById('ugc-upload-idle').classList.add('hidden');
    document.getElementById('ugc-upload-running').classList.remove('hidden');
    submitUgcBtn.disabled = true;

    let progress = 0;
    const progressEl = document.getElementById('ugc-upload-progress');
    
    const interval = setInterval(() => {
      progress += 10;
      progressEl.style.width = `${progress}%`;
      progressEl.textContent = `${progress}%`;

      if (progress >= 100) {
        clearInterval(interval);
        
        // Show success
        document.getElementById('ugc-upload-running').classList.add('hidden');
        document.getElementById('ugc-upload-success').classList.remove('hidden');

        // Execute UGC Loop logic: Reward User and Curate Video back into feed
        handleUgcUploadSuccess();
      }
    }, 150);
  });

  async function handleUgcUploadSuccess() {
    // 1. Reward credit in DB
    await updateCashlessCredits(100, 'UGC Video Upload Reward', 'reward');
    animateCreditUpdate(100);

    // 2. Add video UGC event block to top of discovery feed list
    let sampleUgcVid = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';
    let vibeTitle = 'Concert Crowds Vibe check';
    
    if (selectedUgcType === 'sport') {
      sampleUgcVid = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4';
      vibeTitle = 'Epic Sector B goal celebration';
    }

    const ugcFeedItem = {
      id: `ugc-${Date.now()}`,
      title: vibeTitle,
      tag: selectedUgcType === 'sport' ? 'Sport' : 'Music',
      vibe: selectedUgcType,
      location: selectedUgcType === 'sport' ? 'epet ARENA Prague' : 'Hala 13 Prague',
      date: 'Simulated UGC Vibe Loop',
      lineup: 'Fan Video Upload',
      weather: { temp: '20°C', text: 'Crowd Vibe', icon: 'clear' },
      videoUrl: sampleUgcVid,
      bgImg: selectedUgcType === 'sport' ? './images/derby.jpg' : './images/techno.jpg',
      priceMin: 300,
      priceMax: 1200,
      isUGC: true,
      sectors: []
    };

    // Prepend to memory events array
    eventsData.unshift(ugcFeedItem);
    
    // Re-filter active feed
    if (state.currentVibe === 'all' || state.currentVibe === selectedUgcType) {
      activeFeedEvents = [...eventsData];
      if (state.currentVibe !== 'all') {
        activeFeedEvents = eventsData.filter(e => e.vibe === state.currentVibe);
      }
    }

    // Refresh discovery feed screen elements
    renderFeed();
  }

  function resetUgcUploadZone() {
    document.getElementById('ugc-upload-idle').classList.remove('hidden');
    document.getElementById('ugc-upload-running').classList.add('hidden');
    document.getElementById('ugc-upload-success').classList.add('hidden');
    submitUgcBtn.disabled = true;
    selectedUgcType = null;
    prefilledClipBtns.forEach(btn => btn.classList.remove('btn-primary'));
    dragZone.querySelector('span').textContent = 'Select event video clip (MP4)';
  }

  // --------------------------------------------------------------------------
  // 9. INTERACTIVE SIMULATOR (Side control deck dashboard)
  // --------------------------------------------------------------------------
  
  const testCreditVal = document.getElementById('tester-credit');
  const headerCreditBadge = document.getElementById('header-credit-badge');

  async function updateCashlessCredits(amountChange, title = 'Credits Top Up', type = 'reward') {
    if (!state.user) return;
    
    try {
      const data = await apiFetch('/api/wallet/update', {
        method: 'POST',
        body: JSON.stringify({ amount: amountChange, title, type })
      });
      state.credit = data.newCredit;
      
      // Update UI elements
      if (testCreditVal) {
        testCreditVal.textContent = state.credit;
      }
      const feedHeaderCredit = document.getElementById('feed-header-credit-badge');
      if (feedHeaderCredit) {
        feedHeaderCredit.textContent = `${state.credit} CZK`;
      }
      const profileWalletCredit = document.getElementById('profile-wallet-credit-stat');
      if (profileWalletCredit) {
         profileWalletCredit.textContent = state.credit;
      }
      
      // Re-fetch activities log
      await fetchActivities();
    } catch (e) {
      console.error('Failed to update cashless credits in DB:', e);
    }
  }

  // Credit Badge Init is deferred to authentication loginSuccess.

  // Sim Button: Add Credit
  document.getElementById('sim-add-credit-btn').addEventListener('click', () => {
    updateCashlessCredits(200);
    animateCreditUpdate(200);
  });

  // Profile Page: Top Up Button
  const profileTopupBtn = document.getElementById('btn-wallet-topup');
  if (profileTopupBtn) {
    profileTopupBtn.addEventListener('click', () => {
      updateCashlessCredits(200);
      animateCreditUpdate(200);
      
      const activeScreen = document.querySelector('.app-screen.active');
      if (activeScreen) {
        const toast = document.createElement('div');
        toast.style.position = 'absolute';
        toast.style.bottom = '100px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        toast.style.background = 'rgba(16, 185, 129, 0.95)';
        toast.style.color = '#fff';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '20px';
        toast.style.fontFamily = 'var(--font-family-title)';
        toast.style.fontSize = '0.75rem';
        toast.style.fontWeight = '700';
        toast.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.4)';
        toast.style.zIndex = '1000';
        toast.style.opacity = '0';
        toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        toast.textContent = '+200 CZK Top-up Success!';
        
        activeScreen.appendChild(toast);
        
        // Trigger reflow
        toast.offsetHeight;
        
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
        
        setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.transform = 'translateX(-50%) translateY(-20px)';
          setTimeout(() => {
            toast.remove();
          }, 300);
        }, 1500);
      }
    });
  }

  // Sim Button: Friend 1 Pays
  document.getElementById('sim-friend-pay-1').addEventListener('click', async () => {
    if (!state.splitSession || !state.splitSessionId) return;
    
    // Find Honza
    const friend = state.splitSession.members.find(m => m.name === 'Honza');
    if (friend && friend.status !== 'paid') {
      try {
        await apiFetch('/api/split/pay', {
          method: 'POST',
          body: JSON.stringify({ sessionId: state.splitSessionId, memberId: friend.id })
        });
        
        // Refresh session status from server
        await startSplitPaymentFlow(state.splitSessionId);
        checkAllSplitPaid();
      } catch (e) {
        console.error('Failed to simulate friend pay:', e);
      }
    }
  });

  // Sim Button: Friend 2 Pays
  document.getElementById('sim-friend-pay-2').addEventListener('click', async () => {
    if (!state.splitSession || !state.splitSessionId) return;
    
    // Find Karel
    const friend = state.splitSession.members.find(m => m.name === 'Karel');
    if (friend && friend.status !== 'paid') {
      try {
        await apiFetch('/api/split/pay', {
          method: 'POST',
          body: JSON.stringify({ sessionId: state.splitSessionId, memberId: friend.id })
        });
        
        // Refresh session status from server
        await startSplitPaymentFlow(state.splitSessionId);
        checkAllSplitPaid();
      } catch (e) {
        console.error('Failed to simulate friend pay:', e);
      }
    }
  });

  async function checkAllSplitPaid() {
    const allPaid = state.splitSession.members.every(m => m.status === 'paid');
    if (allPaid) {
      clearInterval(splitTimerInterval);
      disableSplitSimButtons();
      
      setTimeout(async () => {
        alert('All friends paid! Group buy completed successfully. Adding tickets to wallet...');
        
        // Re-fetch tickets from DB
        await fetchTickets();
        
        state.splitSession = null;
        state.splitSessionId = null;
        navigateTo('ticket-screen');
      }, 1000);
    }
  }

  // Sim Button: Expiry split timeout trigger
  document.getElementById('sim-trigger-expiry').addEventListener('click', () => {
    if (!state.splitSession) return;
    state.splitSession.secondsRemaining = 1;
  });

  // Sim Button: Backstage pass lottery trigger
  document.getElementById('sim-trigger-lottery').addEventListener('click', () => {
    const roll = Math.random();
    if (roll > 0.7) {
      alert('🎟️ CONGRATULATIONS!\nYou won a Backstage VIP Pass upgrade for your next event!');
    } else {
      alert('Better luck next time! Try uploading more UGC memories clips to earn entry tickets.');
    }
  });

  // Sim Reset states
  document.getElementById('sim-reset-all').addEventListener('click', () => {
    if (confirm('Reset simulator to default starting values?')) {
      // Clear split timer
      if (splitTimerInterval) clearInterval(splitTimerInterval);
      
      state.credit = 400;
      updateCashlessCredits(0);

      state.tickets = [];
      state.splitSession = null;
      state.currentPlayingIndex = 0;
      
      // Reset database events to original 3
      activeFeedEvents = [...eventsData.filter(e => !e.isUGC)];
      
      // UI resets
      disableSplitSimButtons();
      resetUgcUploadZone();
      renderFeed();
      
      navigateTo('feed-screen');
      alert('Simulator reset successful.');
    }
  });

  // Custom visual micro-animation helper for flying coins/refunding values
  function animateCreditUpdate(amount) {
    const badge = document.getElementById('feed-header-profile-btn');
    if (!badge) return;
    badge.style.transform = 'scale(1.2)';
    badge.style.borderColor = 'var(--color-accent-crimson)';
    
    setTimeout(() => {
      badge.style.transform = 'scale(1)';
      badge.style.borderColor = 'rgba(255, 255, 255, 0.05)';
    }, 800);
  }

});
