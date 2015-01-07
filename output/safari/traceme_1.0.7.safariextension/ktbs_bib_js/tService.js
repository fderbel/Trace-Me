/*
	require jQuery
*/

/** @namespace */
tService = {};

/** 
 * @namespace tService
 * @name TraceManager
 * @constructor 
 * @param options.base_uri 	URI of the base de traces
 * @param options.async 	The synchonized mode
 * @desc a tool to manage traces in a base de traces */
tService.TraceManager = function(options){
	this.base_uri = options.base_uri;
	this.async = options.async ? options.async : false;
	/** 
	 * @function
	 * @memberof TraceManager#
	 * @name init_trace
	 * @param t_options.name the name of the trace
	 * @desc initialize an remote trace */
	this.init_trace = function(t_options){
				
		var opt = {};
		opt.base_uri = this.base_uri;		
		opt.async = this.async;
		opt.name = t_options.name;
		opt.error = t_options.error;
		//opt.modelURI= t_options.modelURI;
		var trace = new tService.Trace(opt);

		
		return trace;
	}

}

/** 
 * @name Trace
 * @constructor 
 * @param options.base_uri 	URI of the base de traces
 * @param options.name 		the name of the trace
 * @param options.async 	The synchonized mode
 * @desc a generic trace */


tService.Trace = function(options){
	//this.trace_manager = options.trace_manager;
	this.base_uri = options.base_uri;
	this.name = options.name; 
	var errorCallback = options.error;
	this.trace_uri = this.base_uri+this.name+"/";
	this.model_uri = null ;
	var Trace = this;
	$.ajax({
			url: this.trace_uri,
			type: 'GET',
			dataType: 'json',
			error: function(jqXHR, textStatus, errorThrown){
					errorCallback(jqXHR, textStatus, errorThrown);
				},
			success: function (data){
						//var M = data["hasModel"].split("/");
						//Trace.model_name = M[1];
						//Trace.model_uri= Trace.base_uri+M[1];	
						M = new URLUtils(data["hasModel"], data["@id"]);
						Trace.model_uri = M.href
						

			}
		});

/** 
	 * @function
	 * @memberof Trace#
	 * @name save
	 * @param s_options.success the callback function if the save is successful
	 * @param s_options.error the callback function if the save is failed
	 * @desc save the trace into the base de traces */
	this.save = function(s_options){
		
		var base_uri = this.base_uri,
		name = this.name,
		successCallback = s_options.success,
		errorCallback = s_options.error,
		async = this.async,
		model_name = this.model_name;

		function trace2Turtle(name,ktbs_base_uri){
			
			var id = ktbs_base_uri + name;
			
			var prefixes = [];
			prefixes.push("@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .");
			prefixes.push("@prefix : <http://liris.cnrs.fr/silex/2009/ktbs#> .");
			//prefixes.push("@prefix : <"+ktbsobsel["model_uri"]+"> .");
			
			var statements = [];
			statements.push("<> :contains <"+id+"/>.");
			statements.push("<"+id+"/> a :StoredTrace.");
			statements.push("<"+id+"/> :hasModel <"+model_name+"/> .");
			statements.push("<"+id+"/> :hasOrigin \"1970-01-01T00:00:00Z\"^^xsd:dateTime.");
			
			// TODO
			
			return prefixes.join("\n")+"\n"+statements.join("\n");
		}
					
		//var obsel = obsel;
		var ctype = "text/turtle";
		//var id = item["id"];
		//var sync = this;
		var trace_in_turtle = trace2Turtle(name,base_uri);
		
		// post to ktbs
		jQuery.ajax({
			url: base_uri,
			type: 'POST',
			data: trace_in_turtle,
			contentType: ctype,
			crossDomain: true,
			success: function(ret){
					console.log("The trace ["+name+"] is created successfully!");
					successCallback(ret);
				},
			error: function(jqXHR, textStatus, errorThrown){
					
					console.log("E: The trace ["+name+"] cannot be created.");
					errorCallback(jqXHR, textStatus, errorThrown);
				},
			async: async
		});		
	}


/** 
	 * @function
	 * @memberof Trace#
	 * @name put_obsels
	 * @param s_options.success the callback function if the save is successful
	 * @param s_options.error the callback function if the save is failed
	 * @param s_options.obsel an obsel
	 * @desc put obsels into the trace in the base de traces */


this.put_obsels = function(s_options){

		var trace_uri = this.trace_uri,
			model_uri = this.model_uri,
			obsel = s_options.obsel,
			successCallback = s_options.success,
			errorCallback = s_options.error,
			async = this.async;
	
		function generateObselId(){
			
			var id = "C_"+obsel["hasType"]+"_"+(new Date()).getTime() + Math.floor(Math.random()*1000);
			return id;
		}
		var id = trace_uri + generateObselId();

		function obsel2Turtle(obsel, trace_uri, model_uri){
			
			var id = trace_uri + generateObselId();

			//obsel["id_ktbs"] = id;
            obsel["hasSubject"] = "obsel of trace : "+trace_uri ;
			var type = model_uri+"#"+obsel["hasType"];
			/*if (obsel["hasSuperType"] == undefined)
			{
			SuperType = model_uri+"#"+obsel["hasType"];
			}
			else 
			{var SuperType = model_uri+"#"+obsel["hasSuperType"];}*/
			
			var prefixes = [];
			prefixes.push("@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .");
			prefixes.push("@prefix ktbs: <http://liris.cnrs.fr/silex/2009/ktbs#> .");
			prefixes.push("@prefix : <"+type+"/> .");
				
			var statements = [];
			statements.push("<"+id+"> ktbs:hasTrace <>.");
			statements.push("<"+id+"> a <"+type+">.");
			statements.push("<"+id+"> ktbs:hasSubject \""+obsel["hasSubject"]+"\" .");
			//statements.push("<"+id+"> ktbs:hasBegin "+obsel["begin"]+" .");	
			//statements.push("<"+id+"> ktbs:hasEnd "+obsel["end"]+" .");
			
			jQuery.each(obsel, function(name,value){
				if(name!="hasType" && name!="hasSuperType" &&  name!="begin" && name!= "end" && name!= "hasSubject"){
					statements.push("<"+id+"> :"+name+" \""+value+"\" .");
				}
			});			
			
			// TODO
			
			return prefixes.join("\n")+"\n"+statements.join("\n");
		}
		
		//var obsel = obsel;
		var ctype = "text/turtle";
		var obsel_in_turtle = obsel2Turtle(obsel, trace_uri, model_uri);
	  // console.log (obsel_in_turtle);
		// post to server file 
		/*$.ajax({
                          type: 'POST',
                          url: 'http://dsi-liris-silex.univ-lyon1.fr/fderbel/Assist-TraceMe/Files/CreateFile.php',
                          data: {data : obsel_in_turtle, TraceURI : trace_uri }
		                  });*/
		
		// post to ktbs

		jQuery.ajax({
			url: trace_uri,
			type: 'POST',
			data: obsel_in_turtle,
			contentType: ctype,
                        
			crossDomain: true,
			success: function(ret){
					console.log("The obsel is sent successfully!");
					successCallback(ret);
				},
			error: function(jqXHR, textStatus, errorThrown){
					
					console.log("E: The obsel ["+id+"] cannot be sent.");
					errorCallback(jqXHR, textStatus, errorThrown);
				},
			
		});


	}

/** 
	 * @function
	 * @memberof Trace#
	 * @name get_obsels
	 * @param s_options.success the callback function if the save is successful
	 * @param s_options.error the callback function if the save is failed
	 * @param s_options.obsel an obsel
	 * @desc put obsels into the trace in the base de traces */	
	this.get_obsels = function(s_options){
		var trace_uri = this.trace_uri,
		successCallback = s_options.success,
		errorCallback = s_options.error,
		async = this.async;
		
		// post to ktbs
		jQuery.getJSON(trace_uri+"@obsels.json",function(data){
			var obsels = data["obsels"];
			
			$.each(obsels, function(obsel){
				// TODO
			});				
			successCallback(obsels);
		});
	}


}




  function URLUtils(url, baseURL) {
    var m = String(url).replace(/^\s+|\s+$/g, "").match(/^([^:\/?#]+:)?(?:\/\/(?:([^:@]*)(?::([^:@]*))?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
    if (!m) {
      throw new RangeError();
    }
    var href = m[0] || "";
    var protocol = m[1] || "";
    var username = m[2] || "";
    var password = m[3] || "";
    var host = m[4] || "";
    var hostname = m[5] || "";
    var port = m[6] || "";
    var pathname = m[7] || "";
    var search = m[8] || "";
    var hash = m[9] || "";
    if (baseURL !== undefined) {
      var base = new URLUtils(baseURL);
      var flag = protocol === "" && host === "" && username === "";
      if (flag && pathname === "" && search === "") {
        search = base.search;
      }
      if (flag && pathname.charAt(0) !== "/") {
        pathname = (pathname !== "" ? (((base.host !== "" || base.username !== "") && base.pathname !== "" ? "/" : "") + base.pathname.slice(0, base.pathname.lastIndexOf("/") + 1) + pathname) : base.pathname);
      }
      // dot segments removal
      var output = [];
      pathname.replace(/^(\.\.?(\/|$))+/, "")
        .replace(/\/(\.(\/|$))+/g, "/")
        .replace(/\/\.\.$/, "/../")
        .replace(/\/?[^\/]*/g, function (p) {
          if (p === "/..") {
            output.pop();
          } else {
            output.push(p);
          }
        });
      pathname = output.join("").replace(/^\//, pathname.charAt(0) === "/" ? "/" : "");
      pathname = output.join("").replace(/^\//, pathname.charAt(1) === "/" ? "" : "");
      if (flag) {
        port = base.port;
        hostname = base.hostname;
        host = base.host;
        password = base.password;
        username = base.username;
      }
      if (protocol === "") {
        protocol = base.protocol;
      }
      href = protocol + (host !== "" ? "//" : "") + (username !== "" ? username + (password !== "" ? ":" + password : "") + "@" : "") + host + pathname + search + hash;
    }
    this.href = href;
    this.origin = protocol + (host !== "" ? "//" + host : "");
    this.protocol = protocol;
    this.username = username;
    this.password = password;
    this.host = host;
    this.hostname = hostname;
    this.port = port;
    this.pathname = pathname;
    this.search = search;
    this.hash = hash;
  }
 
  