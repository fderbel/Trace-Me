
KangoAPI.onReady(function() 
{
	$('document').ready(function() 
		{
		init_form ()  
		});
    //event ADD

    var ADD = document.getElementById('ADD');
    var obt = document.getElementById('Activities');
 
	ADD.addEventListener("click", function() 
 { 
    createElement ("");
 });
	function createElement (val) 
		{  
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
    obt.appendChild(input);
		}
	$("#options").on('submit', function(event) 
		{
    var Activities= [];
    $.each($(this).serializeArray(), function(_, kv) 
    {
	     
        if (kv.name == "Trace_Name") 
        {
        Activities.push(kv.value);
        //localStorage["trace_options_"+kv.name]=JSON.stringify(Activities);
		kango.storage.setItem("trace_options_"+kv.name, JSON.stringify(Activities));
        }
        else 
       // localStorage["trace_options_"+kv.name] = kv.value;
	   kango.storage.setItem("trace_options_"+kv.name, kv.value);
    });
   
      });
	  
	  
	  function init_form ()
{
    $("#options *[name='first_name']").val(kango.storage.getItem("trace_options_first_name"));
    $("#options *[name='last_name']").val(kango.storage.getItem("trace_options_last_name"));
    $("#options *[name='email']").val(kango.storage.getItem("trace_options_email"));
   $("#options *[name='Base_URI']").val(kango.storage.getItem("trace_options_Base_URI"));
   $("#options *[name='Model_URI']").val(kango.storage.getItem("trace_options_Model_URI"));
   if  (kango.storage.getItem("trace_options_Trace_Name") == undefined)
   {}
   else 
   {
    var Activities = JSON.parse(kango.storage.getItem("trace_options_Trace_Name"));

    for (i=0;i<Activities.length;i++)
    { 
    if (i==0) {$("#options *[name='Trace_Name']").val(Activities[i]);}
    else {createElement (Activities[i]); }
    
    }
	}
}


var eventObj= ["click","dblclick","Focus","keydown","keypress","mouseover","Load","keyup","change","mouseup"];
    var elementObj =["DIV","P","SPAN","A","IMG","UL","LI","TABLE","FORM","BUTTON","INPUT"];
    var index=0;
	var ADDB = "False"

// event ADD 
    var ADD = document.getElementById('ADDEvent');
    ADD.addEventListener("click", function() 
    {
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
        // Element div 
            var div1 = document.createElement("div");
            div1.setAttribute ('class','input-group');
            div1.setAttribute ('Id','Element');
            var label1 = document.createElement("label");
            label1.setAttribute('for','ELement');
            label1.setAttribute('class','control-label input-group-addon');
            label1.appendChild(document.createTextNode("Element"));
            div1.appendChild(label1);
            var divC = document.createElement("div");
            divC.setAttribute ('class','form-control');
            for (var i=0;i < elementObj.length; i++)
            {
                var labelC = document.createElement("label") ;
                labelC.setAttribute('class','checkbox-inline');
                var inputC = document.createElement ("input");
                inputC.setAttribute('type','checkbox');
                inputC.setAttribute('name',elementObj[i]);
                labelC.appendChild (inputC);
                labelC.appendChild(document.createTextNode(elementObj[i]));
                divC.appendChild (labelC);
            }
			// attribute 
			//<input Id="URL" type="text" class="form-control"  placeholder="http://site.com/">
			var div2 = document.createElement("div");
            div2.setAttribute ('class','input-group');
            div2.setAttribute ('Id','Attribut');
            var label2 = document.createElement("label");
            label2.setAttribute('for','ELement');
            label2.setAttribute('class','control-label input-group-addon');
            label2.appendChild(document.createTextNode("Attribut"));
            div2.appendChild(label2);
            var divA = document.createElement("div");
            divA.setAttribute ('class','form-control');
			div2.appendChild(divA);
            div1.appendChild(divC);
            eventdiv.appendChild(div);
            eventdiv.appendChild(div1);
			eventdiv.appendChild(div2);
            document.getElementById("EventList").appendChild(eventdiv);
            index++;
			

 });

// event ADD 
  
// event Save 
    var Save = document.getElementById('Save');
    Save.addEventListener("click", function() 
    {
        var  URL = document.getElementById("URL").value;
        var eventArray= [];
        // parcourir all event $
        for (var i=0 ; i< index ; i++ )
        {
            var eventType = document.getElementById(i).getElementsByTagName("select")[0].value;
            var elementArray=[];
            // all element
            $("#"+i+" #Element > div.form-control > label > input:checked").each(function() 
            {
            var attributArray=[];
            var elementObj={"tag":this.name , "attribut":attributArray};
            elementArray.push(elementObj);
            });
           var eventObj ={type:eventType,element:elementArray};
           eventArray.push (eventObj);
       }
     var Page = {URL: URL , event:eventArray };
	 
     if (kango.storage.getItem("Config") != undefined  ) 
      {
            var PageArray = JSON.parse(kango.storage.getItem("Config")).Page;
      }
    else
     {      
    kango.storage.setItem("Config",JSON.stringify ( {"Page":[{"URL":"www.youtube.com","event":[{"type":"click","element":[{"tag":"BUTTON","attribut":[]},{"tag":"A","attribut":[]}]}]},{"URL":"www.google.fr","event":[{"type":"click","element":[{"tag":"SPAN","attribut":[]},{"tag":"A","attribut":[]},{"tag":"IMG","attribut":[]}]},{"type":"change","element":[{"tag":"INPUT","attribut":[]}]}]}]}));
  
	var PageArray = JSON.parse(kango.storage.getItem("Config")).Page;
			//PageArray=[];
     }
    PageArray.push(Page);
	
    Config = {Page:PageArray};
    kango.storage.setItem("Config",JSON.stringify(Config));
    window.location.reload();
})
    
});





// event Save






