 //get browseer language
 var language = window.navigator.userLanguage || window.navigator.language;
 if (language.indexOf("en") === 0){langEn();}
 else if( language.indexOf("de") === 0){langDe();}
 else {langFr();}
 //translate options form
 var JSONObject;
 function langFr() { //for french
    language = "fr";
	JSONObject = {  "options": "Options",
                    "identity": "Identité",
                    "firstname": "Prénom",
                    "lastname": "Nom",
                    "serverinfo": "Informations de serveur",
                    "baseURI": "Base URI",
                    "modelURI": "Modéle URI",
                    "activityinfo": "Informations de activités",
                    "tracename": "Trace Nom",
                    "add": "AJOUTER",
                    "configtrace": "Configurer le traçage",
                    "saveoption": "Sauver l'option",
                    "loadsite": "Charger site",
                    "addevent": "AJOUTER événement",
                    "Trace_URI":"Trace_URI",
                    "Activitie":"Nom de l'activité",
                	"saveconfig": "Sauvegarder la configuration"
                }; 
     setNames();
}
function langDe() { //for german
    language = "de";
   JSONObject = {   "options": "Optionen",
                    "identity": "Identität",
                    "firstname": "Vorname",
                    "lastname": "Nachname",
                    "serverinfo": "Server Informationen",
                    "baseURI": "Base URI",
                    "modelURI": "Modell URI",
                    "activityinfo": "Aktivitäten Informationen",
                    "tracename": "Spur Name",
                    "add": "hinzufügen",
                    "configtrace": "Spuren konfigurieren",
                    "saveoption": "Option Speichern",
                    "loadsite": "Site laden",
                     "Trace_URI":"Trace_URI",
                     "Activitie":"Name der Aktivität",
                    "addevent": "Veranstaltung hinzufügen",
                	"saveconfig": "Konfiguration Speichern"
                };
	setNames();
}
function langEn() { //for english
     language = "en";
     JSONObject = { "options": "Options",
                    "identity": "Identity",
                    "firstname": "First Name",
                    "lastname": "Last Name",
                    "serverinfo": "Server Information",
                    "baseURI": "Base URI",
                    "modelURI": "Model URI",
                    "activityinfo": "Activities Information",
                    "add": "ADD",
                	"tracename": "Trace Name",
                    "configtrace": "Configure Tracing",
                    "saveoption": "Save Option",
                    "loadsite": "Load Site",
                    "addevent": "ADD event",
                     "Trace_URI":"Trace_URI",
                     "Activitie":"Name of activity",
                	"saveconfig": "Save Configuration"
                };
	setNames();	
}
//allocate translated names to tags
function setNames(){	
    document.getElementById("option").innerHTML = JSONObject.options
    document.getElementById("identity").innerHTML = JSONObject.identity
    document.getElementById("fname").innerHTML = JSONObject.firstname
    document.getElementById("lname").innerHTML = JSONObject.lastname
    document.getElementById("sinfo").innerHTML = JSONObject.serverinfo
    document.getElementById("Trace_URI").innerHTML = JSONObject.Trace_URI
    document.getElementById("Activitie").innerHTML = JSONObject.Activitie
    //document.getElementById("baseURI").innerHTML = JSONObject.baseURI
    //document.getElementById("modURI").innerHTML = JSONObject.modelURI
    //document.getElementById("acinfo").innerHTML = JSONObject.activityinfo
    document.getElementById("ADD").value = JSONObject.add
    //document.getElementById("tname").innerHTML = JSONObject.tracename
    document.getElementById("conftrace").innerHTML = JSONObject.configtrace
    document.getElementById("SaveO").innerHTML = JSONObject.saveoption
    document.getElementById("Load").value = JSONObject.loadsite
    document.getElementById("ADDEvent").value = JSONObject.addevent
    document.getElementById("Save").innerHTML = JSONObject.saveconfig
}


