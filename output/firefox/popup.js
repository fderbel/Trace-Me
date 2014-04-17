
KangoAPI.onReady(function() 
{
 //get browser language
 var language = window.navigator.userLanguage || window.navigator.language;
 if (language.indexOf("en") === 0){langEn();}
 else if( language.indexOf("de") === 0){langDe();}
 else {langFr();}
 //translate options form
 var JSONObject;
 
 function langEn()
 {
    JSONObject = { 	"activity": "Activity",
	"value": "Value",
	"showtrace": "Show Trace",
	"changeoption": "Change Option",
	"tname": "Trace Name",
	"activebtn": "Activate",
	"deactivebtn": "Deactivate"
	}
	setNames();
 }
 function langFr()
 {
 
 JSONObject = {
    "activity": "Activité",
	"value": "Valeur",
	"showtrace": "Afficher la trace",
	"changeoption": "Modifier option",
	"tname": "Trace Nom",
	"activebtn": "Activer",
	"deactivebtn": "Désactiver"
	}
	setNames();
 }
 function langDe()
 {
    
    JSONObject = { 	"activity": "Aktivität",
	"value": "Wert",
	"showtrace": "Spuren zeigen",
	"changeoption": "Option ändern",
	"tname": "Spur Name",
	"activebtn": "Aktivieren",
	"deactivebtn": "Deaktivieren"
	}
	setNames();  
 }
function setNames()
{  
  document.getElementById("activity").innerHTML = JSONObject.activity;
  document.getElementById("value").innerHTML = JSONObject.value;
  document.getElementById("Trace").innerHTML = JSONObject.showtrace;
  document.getElementById("Option").innerHTML = JSONObject.changeoption;
  document.getElementById("tname").innerHTML = JSONObject.tname;
  if (kango.storage.getItem("Etat") =="Activer")
  {document.getElementById("Etat").childNodes[0].nodeValue = JSONObject.deactivebtn;}
  else 
  {
  document.getElementById("Etat").childNodes[0].nodeValue = JSONObject.activebtn;
  }
}
    var Trace_Name = kango.storage.getItem("Trace_Active");
    var BASE_URI = kango.storage.getItem("trace_options_Base_URI") ;
	
	$('#FR').on("click", function() { 
	langFr();
	kango.storage.setItem("LangChange","FR");});
	$('#EN').on("click", function() { 
	langEn();
	kango.storage.setItem("LangChange","EN");});
	$('#DE').on("click", function() { langDe();
	kango.storage.setItem("LangChange","DE");})


$('document').ready(function ()

{  

//remember and display selected language
 if (kango.storage.getItem("LangChange") == "FR")
 { langFr(); } 
 else if (kango.storage.getItem("LangChange") == "DE")
 { langDe();}
 else if (kango.storage.getItem("LangChange") == "EN")
 { langEn(); }
 else { /* do nothing */}
 
	var Button = document.getElementById("Etat");
    if (kango.storage.getItem("Etat") == undefined) 
	{
		kango.storage.setItem("Etat","Deactiver");
 		Button.setAttribute('class','btn btn-danger btn-xs');
		Button.childNodes[0].nodeValue = JSONObject.activebtn;
	}
	else if (kango.storage.getItem("Etat") =="Activer")
			{
			Button.setAttribute('class','btn btn-danger btn-xs');
			Button.childNodes[0].nodeValue = JSONObject.deactivebtn;
			}
		else
			{
			var Button = document.getElementById ("Etat");
			Button.setAttribute('class','btn btn-success btn-xs');
			Button.childNodes[0].nodeValue = JSONObject.activebtn;
			
			}
			
	var Activities = JSON.parse(kango.storage.getItem("trace_options_Trace_Name"));
	kango.console.log (Activities);
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
			kango.ui.browserButton.setIcon('icons/traceMe1.png');
			Etat.setAttribute('class','btn btn-success btn-xs');
			Etat.childNodes[0].nodeValue = JSONObject.activebtn;
		}
		else 
		{
		kango.storage.setItem("Etat","Activer");
		kango.ui.browserButton.setIcon('icons/traceMe.png');
		Etat.setAttribute('class','btn btn-danger btn-xs');
		Etat.childNodes[0].nodeValue = JSONObject.deactivebtn;
		}
    });


$('#TraceID').change(function ()
{
    kango.storage.setItem("Trace_Active",document.getElementById("TraceID").value );
	kango.dispatchMessage('popup');
   // chrome.extension.sendRequest({mess:'popup'}, function(response) {});

});

});



