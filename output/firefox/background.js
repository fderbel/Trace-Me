 /*##################################################################################################################################
    Title 							|| background.js
    Author 							|| Derbel Fatma
    Description 					|| Background scripts are running as long as extension is enabled in browser and executed once on each browser start.
									|| Background scripts should be enumerated in background_scripts array of extension_info.json file.
    ##################################################################################################################################  
    History 						|| 

	
    */

/*##################################################################################################################################
		DECLATION OF VARIABLE AND FUNCTION
#################################################################################################################################### */

var traceObj;
var Openedpopup = true;
var AssistOpened = true;
var language = window.navigator.userLanguage || window.navigator.language;
kango.storage.setItem("LangChange",language.toUpperCase());
if (! kango.storage.getItem("Trace_Active"))
	{kango.storage.setItem("Trace_Active","");}
var trc_init ;
var timer;
var init_trc  = function (){
			kango.console.log ('inittrc');
		   	if (kango.storage.getItem("Trace_Active")===""){ 
		    	trc_init = false ;
		    }
		    else { 
		   		TraceURI 	= JSON.parse(kango.storage.getItem("trace_options_Trace_URI"));
		     	Trace_URI 	= TraceURI[kango.storage.getItem("Trace_Active")];
		     	Trace_Name 	= GetTraceAndBaseName (Trace_URI)["Trace_Name"];
		     	BASE_URI 	= GetTraceAndBaseName (Trace_URI)["BaseURI"];
		   		traceObj 	= Get_Trace (BASE_URI,Trace_Name)
		        if (traceObj){
		        	trc_init = true ;
		        }
		    }
	
}

var Get_Trace = function (BASE_URI,Trace_Name){

		var mgr = new tService.TraceManager({base_uri: BASE_URI , async: true}); 
        var trc = mgr.init_trace({name: Trace_Name, 
        					error: function(jqXHR,textStatus, errorThrown){
		 							console.log("error is callbacked.","jqXHR.status",jqXHR.status,"textStatus",textStatus,"errorThrown",errorThrown);
	       							if(jqXHR.status =='401')              
	            					{
	            						// URLAuth and 	URLSuccess
	            						Link = jqXHR.getResponseHeader('Link');
	            				//var div = document.createElement('div');
	            				//div.innerHTML=jqXHR.responseText;
	            				//var link = div.getElementsByTagName("a")[0].href;
	            				 //URLSuccess = "http://localhost:8001/"
	            				 //console.log (Link);
	            				 D= Link.split (',');
	            				 for  (var i=0;i<D.length;i++){
	            				 	var SousD = D[i].split(';');
	            				 	if (SousD[1] === " rel=oauth_resource_server"){
	            				 		link = SousD[0].substr(1,SousD[0].length-2)

	            				 	}
	            				 	if (SousD[1] === " rel=successful_login_redirect"){
	            				 		URLSuccess = SousD[0].substr(2,SousD[0].length-3)
	            				 	}

	            				 }
	            				 
	            				// console.log (link,'link');
	            				 //console.log (URLSuccess,'URLSuccess');
	            				 aouthFunction (link,URLSuccess);
	            				
	            					}           
	  		}  
	  	}); 

		return trc ;

}
var PutObsel = function (traceObj,OBSEL) {
if (OBSEL !== undefined) {
			traceObj.put_obsels({
				 	obsel: OBSEL,
				 	success: function(){console.log("success is callbacked");},
				 	error: function(jqXHR,textStatus, errorThrown){
				 					console.log("error is callbacked.","jqXHR.status",jqXHR.status,"textStatus",textStatus,"errorThrown",errorThrown);
			       					if(jqXHR.status =='401')              
			            				{
			            				// URLAuth and 	URLSuccess
			            				Link = jqXHR.getResponseHeader('Link');
			            				//var div = document.createElement('div');
			            				//div.innerHTML=jqXHR.responseText;
			            				//var link = div.getElementsByTagName("a")[0].href;
			            				 //URLSuccess = "http://localhost:8001/"

			            				 D= Link.split (',');
			            				 for  (var i=0;i<D.length;i++){
			            				 	var SousD = D[i].split(';');
			            				 	if (SousD[1] === " rel=oauth_resource_server"){
			            				 		link = SousD[0].substr(1,SousD[0].length-2)

			            				 	}
			            				 	if (SousD[1] === " rel=successful_login_redirect"){
			            				 		URLSuccess = SousD[0].substr(2,SousD[0].length-3)
			            				 	}

			            				 }
			            				 
			            				 console.log (link,'link');
			            				 console.log (URLSuccess,'URLSuccess');
			            				 aouthFunction (link,URLSuccess);
			            				
			            				}           
			  		}
			  	});
}
}
var GetTraceAndBaseName = function (Trace_URI){

	if (Trace_URI[Trace_URI.length-1]=="/"){

		Trace_URI = Trace_URI.substring(0,Trace_URI.length-1);
	}
	var D =  Trace_URI.split("/");
	var Trace_Name = D[D.length-1];
	var D2 = Trace_URI.split(Trace_Name);
	var BaseURI = D2[0];
	return {"Trace_Name":Trace_Name,"BaseURI":BaseURI}

}
var oncreateFunction = function(event){
	tag_Id=event.tabId;
	console.log ('tabcreated '+tag_Id);
	setTimeout(function(){kango.console.log ("delete event tab created");kango.browser.removeEventListener(kango.browser.event.TAB_CREATED,oncreateFunction)},500);
					                 							
	};