KangoAPI.onReady(function() 
{
    //change language on image click
	$('#FR').on("click", function() { langFr();
	kango.storage.setItem("LangChange","FR"); })
	$('#EN').on("click", function() { langEn();
	kango.storage.setItem("LangChange","EN");})
	$('#DE').on("click", function() { langDe();
	kango.storage.setItem("LangChange","DE");})
	
	//remember and display selected language
    if (kango.storage.getItem("LangChange") == "FR")
        { langFr(); } 
    else if (kango.storage.getItem("LangChange") == "DE")
        { langDe();}
    else if (kango.storage.getItem("LangChange") == "EN")
        { langEn(); }
    else { /* do nothing */}
	 /********Form Obtion***********/
    /****************************************************/
	$('#options').ready(function() {
		init_form ()  
		});
   /********Add Trace_URI***********/
	$('#ADD').on("click", function() { 
        createElement ("","");
    });
	/********save obtion ***********/
	$("#options").on('submit', function(event) {
		var Activities = [];
        var TraceURI = [];
		$.each($(this).serializeArray(), function(_, kv) {
			if (kv.name == "Trace_URI") 
				{
				TraceURI.push(kv.value);
				kango.storage.setItem("trace_options_"+kv.name, JSON.stringify(TraceURI));
				}
			else if (kv.name == "Activitie") {
                Activities.push(kv.value);
                kango.storage.setItem("trace_options_"+kv.name, JSON.stringify(Activities));
            }
            else
		      kango.storage.setItem("trace_options_"+kv.name, kv.value);
		});
   
     });
	 /********Form Obtion***********/
    /****************************************************/
    var eventObj= ["click","dblclick","Focus","keydown","keypress","mouseover","Load","keyup","change","mouseup"];	
	var index=0;
	var ADDB = "False";
    /******** event load site ***********/
	$ ("#Load").on('click', function() {
		var iframe = document.getElementsByTagName("iframe");
		URL = document.getElementById("URL").value;
		kango.storage.setItem("DATA", "True");  
		window.open(URL,"nom_popup","menubar=no, status=no, scrollbars=no, menubar=no, width=400, height=400");
	});
	
	$ ("#URL").on('keypress', function(e) {
	     if (e.keyCode==13){
		var iframe = document.getElementsByTagName("iframe");
		URL = document.getElementById("URL").value;
		kango.storage.setItem("DATA", "True");  
		window.open(URL,"nom_popup","menubar=no, status=no, scrollbars=no, menubar=no, width=400, height=400");
		e.preventDefault();
		}
	});
	
	kango.addMessageListener('Data', function(event) { 
        $('iframe').contents().find('head').html(event.data.header);
		$('iframe').contents().find('body').html(event.data.body);
		kango.console.log ("data for iframe recived ");
	});

	$("iframe").contents().find("body").on ('click', function(e) {
	   document.getElementById("SelectorT").value= getPath($(e.target)) ;    
	   e.preventDefault();
		
	});
  /******** Add event  ***********/
    $ ("#ADDEvent").on ('click', function()	{
        // Event div
            var eventdiv = document.createElement("div");
            eventdiv.setAttribute ("Id",index);
            var div = document.createElement("div");
            div.setAttribute ('class','input-group');
            var label = document.createElement("label");
            label.setAttribute('for','Event Type');
            label.setAttribute('class','control-label input-group-addon');
            label.appendChild(document.createTextNode("Event Type"));
            var select = document.createElement("select");
            select.setAttribute('class','form-control');
            select.setAttribute('Id','eventType');
            for (var j=0; j< eventObj.length; j++)
            {
            select.options[select.options.length] = new Option(eventObj[j],eventObj[j]);
            }
            div.appendChild(label);
            div.appendChild(select);
        // Selector div 
            var div1 = document.createElement("div");
            div1.setAttribute ('class','input-group');
            div1.setAttribute ('Id','Element');
            var label1 = document.createElement("label");
            label1.setAttribute('for','Selector');
            label1.setAttribute('class','control-label input-group-addon');
            label1.appendChild(document.createTextNode("Selector"));
            div1.appendChild(label1);
            var divC = document.createElement("input");
            divC.setAttribute ('id','selector');
			divC.setAttribute ('type','text');
			divC.setAttribute ('class','form-control');
            div1.appendChild(divC);
		// obsel type div
		    var div2 = document.createElement("div");
            div2.setAttribute ('class','input-group');
            div2.setAttribute ('Id','Type');
            var label2 = document.createElement("label");
            label2.setAttribute('for','TypeO');
            label2.setAttribute('class','control-label input-group-addon');
            label2.appendChild(document.createTextNode("Type Obsel"));
            div2.appendChild(label2);
            var divO = document.createElement("input");
            divO.setAttribute ('id','TypeO');
			divO.setAttribute ('type','text');
			divO.setAttribute ('class','form-control');
            div2.appendChild(divO);
            
			//
			eventdiv.appendChild(div);
            eventdiv.appendChild(div1);
			eventdiv.appendChild(div2);
			
            document.getElementById("EventList").appendChild(eventdiv);
            index++;
    });
  /******** event Save  Config  ***********/

    $("#Save").on("click", function() {
        var  URL = document.getElementById("URL").value;
        var eventArray= [];
        // parcourir all event $
        for (var i=0 ; i< index ; i++ )
        {
            var eventType = document.getElementById(i).getElementsByTagName("select")[0].value;
            var SelectorArray=[];
            // selector
            var SelectorObj={"frame":"", "Selector":$("#"+i+" #Element #selector").val()};
            SelectorArray.push(SelectorObj);
            var eventObj ={type:eventType,typeObsel:$("#"+i+" #TypeO").val(),selectors:SelectorArray};
            eventArray.push (eventObj);
       }
       
        // host or URL
        var Page = {URL: URL , HostName: "", event:eventArray };
        if ($('#URLCK').prop('checked')) 
        {
            var Page = {URL: URL , HostName: "", event:eventArray };
        }

        if ($('#Hostname').prop('checked')) 
        {
            hostname = getHostname (URL)
            var Page = {URL:"" , HostName: hostname, event:eventArray };
        }

      
	    if (kango.storage.getItem("Config") != undefined  ) 
        {
            var PageArray = kango.storage.getItem("Config").Page;
        }
        else
        {      
            kango.storage.setItem("Config",kango.i18n.getMessage('CalcoConfig'));
            var PageArray = JSON.parse(kango.storage.getItem("Config")).Page;
	
        }
        PageArray.push(Page);
	    Config = {Page:PageArray};
        kango.storage.setItem("Config",Config);
	    window.location.reload();
    })
// all function called 
 function init_form (){
    $("#options *[name='firstname']").val(kango.storage.getItem("trace_options_firstname"));
    $("#options *[name='last_name']").val(kango.storage.getItem("trace_options_last_name"));
    $("#options *[name='email']").val(kango.storage.getItem("trace_options_email"));
  //  $("#options *[name='Base_URI']").val(kango.storage.getItem("trace_options_Base_URI"));
    // $("#options *[name='Model_URI']").val(kango.storage.getItem("trace_options_Model_URI"));
   if  (kango.storage.getItem("trace_options_Trace_URI") != undefined)
	{
		var Activities = JSON.parse(kango.storage.getItem("trace_options_Activitie"));
        var TraceURI = JSON.parse(kango.storage.getItem("trace_options_Trace_URI"));
		for (i=0;i<TraceURI.length;i++)
		{ 
			if (i==0) 
                {
                    $("#options *[name='Trace_URI']").val(TraceURI[i]);
                    $("#options *[name='Activitie']").val(Activities[i]);
                }
		    else 
                {
                    createElement (TraceURI[i],Activities[i]); 
                }
           
    
		}
	}
}

function createElement (val1,val2) { 
    /*var obt = document.getElementById('Activities'); 
    var label = document.createElement("label");
    label.setAttribute('for','Trace_Name');
    label.setAttribute('class','control-label input-group-addon');
    var input = document.createElement("input");
    input.setAttribute('name','Trace_Name');
    input.setAttribute('type','text');
    input.setAttribute('class','form-control');
    input.setAttribute ('value',val);
	var obt = document.getElementById('Activities');
    obt.appendChild(label);
    obt.appendChild(input);*/
    var obt = document.getElementById('Activities'); 
        var div1 = document.createElement("div");
        div1.setAttribute ('class','input-group');
        div1.setAttribute ('Id','');
            var label1 = document.createElement("label");
            label1.setAttribute('for','Selector');
            label1.setAttribute('class','control-label input-group-addon');
            label1.appendChild(document.createTextNode(JSONObject.Trace_URI));
        div1.appendChild(label1);
            var divC = document.createElement("input");
            divC.setAttribute ('name','Trace_URI');
            divC.setAttribute ('type','text');
            divC.setAttribute ('value',val1);
            divC.setAttribute ('class','form-control');
        div1.appendChild(divC);

            var label2 = document.createElement("label");
            label2.setAttribute('for','Selector');
            label2.setAttribute('class','control-label input-group-addon');
            label2.appendChild(document.createTextNode(JSONObject.Activitie));
        div1.appendChild(label2);
            var divC1 = document.createElement("input");
            divC1.setAttribute ('name','Activitie');
            divC1.setAttribute ('type','text');
            divC1.setAttribute ('value',val2);
            divC1.setAttribute ('class','form-control');
        div1.appendChild(divC1);


    obt.appendChild(div1);
		}
//jQuery.fn.extend({
	function getPath ( e,path ) {
		// The first time this function is called, path won't be defined.
		if ( typeof path == 'undefined' ) path = '';

		// If this element is <html> we've reached the end of the path.
		if ( e.is('html') )
			return 'html' + path;

		// Add the element name.
		var cur = e.get(0).nodeName.toLowerCase();

		// Determine the IDs and path.
		var id    = e.attr('id');
		 var   classe = e.attr('class');


		// Add the #id if there is one.
		if ( typeof id != 'undefined' )
			cur += '#' + id;

		// Add any classes.
		if ( typeof classe != 'undefined' )
			cur += '.' + classe.split(/[\s\n]+/).join('.');

		// Recurse up the DOM.
		kango.console.log (e);
		return getPath( e.parent(),' > ' + cur + path );
	}
//});

function  getHostname (href) 
{
    var l = document.createElement("a");
    l.href = href;
    hostname = l.hostname ;
    return hostname;
};

    
});








