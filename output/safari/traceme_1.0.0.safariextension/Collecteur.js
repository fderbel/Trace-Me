  // ==UserScript==
// @name MessagingDemo
// @include http://*
// @include https://*
//@require jquery-1.9.1.min.js
// ==/UserScript==






$(document).ready(function () 
{ 

		
 // get localStorage etat from background.js
	//chrome.extension.sendRequest({mess: "Etat"}, function(response) {Etat= response.status;ReceiveEtat(Etat);});
	kango.console.log("collecteur");
	kango.dispatchMessage('GetEtat');
	kango.addMessageListener('Etat', function(event) 
	{
     kango.console.log('Background script says: ' + event.data);
	 var Etat= event.data ;
	 ReceiveEtat(Etat) ;
    });
	
	function ReceiveEtat(Etat) 
	{
	
	if (Etat == "Activer")
	{
		
		kango.console.log ("Trace Me Started")
    // listen to serveur collector 
         var req = new XMLHttpRequest();
         req.open('GET', document.location, false);
         req.send(null);
         
         var Trace_Information = req.getResponseHeader('Trace_Information');
         if  (Trace_Information != null) 
            {  
                // send the trace information to baground.js
               // chrome.extension.sendRequest({mess: "TraceInfo",TraceInfo : JSON.parse (Trace_Information) }, function(response) { });
			   kango.dispatchMessage('TraceInfo',JSON.parse (Trace_Information));
            }
    // colect the URL document
       if (document.location.hostname != "localhost") {Send_URL(document.URL) ;}

    // get configurate  information from background.js
    //    chrome.extension.sendRequest({mess: "confg"}, function(response) {donnees= response.status;onListReceived(donnees);});
	kango.dispatchMessage('GetConfg');
	kango.addMessageListener('confg', function(event) 
	{
	 var donnees= event.data ;
	 onListReceived(donnees) ;
    });
                
	function onListReceived(donnees)
                
{ 
							kango.console.log (document.location.hostname)   ;                       
							var host=0;
                            while ((host < donnees.Page.length) && (document.location.hostname!=donnees.Page[host].URL))  {host++;}
                            if (host == donnees.Page.length) {}
                            else 
                                    {    // browse event
									     kango.console.log ("site collected") ;
                                         var event = donnees.Page[host].event;
                                         for (var i=0; i < event.length; i++ )
                                              {  // exist of element
                                                    if (event[i].element=="")  {$(document).on(event[i].type,fonction);}
                                                    else{   // browse element of each event
                                                            for (var j=0; j < event[i].element.length; j++ ) 
                                                                { var listAttribut = event[i].element[j].attribut;
                                                                  if (listAttribut=="") {$(event[i].element[j].tag).on (event[i].type,fonction);}
                                                                  else 
                                                                  {for (var k=0; k < listAttribut.length; k++ )
                                                                       {var att = "";
                                                                        for (var prop in listAttribut[k] )
                                                                             {att= att + "["+prop+"="+listAttribut[k][prop]+"]";}
																			 a = event[i].element[j].tag+""+att+"."+event[i].type+"("+fonction+")"
																			 a ;
                                                                            // $(a).event[i].type(fonction);
																			 //kango.console.log(a);
                                                                       }
                                                                  }
                                                                 }  
       	                                                  }
                                              }
                                     }
 }    

	}
}
});
// function to send URL Information to baground.js
function Send_URL(URL)
 {
        var attribute={};
		attribute.hasdate =new Date().toString();
        //attribute.begin = (new Date()).getTime();
        //attribute.end =   (new Date()).getTime();
        attribute.hasType="Website_visited";
        attribute.hasSubject="obsel of action Website_visited ";
        attribute.hasDocument_Url = URL;
        
      //  chrome.extension.sendRequest({mess:'obsel',OBSEL:attribute}, function(response) {});
	  kango.dispatchMessage('obsel',attribute);
 }

  // function to collect attribute and send then to baground.js
    
var fonction =  function (e) 
{
        var attributes = {
            'x': e.clientX,
            'y': e.clientY,
        };
        fillCommonAttributes(e, attributes);
   // send mess obsel
        //chrome.extension.sendRequest({mess:'obsel',OBSEL:attributes}, function(response) {}); 
		kango.dispatchMessage('obsel',attributes);
}
   
function getXPath(element) 
{
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
function getElementName(element) 
{

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

function getElementId(element) 
{

        while (element && element.nodeType !== 1) 
        {
            element = element.parentNode;
        }
        if (typeof(element) === "undefined") { return "(undefined)"; }
        if (element === null) { return "(null)"; }

        if (typeof(element.id) !== "undefined") { return element.id; }

        return "#";
}

function fillCommonAttributes(e, attributes) 
{
        
        //attributes.begin = (new Date()).getTime();
        //attributes.end = (new Date()).getTime();
		attributes.hasdate =new Date().toString();
        attributes.hasSubject= "obsel of action "+ e.type;
        attributes.hasType = e.type;
        attributes.hasDocument_Url = document.URL;
		attributes.hasDocument_Title = document.title;
        attributes.ctrlKey = e.ctrlKey;
        attributes.shiftKey = e.shiftKey;
        attributes.hastarget = getXPath(e.target);
        attributes.hastarget_targetName = getElementName(e.target);
        if (e.target.id) { attributes.hastarget_targetId = e.target.id; }
		if (e.target.alt) { attributes.hastarget_ALT = e.target.alt; }
		if (e.target.value) {attributes.hastarget_Value = e.target.value;}
		if ( e.target.childNodes[0] ) {if ((e.target.childNodes[0].nodeValue) && (e.target.childNodes[0].nodeValue !="")) {attributes.hastarget_TextNode = e.target.childNodes[0].nodeValue;}}
		if (e.keyCode) {attributes.keyCode = e.keyCode;}
		if (e.target.text) { attributes.hastarget_targetText = e.target.text; }
        if (e.currentTarget) {
            attributes.currentTarget = getXPath(e.currentTarget);
            attributes.hascurrentTarget_currentTargetName = getElementName(e.currentTarget);
            if (e.currentTarget.id) {
                attributes.hascurrentTarget_currentTargetId = getElementId(e.currentTarget);
            }
            if (e.currentTarget.text) {
                attributes.hascurrentTarget_currentTargetText = e.currentTarget.text;
            }
        }
        if (e.explicitOriginalTarget) {
            attributes.originalTarget = getXPath(e.explicitOriginalTarget);
            attributes.hasoriginalTarget_originalTargetName = getElementName(e.explicitOriginalTarget);
            if (e.explicitOriginalTarget.id) {
                attributes.hasoriginalTarget_originalTargetId = getElementId(e.explicitOriginalTarget);
            }
            if (e.explicitOriginalTarget.text) {
                attributes.hasoriginalTarget_originalTargetText = e.explicitOriginalTarget.text;
            }
        }
        if (e.target.tagName === "IMG") {
            attributes.hasimgSrc = e.target.src;
        }
}
    



