  // ==UserScript==
// @name collecteur
// @include http://*
// @include https://*
// @require tService/js/jquery.js
// @all-frames true 


// ==/UserScript==
$(document).ready(function () 
{ 
    var notif = false;
    kango.console.log("collecteur");
	// get data 
	kango.dispatchMessage('Pret');
	kango.addMessageListener('GetDataD', function(event) {
	    if (document.getElementsByTagName("base").length != 0)
	    {
	    var head = document.head.innerHTML;
	    }
	    else 
	    {
	    var Base = "<base href = \""+document.location.href+"\" target=\"_blank\">" ;
	    var head = Base + document.head.innerHTML;
	    }
		kango.dispatchMessage('Data',{body:document.body.innerHTML,header:head});
		return false;
    });
	// get Etat
	kango.dispatchMessage('GetEtat');
	kango.addMessageListener('Etat', function(event) 
	{
	 var Etat= event.data ;
	 ReceiveEtat(Etat) ;
    });
		function ReceiveEtat(Etat) {
				if (Etat == "Activer")
					{ kango.console.log ("Trace Me Started")
					// listen to serveur collector 
						var req = new XMLHttpRequest();
						req.open('GET', document.location, false);
						req.send(null);
						var Trace_Information = req.getResponseHeader('Trace_Information');
						if  ((Trace_Information != null) && (Trace_Information != undefined))
							{  // send the trace information to baground.js
									kango.dispatchMessage('TraceInfo',JSON.parse(Trace_Information));
								// notification 
								 if (!notif){kango.dispatchMessage ('notificationD'),notif= true;};
								// open popup visu trace
									var encoded_trace_uri = encodeURIComponent(JSON.parse (Trace_Information).BaseURI+JSON.parse (Trace_Information).TraceName+"/");
									var URL = "http://dsi-liris-silex.univ-lyon1.fr/ozalid/assist/index.php?page=TraceView&trace_uri="+encoded_trace_uri ;
									window.open(URL,"assistant","menubar=no, status=no, scrollbars=no, menubar=no, width=800, height=400");
							}
						
						
					// colect the URL document
						Send_URL(document.URL) ;
					// get configurate  information from background.js
						kango.dispatchMessage('GetConfg');
						kango.addMessageListener('confg', function(event){
							var donnees= event.data ;
							onListReceived(donnees) ;
						});
									function onListReceived(donnees)
							{ 
							
							var host=0;
						    if ( donnees == null ) {return false ; }
                            while ((host < donnees.Page.length) )  
							{
							if ((document.URL==donnees.Page[host].URL)||( document.location.host==donnees.Page[host].HostName))
									{ collectData(donnees.Page[host]);}
							host++;
							}
                            function collectData (Data)
								{    // browse event
								      if (!notif){kango.dispatchMessage ('notification');notif= true;}
									  var event = Data.event;
                                         for (var i=0; i < event.length; i++ )
                                              {  
                                                   
                                                      // browse selector of each event
                                                            for (var j=0; j < event[i].selectors.length; j++ ) 
                                                                {  
																    if ((event[i].selectors[j].Selector==undefined) || (event[i].selectors[j].Selector==""))
																	{
																	
																	$(document).on(event[i].type,fonction);
																	
																	}
																	else
																      if ((event[i].typeObsel==undefined) || (event[i].typeObsel=="") )
																	      {$(event[i].selectors[j].Selector).on (event[i].type,fonction);}
																	  else 
																	    {
																		kango.console.log (event[i].selectors[j].Selector);
																		$(event[i].selectors[j].Selector).on (event[i].type,{typeO:event[i].typeObsel},fonctionT);
																		
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
        attribute.hasType="Ouverture_Page";
        attribute.hasSubject="obsel of action Website_visited ";
        attribute.hasDocument_URI = URL;
		//attribute.hasDocument_Title = document.title;
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
		kango.dispatchMessage('obsel',attributes);
}
var fonctionT =  function (e) 
{
        var attributes = {
            'x': e.clientX,
            'y': e.clientY,
        };
        fillCommonAttributes(e, attributes);
		attributes.hasType= e.data.typeO ;
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
        attributes.hasDocument_UrI = document.URL;
		attributes.hasDocument_Title = document.title;
        attributes.ctrlKey = e.ctrlKey;
        attributes.shiftKey = e.shiftKey;
        attributes.hastarget = getXPath(e.target);
        attributes.hastarget_targetName = getElementName(e.target);
        if (e.target.id) { attributes.hastarget_targetId = e.target.id; }
		if (e.target.alt) { attributes.hastarget_ALT = e.target.alt; }
		if (e.target.value) {attributes.hastarget_Value = e.target.value;}
		//if ( e.target.childNodes[0] ) {if ((e.target.childNodes[0].nodeValue) && (e.target.childNodes[0].nodeValue !="")) {attributes.hastarget_TextNode = e.target.childNodes[0].nodeValue;}}
		if (e.keyCode) {attributes.keyCode = e.keyCode;}
		if (e.target.text) { attributes.hastarget_targetText = e.target.text; }
		kango.console.log (e.currentTarget.title);
		if (e.target.title) {attributes.hastarget_Title = e.target.title};
        if (e.currentTarget) {
            attributes.currentTarget = getXPath(e.currentTarget);
            attributes.hascurrentTarget_currentTargetName = getElementName(e.currentTarget);
            if (e.currentTarget.id) {
                attributes.hascurrentTarget_currentTargetId = getElementId(e.currentTarget);
            }
            if (e.currentTarget.text) {
                //attributes.hascurrentTarget_currentTargetText = e.currentTarget.text;
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
    



