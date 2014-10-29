// ==UserScript==
// @name collecteur
// @include http://*
// @include https://*
// @all-frames true
// @require ktbs_bib_js/jquery.js



// ==/UserScript==


/*##################################################################################################################################
    Title               || Collecteur.js
    Author              || Derbel Fatma
    Description         || CONTENT SCRIPTS RUNS ON ANY WEB PAGE OPENED BY USER 
    ##################################################################################################################################  
    History             || 

  
    */



/*##################################################################################################################################
    SCRIPTS RUNS ON ANY WEB PAGE OPENED BY USER
#################################################################################################################################### */

$(document).ready(function () { 
  notif = false;
  notifV = false;
        /*$(window).on('hashchange', function(e){
        var origEvent = e.originalEvent;
        kango.console.log('Going to: ' + origEvent.newURL + ' from: ' + origEvent.oldURL);
        });	*/
  kango.console.log("collecteur");
	/*######MESSAGE IN THE CONFIGURATION STEP BETWEEN BACKGROUND AND COLLECTEUR TO START RETRIEVING DATA FROM THE SITE################# */
	kango.dispatchMessage('Pret');
	kango.addMessageListener('GetDataD', function(event) {
    if (document.getElementsByTagName("base").length != 0){
	         var head = document.head.innerHTML;
    }
    else {
	         var Base = "<base href = \""+document.location.href+"\" target=\"_blank\">" ;
	         var head = Base + document.head.innerHTML;
    }
    /*###########MESSAGE IN THE CONFIGURATION STEP BETWEEN OPTION AND COLLECTEUR TO LOAD THE DATA OF SITE IN THE IFRAME###################### */
    kango.dispatchMessage('Data',{body:document.body.innerHTML,header:head});
    kango.console.log ("send Data");
		
  });
	/*###############MESSAGE BETWEEN BACKGROUND AND COLLECTEUR TO GET THE STATUS OF TRACEME (ON/OFF)################ */
	kango.dispatchMessage('GetEtat');
	kango.addMessageListener('Etat', function(event) {
	   var Etat= event.data ;
	   kango.console.log ("receive etat",Etat);
	   ReceiveEtat(Etat) ;
  });
   
});
/*##################################################################################################################################
    DECLATION OF VARIABLE AND FUNCTION
#################################################################################################################################### */


/*#######################################################
    START COLLECT IF TRACEME ACTIVED
######################################################### */

