// will store reference to the XMLHttpRequest object
var xmlHttp = null; 

// creates an XMLHttpRequest instance
function createXmlHttpRequestObject() 
{
	// will store the reference to the XMLHttpRequest object
	var xmlHttp;
	// this should work for all browsers except IE6 and older
	try
	{
		// try to create XMLHttpRequest object
		xmlHttp = new XMLHttpRequest();
	}
	catch(e)
	{
		// assume IE6 or older
		var XmlHttpVersions = new Array("MSXML2.XMLHTTP.6.0",
		"MSXML2.XMLHTTP.5.0",
		"MSXML2.XMLHTTP.4.0",
		"MSXML2.XMLHTTP.3.0",
		"MSXML2.XMLHTTP",
		"Microsoft.XMLHTTP");
		// try every prog id until one works
		for (var i=0; i<XmlHttpVersions.length && !xmlHttp; i++) 
		{
			try 
			{ 
				// try to create XMLHttpRequest object
				xmlHttp = new ActiveXObject(XmlHttpVersions[i]);
			} 
			catch (e) {}
		}
	}
	// return the created object or display an error message
	if (!xmlHttp)
	alert("Error creating the XMLHttpRequest object.");
	else 
	return xmlHttp;
}

// initiates an AJAX request
function ajaxRequest(url, callback)
{
	// stores a reference to the function to be called when the response
	// from the server is received 
	var innerCallback = callback;
	// create XMLHttpRequest object when this method is first called
	if (!xmlHttp) xmlHttp = createXmlHttpRequestObject();
	// if the connection is clear, initiate new server request
	if (xmlHttp && (xmlHttp.readyState == 4 || xmlHttp.readyState == 0)) 

	{
		xmlHttp.onreadystatechange = handleGettingResults;
		xmlHttp.open("GET", url, true);
		xmlHttp.send(null);
	}
	else
	// if the connection is busy, retry after 1 second
	setTimeout("ajaxRequest(url,callback)", 1000);

	// called when the state of the request changes 
	function handleGettingResults() 
	{
		// move forward only if the transaction has completed
		if (xmlHttp.readyState == 4) 
		{
			// a HTTP status of 200 indicates the transaction completed 
			// successfully
			if (xmlHttp.status == 200) 
			{
				// execute the callback function, passing the server response
				innerCallback(xmlHttp.responseText)
			} 
			else
			{
				// display error message
				//alert("Couldn't connect to server");
			}
		}
	}
}

// initiates an AJAX request
function ajaxPost(url, callback, data)
{
	// stores a reference to the function to be called when the response
	// from the server is received 
	var innerCallback = callback;
	// create XMLHttpRequest object when this method is first called
	if (!xmlHttp) xmlHttp = createXmlHttpRequestObject();
	// if the connection is clear, initiate new server request
	if (xmlHttp && (xmlHttp.readyState == 4 || xmlHttp.readyState == 0)) 

	{
		xmlHttp.onreadystatechange = handleGettingResults;
		xmlHttp.open("POST", url, true);
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlHttp.setRequestHeader("Content-length", data.length);
		xmlHttp.setRequestHeader("Connection", "close");
		xmlHttp.send(data);
	}
	else
	// if the connection is busy, retry after 1 second
	alert("didn't post "+usr+" "+data);
	//setTimeout("ajaxPost(url, callback, data)", 1000);

	// called when the state of the request changes 
	function handleGettingResults() 
	{
		// move forward only if the transaction has completed
		if (xmlHttp.readyState == 4) 
		{
			// a HTTP status of 200 indicates the transaction completed 
			// successfully
			if (xmlHttp.status == 200) 
			{
				// execute the callback function, passing the server response
				innerCallback(xmlHttp.responseText)
			} 
			else
			{
				// display error message
				//alert("Couldn't connect to server");
			}
		}
	}
}