var oncompletedDocumentFunction = function(event){
   console.log('targetId oncomplete'+event.target.getId());
            if ( event.url == URLSuccess ){
                    //close tab
                    //remove event listen
				console.log('targetId '+event.target.getId());
				console.log('created tag' + tag_Id);
				trc_init = true ;
				init_trc();
					if (event.target.getId()==tag_Id)
					{
						kango.browser.tabs.getAll(function(tab){
								for (var k=0;k<tab.length;k++)
							{
								if (tab[k].getId()==tag_Id){
								console.log ('here');
								tab[k].close();	
								
								}	

							}

					})
				kango.browser.removeEventListener(kango.browser.event.DOCUMENT_COMPLETE,oncompletedDocumentFunction);
			}		}
};

aouthFunction = function (link,URLSuccess){
kango.console.log ("aouth"+Openedpopup);
  if (Openedpopup)	
{	kango.console.log ("aouth opened");
	Openedpopup = false ;
	jQuery.ajax({
			     url : link,
			     type: 'GET',
			     statusCode: {
			            	200: function(data, textStatus, xhr) {
									// popup solution
					               
					                	Openedpopup = false ;
										popup = true;
					                	title = $(data).filter('title').text();// get title  (data)
										title = title.replace(/\s/g,'');				                	
					                	
					                 	kango.browser.tabs.getAll(function(tab){
					                				var remaining = tab.length;
					                				for (var i=0;i<tab.length; i++)
                                            		{                                            							                                           							
														T= tab[i].getTitle();
														T = T.replace (/\s/g,'');
														var URLI = tab[i].getUrl() 
														URLI = URLI.replace ("http%3A%2F%2F","http://");
														URLI = URLI.replace("%2F","/");
														if((T === title) || (URLI === link))
																{popup = false ;}
														remaining -= 1;
														if (remaining == 0) {
																kango.console.log('Openedpopup : '+ Openedpopup);
																if (popup) {
																		kango.browser.addEventListener(kango.browser.event.TAB_CREATED,oncreateFunction);
																		console.log ("link opened", link);
                                            							kango.browser.windows.create({url:link,width:800, height:400});
																		Openedpopup = false;
                                            							kango.browser.tabs.getCurrent(function(tab) {
																			var urlImg = kango.io.getResourceUrl ("icons/traceMe.png");
																			//var notification = kango.ui.notifications.createNotification('Trace Me',"You should authenticate",urlImg);
    																		kango.ui.notifications.show('Trace Me',"You should authenticate",urlIm);
     																	});
                                            							kango.browser.addEventListener(kango.browser.event.DOCUMENT_COMPLETE,oncompletedDocumentFunction);
                                            							setTimeout(function(){Openedpopup = true;console.log("time")},60000);
																		setTimeout(function(){kango.browser.removeEventListener(kango.browser.event.DOCUMENT_COMPLETE,oncompletedDocumentFunction);},60000);
																		
                                            					} 
                                            			
														}
													}		      
                                        });  
                                             					
                                    
							}
							
				},
			    error: function(jqXHR, textStatus, errorThrown){console.log("erreur link auth");},
			
		});
}
}

/*##################################################################################################################################
		INITIALIZATION THE ACTIVE TRACE WHEN Extension initialized
#################################################################################################################################### */
$('document').ready(function (){
	if (kango.storage.getItem("Etat")=== "Activer"){
		init_trc ();
	}
})

