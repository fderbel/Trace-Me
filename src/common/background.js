

var trc;


kango.addMessageListener('Pret', function(event) 
{
  if (kango.storage.getItem("DATA")=="True") 
    {
	kango.browser.tabs.getCurrent(function(tab) 
	{
	kango.console.log ("get data back");
	tab.dispatchMessage('GetDataD');
	
	}); 
	kango.storage.setItem ("DATA","false");

    }  			
				
});
kango.addMessageListener('GetEtat', function(event) {

	kango.browser.tabs.getCurrent(function(tab) {
	if (kango.storage.getItem("Etat") == undefined) 
	{kango.storage.setItem("Etat","Activer");}
    tab.dispatchMessage('Etat', kango.storage.getItem("Etat") );
});
});

kango.addMessageListener('GetConfg', function(event) {
	kango.browser.tabs.getCurrent(function(tab) {
	if  (kango.storage.getItem("Config") == undefined)
				{
				//kango.storage.setItem("Config",JSON.stringify ( {"Page":[{"URL":"www.youtube.com","event":[{"type":"click","element":[{"tag":"BUTTON","attribut":[]},{"tag":"A","attribut":[]}]}]},{"URL":"www.google.fr","event":[{"type":"click","element":[{"tag":"SPAN","attribut":[]},{"tag":"A","attribut":[]},{"tag":"IMG","attribut":[]}]},{"type":"change","element":[{"tag":"INPUT","attribut":[]}]}]}]}));
				}  
    kango.console.log('send config');
	var data = kango.storage.getItem("Config") ; 
    tab.dispatchMessage('confg', data );
});
});
				                   
kango.addMessageListener('notification', function(event) {
    kango.browser.tabs.getCurrent(function(tab) {
	var urlImg = kango.io.getResourceUrl ("icons/traceMe.png");
	var notification = kango.ui.notifications.createNotification('Trace Me', ' Ce site est tracé au cadre de votre Activité '+kango.storage.getItem("Trace_Active"),urlImg);
    notification.show();
     
});
});
kango.addMessageListener('notificationD', function(event) {
    kango.browser.tabs.getCurrent(function(tab) {
	var urlImg = kango.io.getResourceUrl ("icons/traceMe.png");
	var notification = kango.ui.notifications.createNotification('Trace Me', 'Début de tracage de votre activité  '+kango.storage.getItem("Trace_Active"),urlImg);
    notification.show();
     
});
});

kango.addMessageListener('obsel', function(event) {
init_trc ();
 var OBSEL = event.data;
// send obsel to ktbs
    trc.put_obsels({
		 obsel: OBSEL,
		 success: function(){console.log("success is callbacked");},
		 error: function(jqXHR,textStatus, errorThrown){console.log("error is callbacked.");}
	                       });	
	
});
kango.addMessageListener('TraceInfo', function(event) {
var TraceInfo = event.data;
kango.storage.setItem("Trace_Active",TraceInfo.TraceName);
kango.storage.setItem("trace_options_Base_URI",TraceInfo.BaseURI);
kango.storage.setItem("trace_options_Model_URI",TraceInfo.ModelURI);
var Activities = JSON.parse(kango.storage.getItem("trace_options_Trace_Name"));
            if (! existe( Activities,TraceInfo.TraceName) )
            {
                Activities.push (TraceInfo.TraceName);
                kango.storage.setItem("trace_options_Trace_Name",JSON.stringify(Activities));
            }
            init_trc ();
			});


kango.addMessageListener('popup', function(event) {

init_trc ();
						   
		});				   
						   
function init_trc ()
{
    var Trace_Name = kango.storage.getItem("Trace_Active");
    var BASE_URI = kango.storage.getItem("trace_options_Base_URI") ;
    var Model = kango.storage.getItem("trace_options_Model_URI");
    var mgr = new tService.TraceManager({base_uri: BASE_URI , async: true}); 
    trc = mgr.init_trace({name: Trace_Name	}); 
}

function existe (array, element)
{
    var i = array.length;
    while (i--)
    {
        if (array[i]==element)
        {
          return true;
        }
    }

  return false ;

}

