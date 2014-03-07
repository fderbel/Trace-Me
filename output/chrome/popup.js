KangoAPI.onReady(function() 
{
    var Trace_Name = kango.storage.getItem("Trace_Active");
    var BASE_URI = kango.storage.getItem("trace_options_Base_URI") ;
	

$('document').ready(function() 
{    
   
	var Button = document.getElementById ("Etat");
    if (kango.storage.getItem("Etat") == undefined) 
	{
		kango.storage.setItem("Etat","Activer");
		Button.setAttribute('class','btn btn-danger btn-xs');
		Button.childNodes[0].nodeValue="Desactiver";
	}
	else 
		if (kango.storage.getItem("Etat") == "Activer")
			{
		
			Button.setAttribute('class','btn btn-danger btn-xs');
			Button.childNodes[0].nodeValue="Desactiver";
			}
		else
			{
			var Button = document.getElementById ("Etat");
			Button.setAttribute('class','btn btn-success btn-xs');
			Button.childNodes[0].nodeValue="Activer";
			}
	var Activities = JSON.parse(kango.storage.getItem("trace_options_Trace_Name"));
    var  OPTION = document.createElement ('OPTION');
    OPTION.setAttribute('value',"");
    OPTION.appendChild(document.createTextNode(""));
    document.getElementById('TraceID').appendChild(OPTION);
	if (Activities != undefined )
	{
    for (i=0;i<Activities.length;i++)
    { 
        var  OPTION = document.createElement ('OPTION');
        OPTION.setAttribute('value',Activities[i]);
        OPTION.appendChild(document.createTextNode(Activities[i]));
        document.getElementById('TraceID').appendChild(OPTION);
        
    }
    document.getElementById('TraceID').value=kango.storage.getItem("Trace_Active");}
});



    // show Trace
    var trace = document.getElementById('Trace');
	var open = false;
    trace.addEventListener("click", function(){
  /* kango.browser.tabs.getAll(function(tabs) {
        // tabs is Array of KangoBrowserTab
        for(var i = 0; i < tabs.length; i++){
               if ( tabs[i].getTitle() == "Trace Assistance" ) {open=true;}
        }
		}); */
		
	
	
   var encoded_trace_uri = encodeURIComponent(BASE_URI+Trace_Name+"/");
  // var URL = "http://dsi-liris-silex.univ-lyon1.fr/ozalid/assist/index.php?page=TraceView&trace_uri="+encoded_trace_uri ;
   var URL = "http://dsi-liris-silex.univ-lyon1.fr/fderbel/Assist-TraceMe/Index.php?mode=utilisateur&&page=TraceView&trace_uri="+encoded_trace_uri ;
   window.open (URL,"Assistant");
   
   
		                           });
    // option
    var option = document.getElementById('Option');
    option.addEventListener ("click",function () 
    {
     
	 kango.ui.optionsPage.open();
    });
    
  //Configuration
    /*var File = document.getElementById('Config');
    File.addEventListener ("click",function () 
    {
							function open(a)
							{var c=kango.io.getExtensionFileUrl('Config.html');
							kango.browser.tabs.getAll(function(a) 
							{var b=!1;kango.array.forEach(a,function(a){-1!=a.getUrl().indexOf(c)&&(b=!0,a.activate())});b||kango.browser.tabs.create({url:c,focused:!0})});
							
							}
	//var URL = kango.io.getExtensionFileUrl ("Config.html");
	open();
	//kango.browser.windows.create (URL);
	//window.open (URL,"Configuration");
    });*/
  // Etat
  
  var Etat = document.getElementById('Etat');
  Etat.addEventListener ("click",function () 
    {
		if (kango.storage.getItem("Etat") == "Activer")
		{
			kango.storage.setItem("Etat","Desactiver");
			Etat.setAttribute('class','btn btn-success btn-xs');
			Etat.childNodes[0].nodeValue="Activer";
		}
		else 
		{
		kango.storage.setItem("Etat","Activer");
		Etat.setAttribute('class','btn btn-danger btn-xs');
		Etat.childNodes[0].nodeValue="Desactiver";
		}
    });


$('#TraceID').change(function ()
{
    kango.storage.setItem("Trace_Active",document.getElementById("TraceID").value );
	kango.dispatchMessage('popup');
   // chrome.extension.sendRequest({mess:'popup'}, function(response) {});

});

});