/*##################################################################################################################################
		CHANGE ICON IF TRACEME IS TURNED OFF
#################################################################################################################################### */
if ((kango.storage.getItem("Etat") == "Desactiver")){
    kango.ui.browserButton.setIcon('icons/traceMe1.png');
}
/*##################################################################################################################################
		COMMUNICATION BETWEEN BACKGOUND FILE AND COLLECTOR FIL WITH MESSAGE
		To send/receive any message we need to use a pair of functions :
		kango.addMessageListener() : Registers a message handler for the specified message name.
		kango.dispatchMessage()    : Dispatches a message
#################################################################################################################################### */

/*##################################################################################################################################
		MESSAGE IN THE CONFIGURATION STEP BETWEEN BACKGROUND AND COLLECTEUR TO START RETRIEVING DATA FROM THE SITE
#################################################################################################################################### */

kango.addMessageListener('Pret', function(event) {
  if (kango.storage.getItem("DATA")=="True") {
		kango.browser.tabs.getCurrent(function(tab) {
			//kango.console.log ("get data back");
			tab.dispatchMessage('GetDataD');
		}); 
	kango.storage.setItem ("DATA","false");
  }  			
				
});
/*##################################################################################################################################
		MESSAGE BETWEEN BACKGROUND AND COLLECTEUR TO SEND THE STATUS OF TRACEME (ON/OFF)
#################################################################################################################################### */
kango.addMessageListener('GetEtat', function(event) {

	kango.browser.tabs.getCurrent(function(tab) {
			if (kango.storage.getItem("Etat") == undefined) 
			{kango.storage.setItem("Etat","Activer");	  }
    		tab.dispatchMessage('Etat', kango.storage.getItem("Etat") );
    		//kango.console.log ("send Etat");
	});
});

/*##################################################################################################################################
		MESSAGE BETWEEN BACKGROUND AND COLLECTEUR BEFORE OPENING THE ASSISTANT
#################################################################################################################################### */
kango.addMessageListener('OpenAssist', function(event) {
 if (AssistOpened)	
{	AssistOpened = false;
	kango.console.log ("openAssist");
	var URL= event.data;
	OpenedAssist = false;
   var timerA = setInterval(function ()
{   
	kango.console.log('test to open');
	kango.browser.tabs.getAll(function(tab){
   		var remaining=tab.length;
		for (var k=0;k<tab.length;k++)
		{
			if (tab[k].getUrl()==URL){
				OpenedAssist = true;
			}	
			remaining -= 1;
			if (remaining==0){
				if (! OpenedAssist){
					if (traceObj)
					{	if (traceObj.model_uri !== null)
						{
							
							kango.console.log (traceObj.model_uri );
							clearInterval(timerA);
							kango.console.log ("stop  openAssist");
							//kango.browser.windows.create({url:URL,width:1000, height:700});
							w= window.open(URL,'assistant','width=50%');
							
																		
						}
																		
				}
													
			}
			}
		}
	})
}, 2000); 
	
}	
	
	});

/*##################################################################################################################################
		MESSAGE BETWEEN BACKGROUND AND COLLECTEUR TO SEND THE CONFIGURATION INFORMATION (EVENT TO COLLECT)
#################################################################################################################################### */
kango.addMessageListener('GetConfg', function(event) {
   // kango.console.log ("get message config")
	kango.browser.tabs.getCurrent(function(tab) {
		if  (kango.storage.getItem("Config") == undefined)
				{
				kango.storage.setItem("Config",kango.i18n.getMessage('CalcoConfig'));
				}  
		var data = kango.storage.getItem("Config") ; 
    	tab.dispatchMessage('confg', data );
    	//kango.console.log ("send Data",data);
	});
});
 /*##################################################################################################################################
		MESSAGE BETWEEN BACKGROUND AND COLLECTEUR TO MAKE NOTIFICATION
#################################################################################################################################### */
kango.addMessageListener('notification', function(event) {
    kango.browser.tabs.getCurrent(function(tab) {
	var urlImg = kango.io.getResourceUrl ("icons/traceMe.png");
	var TraceActive = kango.storage.getItem("Trace_Active")
	//set notifications
	if (kango.storage.getItem("LangChange") == "FR")
		{ 
		kango.storage.setItem("notification", "Pas Activité");
  		kango.storage.setItem("TraceStart", "Début de tracage de votre activité.");
  		}
	else if (kango.storage.getItem("LangChange") == "EN")
		{ 	
		kango.storage.setItem("notification", "No activity");
    	kango.storage.setItem("TraceStart", "Tracing of your activities has started."); 
    	}
	else if (kango.storage.getItem("LangChange") == "DE")
		{ 	
		kango.storage.setItem("notification", "Keine Aktivität");
    	kango.storage.setItem("TraceStart", "Die Aufspürung deiner Aktivitäten hat begonnen."); 
    	} 
	
	if ((TraceActive === "")|| (TraceActive === undefined))
		{
	//	var notification = 
		kango.ui.notifications.show('Trace Me',kango.storage.getItem("notification"),urlImg);
    //	notification.show();
	
    	}
    else 
    	{
    	var Activities = JSON.parse(kango.storage.getItem("trace_options_Activitie"));
    	
		kango.ui.notifications.show('Trace Me',Activities[kango.storage.getItem("Trace_Active")],urlImg);
    	
    	}
    
     
	});
});

