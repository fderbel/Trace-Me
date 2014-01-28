
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
    
});





// event Save






