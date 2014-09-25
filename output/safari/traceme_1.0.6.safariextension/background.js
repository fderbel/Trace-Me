
// init variable

var trc;
var language = window.navigator.userLanguage || window.navigator.language;
kango.storage.setItem("LangChange",language.toUpperCase());
var trc_init ;
var init_trc  = function ()
{
   
    var TraceURI = JSON.parse(kango.storage.getItem("trace_options_Trace_URI"));
    var Trace_URI = TraceURI[kango.storage.getItem("Trace_Active")];
    var Trace_Name = GetTraceAndBaseName (Trace_URI)["Trace_Name"];
    var BASE_URI = GetTraceAndBaseName (Trace_URI)["BaseURI"];
	
	//var Model = kango.storage.getItem("trace_options_Model_URI");
    
    if ((Trace_Name =="")||(BASE_URI == "")|| (BASE_URI == undefined ))
    { 
    	trc_init = false ;
    }
    else
   { 
        var mgr = new tService.TraceManager({base_uri: BASE_URI , async: true}); 
        trc = mgr.init_trace({name: Trace_Name, 
        					error: function(jqXHR,textStatus, errorThrown){
		 							console.log("error is callbacked.","jqXHR.status",jqXHR.status,"textStatus",textStatus,"errorThrown",errorThrown);
	       							if(jqXHR.status =='401')              
	            					{
	            						// URLAuth and 	URLSuccess
	            						var div = document.createElement('div');
	            						div.innerHTML=jqXHR.responseText;
	            						var link = div.getElementsByTagName("a")[0].href;
	            				 		URLSuccess = "http://localhost:8001/"
	            				 		aouthFunction (link,URLSuccess);
	            				
	            					}           
	  		}  
	  	}); 
        if (trc){
        	trc_init = true ;

        }

        
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
	console.log('tabcreated '+ event);
	tag_Id=event.tabId;
	console.log (tag_Id);
	
					                 							
	};
var oncompletedDocumentFunction = function(event){
    console.log('DocumentComplete '+event.url);
            if ( event.url == URLSuccess ){
                    //close tab
                    //remove event listen
				console.log('targetId '+event.target.getId());
				console.log(tag_Id);
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
				kango.browser.removeEventListener(kango.browser.event.DocumentComplete,oncompletedDocumentFunction);
			}		}
    };

  aouthFunction = function (link,URLSuccess){
  	jQuery.ajax({
			     url : link,
			     type: 'GET',
			     cache:false,
			     statusCode: {
			            	200: function(data, textStatus, xhr) {
									console.log (xhr.getResponseHeader('Location'));
					                title = $(data).filter('title').text();// get title  (data)
					                								//location URLSuccess
					                if (title=="gff"){

					                	trc.put_obsels({
		 										obsel: OBSEL,
		 										success: function(){console.log("success is callbacked");},
		 										error: function(jqXHR,textStatus, errorThrown){
		 																	console.log("error is callbacked.","jqXHR.status",jqXHR.status,"textStatus",textStatus,"errorThrown",errorThrown);
																		}
										})
					                }
					                //not authentified
					                else
					                		// popup solution
					                {
					                	kango.storage.setItem("Openedpopup",true)
					                	//a changer
					                	kango.browser.addEventListener(kango.browser.event.TabCreated,oncreateFunction);
					                 	kango.browser.tabs.getAll(function(tab){
					                				var remaining = tab.length;
					                				for (var i=0;i<tab.length; i++)
                                            		{                                            							                                           							
														console.log (tab[i].getTitle());
														if(tab[i].getTitle() == title)
																{kango.storage.setItem("Openedpopup",false);}
														remaining -= 1;
														if (remaining == 0) {
																if (kango.storage.getItem("Openedpopup")) {
                                            							kango.browser.windows.create({url:link,width:800, height:400});
                                            							kango.browser.tabs.getCurrent(function(tab) {
																			var urlImg = kango.io.getResourceUrl ("icons/traceMe.png");
																			var notification = kango.ui.notifications.createNotification('Trace Me',"You should authenticate",urlImg);
    																		notification.show();
     																	});
                                            							kango.browser.addEventListener(kango.browser.event.DocumentComplete,oncompletedDocumentFunction);
                                            							setTimeout(function(){kango.browser.removeEventListener(kango.browser.event.TabCreated,oncreateFunction)},9000);
                                            					} 
                                            			
														}
													}		      
                                        });        					
                                    }
							}
				},
			    error: function(jqXHR, textStatus, errorThrown){console.log("erreur link auth");},
			
		});

  }

// traceMe actif or no to choise the icon 
if ((kango.storage.getItem("Etat") == "Desactiver"))
    {kango.ui.browserButton.setIcon('icons/traceMe1.png');}