kango.addMessageListener('notificationD', function(event) {
    kango.browser.tabs.getCurrent(function(tab) {
	var urlImg = kango.io.getResourceUrl ("icons/traceMe.png");
	
	kango.ui.notifications.show('Trace Me', kango.storage.getItem("TraceStart")+kango.storage.getItem("Trace_Active"),urlImg);
    
     
	});
});
 /*##################################################################################################################################
		MESSAGE BETWEEN BACKGROUND AND COLLECTEUR TO SEND OBSEL TO KTBS
#################################################################################################################################### */
kango.addMessageListener('obsel', function(event) {
	//liste d'obsel !!!
	if (trc_init) {
	
		if (traceObj.model_uri){
		    var OBSEL = event.data;
			// send obsel to ktbs
			if (OBSEL) {
		    	PutObsel (traceObj,OBSEL);
				if 	(event.data.hasType=="Deconnection"){kango.storage.setItem("Trace_Active"," ");}
			}
	    }
	    else {

	    	traceObj = Get_Trace (BASE_URI,Trace_Name)
	    	PutObsel (traceObj,OBSEL);

	    }
	}
	else 
		{	
			kango.console.log ("error");
		}

});
 /*##################################################################################################################################
		MESSAGE BETWEEN BACKGROUND AND COLLECTEUR TO SEND INFORMATION OF TRACE (ACTIVITIE)
#################################################################################################################################### */

kango.addMessageListener('TraceInfo', function(event) {
    var TraceInfo = event.data;
   // kango.storage.setItem("Trace_Active",TraceInfo.TraceName);
   // kango.storage.setItem("trace_options_Base_URI",TraceInfo.BaseURI);
   // kango.storage.setItem("trace_options_Model_URI",TraceInfo.ModelURI);
   if (kango.storage.getItem("trace_options_Trace_URI") == undefined ){
   		var TraceURI = [];
		TraceURI.push(TraceInfo.BaseURI+TraceInfo.TraceName);
		var Activities = [];
		Activities.push(TraceInfo.TraceName);
		kango.storage.setItem("trace_options_Trace_URI",JSON.stringify(TraceURI));
        kango.storage.setItem("trace_options_Activitie",JSON.stringify(Activities));
        kango.storage.setItem("Trace_Active",Activities.length-1);
		
   }
   else {
 		var Activities = JSON.parse(kango.storage.getItem("trace_options_Activitie"));
		var TraceURI = JSON.parse(kango.storage.getItem("trace_options_Trace_URI"));
		if (TraceURI.indexOf (TraceInfo.BaseURI+TraceInfo.TraceName) == -1)
            {
                TraceURI.push (TraceInfo.BaseURI+TraceInfo.TraceName);
               	Activities.push(TraceInfo.TraceName);
               	kango.storage.setItem("trace_options_Trace_URI",JSON.stringify(TraceURI));
               	kango.storage.setItem("trace_options_Activitie",JSON.stringify(Activities));
               	kango.storage.setItem("Trace_Active",Activities.length-1);
            }
        else{

        	kango.storage.setItem("Trace_Active",TraceURI.indexOf(TraceInfo.BaseURI+TraceInfo.TraceName));
        }    


   }
   init_trc ();
   
});
/*##################################################################################################################################
		MESSAGE BETWEEN BACKGROUND AND POPUP TO RESET THE TRACE INFORMATION
#################################################################################################################################### */   

kango.addMessageListener('init_trace', function(event) {
		traceObj = null ;
		init_trc ();
});				   
						   
