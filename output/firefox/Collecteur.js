  // ==UserScript==
// @name collecteur
// @include http://*
// @include https://*
// @require tService/js/jquery.js



// ==/UserScript==
	
$(document).ready(function () 
{ 
    var notif = false;
    var notifV = false;
    
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
		kango.console.log ("send Data");
		
    });
	// get Etat
	kango.dispatchMessage('GetEtat');
	kango.addMessageListener('Etat', function(event) 
	{
	 var Etat= event.data ;
	 kango.console.log ("receive etat");
	 ReceiveEtat(Etat) ;
    });
		function ReceiveEtat(Etat) {
				if ((Etat == "Activer")&&(!notif))
					{ kango.console.log ("Trace Me Started");
					
						
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
							if ( donnees == null ) {return false ; }
                            for  (var host=0;host < donnees.Page.length;host++) 
							{
						  
							if ((document.URL==donnees.Page[host].URL)||( document.location.host==donnees.Page[host].HostName))
									{ collectData(donnees.Page[host]);}
							}
                            function collectData (Data)
								{    // browse event
								      if (!notifV){kango.dispatchMessage ('notification');notifV= true;}
								    //  kango.dispatchMessage ('notification');
								      kango.console.log ("site collected")
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
																	      {//kango.console.log (event[i].selectors[j].Selector);
																	      $(event[i].selectors[j].Selector).on (event[i].type,fonction);}
																	  else 
																	    {
																		//kango.console.log (event[i].selectors[j].Selector);
																		$(event[i].selectors[j].Selector).on (event[i].type,{typeO:event[i].typeObsel},fonctionT);
																		
																		}
																   
                                                                  
                                                                 }  
       	                                                  
                                              }
                                     }
							}  
							//cookie
					ListenServer();
					notif= true;

	}
	
}
});
function ListenServer ()
{
var allcookie = document.cookie.split(";");
for (i=0;i < allcookie.length-1;i++)
{ 
   
   if (allcookie[i].split('=')[0] == "TraceName")
   { 
     
     Trace_Information ={TraceName:allcookie[i].split('=')[1],BaseURI:decodeURIComponent(allcookie[i+1].split('=')[1]),ModelURI:decodeURIComponent(allcookie[i+2].split('=')[1])};
     kango.dispatchMessage('TraceInfo',Trace_Information);              
	 var encoded_trace_uri = encodeURIComponent(Trace_Information.BaseURI+Trace_Information.TraceName+"/");
	 var URL = "http://dsi-liris-silex.univ-lyon1.fr/fderbel/Assist-TraceMe/Index.php?mode=utilisateur&&page=TraceView&trace_uri="+encoded_trace_uri ;
     window.open(URL,"assistant","menubar=no, status=no, scrollbars=no, menubar=no, width=800, height=400");	
     kango.console.log ("terminer ouvrir")	;            
   }
}	  

}
// function to send URL Information to baground.js
function Send_URL(URL)
 {
        var attribute={};
		attribute.hasDate =new Date().toString();
        //attribute.begin = (new Date()).getTime();
        //attribute.end =   (new Date()).getTime();
        attribute.hasType="Ouverture_Page";
        attribute.hasSubject="obsel of action Website_visited ";
        attribute.hasDocument_URL = URL;
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
		attributes.hasDate =new Date().toString();
       
        attributes.hasType = e.type;
        attributes.hasDocument_URL = document.URL;
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
		if (e.target.text) { 
		var text = e.target.text.replace(/[\n]/gi,"");
		attributes.hastarget_targetText = text; 
		
		}
		kango.console.log (e.currentTarget.title);
		if (e.target.title) {attributes.hastarget_Title = e.target.title};
        if (e.currentTarget) {
            attributes.currentTarget = getXPath(e.currentTarget);
            attributes.hascurrentTarget_currentTargetName = getElementName(e.currentTarget);
            if (e.currentTarget.id) {
                attributes.hascurrentTarget_currentTargetId = getElementId(e.currentTarget);
            }
            if (e.currentTarget.text) {
            var texte = e.currentTarget.text.replace(/[\n]/gi,"");
                attributes.hascurrentTarget_currentTargetText = texte;
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
    