// listen collector in the configuration etape
kango.addMessageListener('Pret', function(event) {
  if (kango.storage.getItem("DATA")=="True") {
		kango.browser.tabs.getCurrent(function(tab) {
			kango.console.log ("get data back");
			tab.dispatchMessage('GetDataD');
		}); 
	kango.storage.setItem ("DATA","false");
  }  			
				
});
// send etat of traceMe to the collecteur
kango.addMessageListener('GetEtat', function(event) {

	kango.browser.tabs.getCurrent(function(tab) {
			if (kango.storage.getItem("Etat") == undefined) 
			{kango.storage.setItem("Etat","Activer");	  }
    		tab.dispatchMessage('Etat', kango.storage.getItem("Etat") );
    		kango.console.log ("send Etat");
	});
});

// open the assistant
kango.addMessageListener('OpenAssist', function(event) {
 	console.log('OpenAssist');
 	var URL= event.data;
 	kango.storage.setItem("OpenedAssist",false);
   	kango.browser.tabs.getAll(function(tab){
   		var remaining=tab.length;
		for (var k=0;k<tab.length;k++)
		{
			if (tab[k].getUrl()==URL){
				kango.storage.setItem("OpenedAssist",true);
			}	
			remaining -= 1;
			if (remaining==0){
				if (! kango.storage.getItem("OpenedAssist")){
						kango.browser.windows.create({url:URL,width:1000, height:700});
				}
			}
		}
	})

    /*kango.browser.tabs.getCurrent(function(tab) {
    var data = kango.storage.getItem("OpenedAssist") ; 
    tab.dispatchMessage('SendOpenedAssist', data );
    })*/
});

// send configuration information to the collector
kango.addMessageListener('GetConfg', function(event) {
    kango.console.log ("get message config")
	kango.browser.tabs.getCurrent(function(tab) {
		if  (kango.storage.getItem("Config") == undefined)
				{
				kango.storage.setItem("Config",kango.i18n.getMessage('CalcoConfig'));
				}  
		var data = kango.storage.getItem("Config") ; 
    	tab.dispatchMessage('confg', data );
    	kango.console.log ("send Data",data);
	});
});
 // show notification
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
		var notification = kango.ui.notifications.createNotification('Trace Me',kango.storage.getItem("notification"),urlImg);
    	notification.show();
	
    	}
    else 
    	{
    	var Activities = JSON.parse(kango.storage.getItem("trace_options_Activitie"));
    	var notification = kango.ui.notifications.createNotification('Trace Me',Activities[kango.storage.getItem("Trace_Active")],urlImg);
    	notification.show();
    	}
    
     
	});
});

kango.addMessageListener('notificationD', function(event) {
    kango.browser.tabs.getCurrent(function(tab) {
	var urlImg = kango.io.getResourceUrl ("icons/traceMe.png");
	var notification = kango.ui.notifications.createNotification('Trace Me', kango.storage.getItem("TraceStart")+kango.storage.getItem("Trace_Active"),urlImg);
    notification.show();
     
	});
});
//send obsel to ktbs
kango.addMessageListener('obsel', function(event) {
	//liste d'obsel !!!
if (trc_init) {
	
	
    	var OBSEL = event.data;
		// send obsel to ktbs

    	trc.put_obsels({
		 	obsel: OBSEL,
		 	success: function(){console.log("success is callbacked");},
		 	error: function(jqXHR,textStatus, errorThrown){
		 					console.log("error is callbacked.","jqXHR.status",jqXHR.status,"textStatus",textStatus,"errorThrown",errorThrown);
	       					if(jqXHR.status =='401')              
	            				{
	            				// URLAuth and 	URLSuccess
	            				var div = document.createElement('div');
	            				div.innerHTML=jqXHR.responseText;
	            				var link = div.getElementsByTagName("a")[0].href;
	            				 URLSuccess = "http://localhost:8001/"
	            				 aouthFunction (link,URLSuccess);
	            				
	            				}           
	  		}
	  	});
	    
	    if 	(event.data.hasType=="Deconnection"){kango.storage.setItem("Trace_Active"," ");}
	   }
	else 
	{
		kango.console.log ("error");
	}

});

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
   

/*if (kango.storage.getItem("trace_options_Trace_Name") == undefined )
{var Activities = [];Activities.push (TraceInfo.TraceName);}
else
{var Activities = JSON.parse(kango.storage.getItem("trace_options_Trace_Name"));
            if (! existe( Activities,TraceInfo.TraceName) )
            {
                Activities.push (TraceInfo.TraceName);
               
            }
        }
    kango.storage.setItem("trace_options_Trace_Name",JSON.stringify(Activities));
    kango.console.log ("Ac"+JSON.stringify(Activities));*/
 


kango.addMessageListener('init_trace', function(event) 
{
		init_trc ();
});				   
						   
