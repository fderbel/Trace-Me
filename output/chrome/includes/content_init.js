"use strict";
_kangoLoader.add("includes/content_init", function(require, exports, module) {
function runContentScripts(a){kango.invokeAsync("modules/kango/userscript_engine/getScripts",window.document.URL,a,window==window.top,function(a){object.forEach(a,function(a){kango.lang.evalScriptsInSandbox(window,a)})})}window.addEventListener("DOMContentLoaded",function(){apiReady.on(function(){runContentScripts("document-end")})},!1);apiReady.on(function(){runContentScripts("document-start")});initApi();

});