var ReceiveEtat = function (Etat) {
	if ((Etat == "Activer")&&(!notif))
	{ 
    kango.console.log ("Trace Me Started");
	  // colect the URL document
	  Send_URL(document.URL) ;
	  // get configurate  information from background.js
	  kango.dispatchMessage('GetConfg');
	  kango.addMessageListener('confg', function(event)
	  { onListReceived(event.data) ; });
	  notif= true;
    }
	
}
function onListReceived(donnees){ 
  if ( donnees == null ) {return false ; }
 
  for  (var host=0;host < donnees.Page.length;host++)
  {
       if ((document.URL==donnees.Page[host].URL)||( document.location.host==donnees.Page[host].HostName))
	   { 
	   collectData(donnees.Page[host]);
	   
	   }
	}
	
}
/*#######################################################
    BROWSE THE CONFIGURATION FILE
######################################################### */
function collectData (Data){    
  kango.console.log ("site collected");
     
	  var event = Data.event;
      for (var i=0; i < event.length; i++ )
      {  // browse selector of each event
         for (var j=0; j < event[i].selectors.length; j++ ) 
         { 
             if ((event[i].selectors[j].Selector==undefined) || (event[i].selectors[j].Selector==""))
				{
				 if ((event[i].typeObsel==undefined) || (event[i].typeObsel=="") )
				    {
				    $(document).on(event[i].type,fonction);
				    }
				 else 
				     {
				     $(document).on(event[i].type,{typeO:event[i].typeObsel},fonctionT);
				    }
				}
			 else
		        if ((event[i].typeObsel==undefined) || (event[i].typeObsel=="") )
			        {//kango.console.log (event[i].selectors[j].Selector);
					$(event[i].selectors[j].Selector).on (event[i].type,fonction);}
				else 
                    {
					 //kango.console.log (event[i].selectors[j].Selector);
					 $(event[i].selectors[j].Selector).on (event[i].type,{typeO:event[i].typeObsel},fonctionT);
					}
		    }  
       	    if (i == event.length-1 ) 
            {
                  ListenServer(); 
                  if (!notifV)
                    {
                      kango.dispatchMessage ('notification');notifV= true;}    }
          }
}
/*#######################################################
    COMMUNICATE WITH THE SERVER COLLECTOR
######################################################### */
function ListenServer (){
      kango.console.log ("Listen");
      var allcookie = document.cookie.split(";");
      kango.console.log ("Lenght",allcookie.length-1);
      for (i=0;i < allcookie.length-1;i++)
      { 

        if (allcookie[i].split('=')[0] == " BAseURI")
        {var BAseURI = decodeURIComponent(allcookie[i].split('=')[1])}
         if (allcookie[i].split('=')[0] == "TraceName")
        {var TraceName = allcookie[i].split('=')[1]}
        if (allcookie[i].split('=')[0] == " Model_URI")
        {var Model_URI = decodeURIComponent(allcookie[i].split('=')[1])}
      }	
      if ( (BAseURI) && (TraceName) && (Model_URI) )
      {
              Trace_Information ={TraceName:TraceName,BaseURI:BAseURI,ModelURI:Model_URI};
              kango.dispatchMessage('TraceInfo',Trace_Information);
              var encoded_trace_uri = encodeURIComponent(Trace_Information.BaseURI+Trace_Information.TraceName+"/");
              var URL = "http://dsi-liris-silex.univ-lyon1.fr/fderbel/Assistant-Samo-Trace-Me/Index.php?mode=utilisateur&&page=TraceView&trace_uri="+encoded_trace_uri ;
             // window.open(URL,"assistant","menubar=no, status=no, scrollbars=no, menubar=no, width=800, height=400");
              kango.dispatchMessage('OpenAssist',URL);  
              
      }
}

/*#######################################################
    COLLECT THE INFORMATION OF THE VISITED PAGE 
    AND SEND THEM TO THE BACKGROUND TO CREATE AN OBSEL
######################################################### */
function Send_URL(URL){
        var attribute={};
		    attribute.hasDate =new Date().format("yyyy-MM-dd h:mm:ss");
        //attribute.begin = (new Date()).getTime();
        //attribute.end =   (new Date()).getTime();
        attribute.hasType="Ouverture_Page";
        attribute.hasSubject="obsel of action Website_visited ";
        attribute.hasDocument_URL = URL;
		    attribute.hasDocument_Title = document.title;
	     kango.dispatchMessage('obsel',attribute);
 }

  // function to collect attribute and send then to baground.js
 /*#######################################################
    COLLECT THE ATTRIBUTES OF THE EVENT AND 
    SEND THEM TO BACKGROUND TO CREATE AN OBSEL 
######################################################### */   
 fonction =  function (e) {
    var attributes = {
            'x': e.clientX,
            'y': e.clientY,
        };
        fillCommonAttributes(e, attributes);
		kango.dispatchMessage('obsel',attributes);
}
 fonctionT =  function (e) {
    var attributes = {
            'x': e.clientX,
            'y': e.clientY,
        };
        fillCommonAttributes(e, attributes);
		attributes.hasType= e.data.typeO ;
		attributes.hasSuperType= e.type ;
		kango.dispatchMessage('obsel',attributes);
}
   
