var kangoContentNotificationStatus={NEW:0,VISIBLE:1,HIDDEN:2},Event=function(){function a(d){d=d||window.event;if(d.isFixed)return d;d.isFixed=!0;d.preventDefault=d.preventDefault||function(){this.returnValue=!1};d.stopPropagation=d.stopPropagaton||function(){this.cancelBubble=!0};d.target||(d.target=d.srcElement);if(!d.relatedTarget&&d.fromElement)try{d.relatedTarget=d.fromElement==d.target?d.toElement:d.fromElement}catch(b){}if(null==d.pageX&&null!=d.clientX){var a=document.documentElement,c=document.body;
d.pageX=d.clientX+(a&&a.scrollLeft||c&&c.scrollLeft||0)-(a.clientLeft||0);d.pageY=d.clientY+(a&&a.scrollTop||c&&c.scrollTop||0)-(a.clientTop||0)}!d.which&&d.button&&(d.which=d.button&1?1:d.button&2?3:d.button&4?2:0);return d}function b(d){d=a(d);var b=this.custom_universal_events[d.type],c;for(c in b)!1===b[c].call(this,d)&&(d.preventDefault(),d.stopPropagation())}var c=0;return{add:function(a,e,f){a.setInterval&&(a!=window&&!a.frameElement)&&(a=window);f.guid||(f.guid=++c);a.custom_universal_events||
(a.custom_universal_events={},a.handle=function(c){if("undefined"!==typeof Event)return b.call(a,c)});a.custom_universal_events[e]||(a.custom_universal_events[e]={},a.addEventListener?a.addEventListener(e,a.handle,!1):a.attachEvent&&a.attachEvent("on"+e,a.handle));a.custom_universal_events[e][f.guid]=f},remove:function(a,b,c){var g=a.custom_universal_events&&a.custom_universal_events[b];if(g){delete g[c.guid];for(var h in g)return;a.removeEventListener?a.removeEventListener(b,a.handle,!1):a.detachEvent&&
a.detachEvent("on"+b,a.handle);delete a.custom_universal_events[b];for(h in a.custom_universal_events)return;delete a.handle;delete a.custom_universal_events}}}}(),domHelper=function(){var a={Fragment:function(){this.initialize(arguments)}};a.Fragment.prototype={initialize:function(){this._frag=document.createDocumentFragment();this._nodes=[]},appendSource:function(a){var c=document.createElement("div");c.innerHTML=a;for(a=0;a<c.childNodes.length;a++){var d=c.childNodes[a].cloneNode(!0);this._nodes.push(d);
this._frag.appendChild(d)}},appendTo:function(a){a&&a.appendChild(this._frag)},insertAsFirst:function(a){a&&a.insertBefore(this._frag,a.firstChild)},insertBefore:function(a,c){a&&c&&a.insertBefore(this._frag,c)},reclaim:function(){for(var a=0;a<this._nodes.length;a++)this._frag.appendChild(this._nodes[a])}};a.appendHtmlToElement=function(b,c){var d=new a.Fragment;d.appendSource(c);d.appendTo(b)};a.insertHtmlAsFirstElement=function(b,c){var d=new a.Fragment;d.appendSource(c);d.insertAsFirst(b)};a.removeAllChilds=
function(a){"string"==typeof a&&(a=document.getElementById(a));if("undefined"==typeof a||null==a)return!1;for(;a.hasChildNodes();)a.removeChild(a.firstChild);return!0};return a}(),sizeHelper=function(){return{clientSize:function(){var a=document,b=document.getElementsByTagName("body")[0];return{width:(null==a.compatMode||"undefined"==typeof a.compatMode||"CSS1Compat"==a.compatMode)&&a.documentElement&&a.documentElement.clientWidth||b&&b.clientWidth,height:(null==a.compatMode||"undefined"==typeof a.compatMode||
"CSS1Compat"==a.compatMode)&&a.documentElement&&a.documentElement.clientHeight||b&&b.clientHeight}},scrollOffset:function(){var a=document,b=document.getElementsByTagName("body")[0];return{left:a.documentElement&&a.documentElement.scrollLeft||b&&b.scrollLeft,top:a.documentElement&&a.documentElement.scrollTop||b&&b.scrollTop}},scrollSize:function(){var a=document,b=document.getElementsByTagName("body")[0];return{width:a.documentElement&&a.documentElement.scrollWidth||b&&b.scrollWidth,height:a.documentElement&&
a.documentElement.scrollHeight||b&&b.scrollHeight}}}}();function getTemplate(a,b){kango.xhr.send({url:"kango-ui/"+a+".tmpl",mimeType:"text/plain"},function(a){b(a.response)})}
var cssHelper=function(){var a={hasClass:function(a,c){return null==a?!1:a.className.match(RegExp("(\\s|^)"+c+"(\\s|$)"))},addClass:function(b,c){null!=b&&!a.hasClass(b,c)&&(b.className+=" "+c)},removeClass:function(b,c){null!=b&&a.hasClass(b,c)&&(b.className=b.className.replace(RegExp("(\\s|^)"+c+"(\\s|$)")," "))},addCss:function(a,c){if(!c||!document.getElementById(c)){var d=document.createElement("style");d.type="text/css";c&&(d.id=c);d.styleSheet?d.styleSheet.cssText=a:d.appendChild(document.createTextNode(a));
var e=null,f=document.getElementsByTagName("head");0<f.length?e=f[0]:(f=document.getElementsByTagName("body"),0<f.length&&(e=f[0]));null!=e&&e.appendChild(d)}}};return a}(),appendHtmlToElement=function(a,b){var c=new domHelper.Fragment;c.appendSource(b);c.appendTo(a)};
function KangoContentNotification(a,b){this.id=a.id;this._htmlTemplate=b;this._hideTimeout=a.hideTimeout||0;this.bDoNotBindContentClick=a.bDoNotBindContentClick;this.width=a.width||"300px";this._hideTimer=null;this.elementWidth=this.elementHeight=this.elementTop=this.elementLeft=0;this.status=kangoContentNotificationStatus.NEW;this._createNotificationElement(a);this.calculateOwnSize();this._bindEnevts()}
KangoContentNotification.prototype._createNotificationElement=function(a){var b=function(a){return a.replace(/[$&"<>]/g,function(a){return b.replacements[a]})};b.replacements={$:"$$","&":"&amp;",'"':"&quot;","<":"&lt;",">":"&gt;"};var c=this._htmlTemplate.replace(/{id}/gi,b(this.id)),c=c.replace("{iconUrl}",a.icon||"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="),c=c.replace("{caption}",b(a.caption)),c=c.replace("{title}",b(a.title)),c=c.replace("{text}",b(a.text));appendHtmlToElement(document.getElementsByTagName("body")[0],
c);document.getElementById(this.id).style.width=this.width};KangoContentNotification.prototype.destroyNotificationElement=function(){var a=document.getElementById(this.id);a.parentNode.removeChild(a)};
KangoContentNotification.prototype._bindEnevts=function(){var a=document.getElementById(this.id),b=this;!0!==this.bDoNotBindContentClick&&Event.add(a,"click",function(a){kango.dispatchMessage("KangoNotification_click",b.id);a.stopPropagation();a.preventDefault()});a=document.getElementById(this.id+"_close");Event.add(a,"click",function(a){b.close();a.stopPropagation();a.preventDefault()})};
KangoContentNotification.prototype.calculateOwnSize=function(){var a=document.getElementById(this.id);this.elementHeight=a.offsetHeight;this.elementWidth=a.offsetWidth};KangoContentNotification.prototype.setPosition=function(a,b){this.elementLeft=a;this.elementTop=b;var c=document.getElementById(this.id);c.style.left=this.elementLeft+"px";c.style.top=this.elementTop+"px"};
KangoContentNotification.prototype.show=function(){var a=document.getElementById(this.id);cssHelper.addClass(a,"kg-content-notification-shown");this.status=kangoContentNotificationStatus.VISIBLE;0!==this._hideTimeout&&this._startHideTimeout();kango.dispatchMessage("KangoNotification_show",this.id)};KangoContentNotification.prototype.hide=function(){var a=document.getElementById(this.id);a&&(a.style.display="none");this.status=kangoContentNotificationStatus.HIDDEN};
KangoContentNotification.prototype.close=function(){this.hide();kango.dispatchMessage("KangoNotification_close",this.id)};KangoContentNotification.prototype._startHideTimeout=function(){var a=this;this._hideTimer=window.setTimeout(function(){a.hide()},this._hideTimeout)};
var contentNotificationManager={_notificationTemplate:"",_notifications:[],recalculatePositions:function(){for(var a=sizeHelper.clientSize(),b=a.height,c=0,d=this._notifications.length;c<d;c+=1){var e=this._notifications[c];e.calculateOwnSize();b-=e.elementHeight+10;e.setPosition(a.width-e.elementWidth-10,b)}},_removeAllHiddenNotifications:function(){for(var a=this._notifications.length-1;0<=a;a-=1)this._notifications[a].status===kangoContentNotificationStatus.HIDDEN&&(this._notifications[a].destroyNotificationElement(),
this._notifications.splice(a,1))},createNotification:function(a){this._removeAllHiddenNotifications();a=new KangoContentNotification(a,this._notificationTemplate);this._notifications.push(a);this.recalculatePositions();return a},closeNotification:function(a){for(var b=0;b<this._notifications.length;b++){var c=this._notifications[b];c.id==a&&c.close()}this.rearrangeNotifications()},rearrangeNotifications:function(){this._removeAllHiddenNotifications();this.recalculatePositions()},init:function(){var a=
this;getTemplate("contentNotification",function(b){a._notificationTemplate=b;getTemplate("contentNotificationStyle",function(b){cssHelper.addCss(b);kango.addMessageListener("KangoNotifications_show",function(a){contentNotificationManager.createNotification(a.data).show()});kango.addMessageListener("KangoNotifications_close",function(b){a.closeNotification(b.data)});kango.addMessageListener("KangoNotifications_rearrange",function(b){a.rearrangeNotifications()})})})}};window==window.top&&contentNotificationManager.init();
