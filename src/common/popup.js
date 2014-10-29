
/*##################################################################################################################################
    Title                           || popup.js
    Author                          || Derbel Fatma
    Description                     || THE POPUP APPEARS WHEN THE USER CLICKS IN THE ICON 
    ##################################################################################################################################  
    Description for TRACEME         || THE POPUP ALLOWS  USER TO :
    								|| 1-OPEN ASSISTANT
    								|| 2-OPEN OPTION 
    								|| 3-ENABLE OR DISABLE TRACING

    
    */

 KangoAPI.onReady(function() {
/*##################################################################################################################################
       TRANSLATE OPTIONS FORM
#################################################################################################################################### */
//get browser language
var language = window.navigator.userLanguage || window.navigator.language;
if (language.indexOf("en") === 0){langEn();}
else if( language.indexOf("de") === 0){
	langDe();
}
else {
	langFr();
}
var JSONObject;
function langEn(){
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
function langFr(){
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
function langDe(){
    
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
function setNames(){  
  document.getElementById("activity").innerHTML = JSONObject.activity;
  document.getElementById("value").innerHTML = JSONObject.value;
  document.getElementById("Trace").innerHTML = JSONObject.showtrace;
  document.getElementById("Option").innerHTML = JSONObject.changeoption;
  document.getElementById("tname").innerHTML = JSONObject.tname;
  if (kango.storage.getItem("Etat") =="Activer")
    {
  		document.getElementById("Etat").childNodes[0].nodeValue = JSONObject.deactivebtn;
    }
  else if (kango.storage.getItem("Etat") =="Desactiver")
	{
		document.getElementById("Etat").childNodes[0].nodeValue = JSONObject.activebtn;
	}
  else 
	{
		document.getElementById("Etat").childNodes[0].nodeValue = JSONObject.deactivebtn;
		kango.storage.setItem("Etat","Activer");
	}
	
    var Trace_Name = kango.storage.getItem("Trace_Active");
    var BASE_URI = kango.storage.getItem("trace_options_Base_URI") ;
	
	$('#FR').on("click", function() { 
		langFr();
		kango.storage.setItem("LangChange","FR");
	});
	$('#EN').on("click", function() { 
		langEn();
		kango.storage.setItem("LangChange","EN");
	});
	$('#DE').on("click", function() { 
		langDe();
		kango.storage.setItem("LangChange","DE");
	})
}

/*##################################################################################################################################
       SCRIPT CODE TO EXECUTE WHEN LOADED THE FILE
#################################################################################################################################### */

$('document').ready(function (){  

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
			
	var Activities = JSON.parse(kango.storage.getItem("trace_options_Activitie"));
	var TraceURI = JSON.parse(kango.storage.getItem("trace_options_Trace_URI"));
    var  OPTION = document.createElement ('OPTION');
    document.getElementById('TraceID').appendChild(OPTION);
	if (Activities != undefined )
	{
	    for (i=0;i<Activities.length;i++)
	    { 
	        var  OPTION = document.createElement ('OPTION');
	        OPTION.setAttribute('value',i+"-"+Activities[i]);
	        OPTION.setAttribute('id',i);
	        OPTION.appendChild(document.createTextNode(i+"-"+Activities[i]));
	        document.getElementById('TraceID').appendChild(OPTION);
	        
	    }
	    if (kango.storage.getItem("Trace_Active") !=="")
	    {
	    	document.getElementById('TraceID').value=kango.storage.getItem("Trace_Active")+"-"+Activities[kango.storage.getItem("Trace_Active")];
	    }
	}
	
});
/*##################################################################################################################################
       DECLATION OF EVENT LISTENER
#################################################################################################################################### */
    // ############ OPEN ASSISTANT ############
    var trace = document.getElementById('Trace');
	var open = false;
    trace.addEventListener("click", function(){
		//var encoded_trace_uri = encodeURIComponent(BASE_URI+Trace_Name+"/");
		var TraceURI = JSON.parse(kango.storage.getItem("trace_options_Trace_URI"));
		var trace_uri = TraceURI[kango.storage.getItem("Trace_Active")];
		if (trace_uri[trace_uri.length-1]=="/"){

				var encoded_trace_uri = trace_uri;

		}
		else {

			var encoded_trace_uri = encodeURIComponent (trace_uri+"/");
		}

	    var URL = "http://dsi-liris-silex.univ-lyon1.fr/fderbel/Assistant-Samo-Trace-Me/Index.php?mode=utilisateur&&page=TraceView&trace_uri="+encoded_trace_uri ;
	    window.open (URL,"Assistant");
   
 	});
    // ############ OPEN OPTION PAGE ############
    var option = document.getElementById('Option');
    option.addEventListener ("click",function (){
     	kango.ui.optionsPage.open();
    });
    // ############ ENABLE OR DISABLE TRACING ############
	var Etat = document.getElementById('Etat');
  	Etat.addEventListener ("click",function () {
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
		kango.dispatchMessage('init_trace');
		}
    });

  	// ############ CHANGE ACTIVE TRACE ############
	$('#TraceID').change(function (){
   		select=document.getElementById("TraceID");
    	kango.storage.setItem("Trace_Active",select.options[select.selectedIndex].id );
   
    	kango.dispatchMessage('init_trace');
    });

});



 