function fillCommonAttributes(e, attributes) {
    attributes.hasDate =new Date().format("yyyy-MM-dd h:mm:ss");
    attributes.hasType = e.type;
    attributes.hasDocument_URL = document.URL;
    attributes.hasDocument_Title = document.title;
    attributes.ctrlKey = e.ctrlKey;
    attributes.shiftKey = e.shiftKey;
    attributes.hasTarget = getXPath(e.target);
    attributes.hasTarget_targetName = getElementName(e.target);
    if (e.target.id) { attributes.hasTarget_targetId = e.target.id; }
    if (e.target.alt) { attributes.hasTarget_ALT = e.target.alt; }
    if (e.target.value) {attributes.hasTarget_Value = e.target.value;}
    if ( e.target.firstChild ) {if ((e.target.firstChild.nodeValue) && (e.target.firstChild.nodeValue !="")) {attributes.hasTarget_TextNode = e.target.firstChild.nodeValue.replace(/[\n]/gi,"");}}
    if (e.keyCode) {attributes.keyCode = e.keyCode;}
    if (e.target.className) {attributes.hasTarget_ClassName = e.target.className.toString();}
    if (e.target.text) { 
    var text = e.target.text.replace(/[\n]/gi,"");
    attributes.hasTarget_targetText = text; }
    if (e.target.title) {attributes.hasTarget_Title = e.target.title};
        if (e.currentTarget) {
            attributes.currentTarget = getXPath(e.currentTarget);
            attributes.hascurrentTarget_currentTargetName = getElementName(e.currentTarget);
            if (e.currentTarget.id) {
                attributes.hasCurrentTarget_currentTargetId = getElementId(e.currentTarget);
            }
            if (e.currentTarget.text) {
            var texte = e.currentTarget.text.replace(/[\n]/gi,"");
                attributes.hasCurrentTarget_currentTargetText = texte;
            }
        }
        if (e.explicitOriginalTarget) {
            attributes.hasOriginalTarget = getXPath(e.explicitOriginalTarget);
            attributes.hasOriginalTarget_originalTargetName = getElementName(e.explicitOriginalTarget);
            if (e.explicitOriginalTarget.id) {
                attributes.hasOriginalTarget_originalTargetId = getElementId(e.explicitOriginalTarget);
            }
            if (e.explicitOriginalTarget.text) {
                attributes.hasOriginalTarget_originalTargetText = e.explicitOriginalTarget.text;
            }
        }
        if (e.target.tagName === "IMG") {
            attributes.hasImgSrc = e.target.src;
        }
}
 function getXPath(element) {
        // derived from http://stackoverflow.com/a/3454579/1235487
        while (element && element.nodeType !== 1) {
            element = element.parentNode;
        }
        if (typeof(element) === "undefined") { return "(undefined)"; }
        if (element === null) { return "(null)"; }

        var xpath = '';
        for (true; element && element.nodeType === 1; element = element.parentNode) {
            //if (typeof(element.id) !== "undefined") return "#" + element.id;
            var id = ($(element.parentNode)
                      .children(element.tagName)
                      .index(element) + 1);
            id = (id > 1  ?  '[' + id + ']'  :  '');
            xpath = '/' + element.tagName.toLowerCase() + id + xpath;
        }
        
        return xpath;
}
 function getElementName(element) {

        while (element && element.nodeType !== 1) {
            element = element.parentNode;
        }
        if (typeof(element) === "undefined") { return "(undefined)"; }
        if (element === null) { return "(null)"; }

        //if (typeof(element.id) !== "undefined") return "#" + element.id;
        var id = ($(element.parentNode)
                  .children(element.tagName)
                  .index(element) + 1);
        id = (id > 1  ?  '[' + id + ']'  :  '');
        var nameE = element.tagName.toLowerCase() + id;

        return nameE;
}

 function getElementId(element) {

        while (element && element.nodeType !== 1) 
        {
            element = element.parentNode;
        }
        if (typeof(element) === "undefined") { return "(undefined)"; }
        if (element === null) { return "(null)"; }

        if (typeof(element.id) !== "undefined") { return element.id; }

        return "#";
}

Date.prototype.format = function(format){
  var o = {
    "M+" : this.getMonth()+1, //month
    "d+" : this.getDate(),    //day
    "h+" : this.getHours(),   //hour
    "m+" : this.getMinutes(), //minute
    "s+" : this.getSeconds(), //second
    "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
    "S" : this.getMilliseconds() //millisecond
  }

  if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
    (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)if(new RegExp("("+ k +")").test(format))
    format = format.replace(RegExp.$1,
      RegExp.$1.length==1 ? o[k] :
        ("00"+ o[k]).substr((""+ o[k]).length));
  return format;
}
