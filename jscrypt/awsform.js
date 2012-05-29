window.onload=formclear;

function OnPostForm()
//try to make ajax....
//since we are posting a form/multi-data we need to separate the parts
//with a boundary and upload each piece
//ajaxPost(url, callback, data)
//where data is of the form:lorem=ipsum&name=binny
{
	var key = document.getElementById('key');
	var email = document.getElementById('email');
	var cryptfile=Base64.encode(Crypto.HMAC(Crypto.SHA256, email.value, key.value, { asString: true }));
	var jsText = document.getElementById('pfile').innerHTML;
	var decryptfile=Crypto.HMAC(Crypto.SHA256, email.value, key.value, { asString: true });
	var encjsText=Base64.encode(Crypto.AES.encrypt(jsText, decryptfile));
	//encjsText=jsText;
	//document.getElementById('file').innerHTML=encjsText;
	var data="file="+encjsText+"&acl=public-read&key="+awsjsdir+(cryptfile)+".js&content-type=text/html&";
	data+="AWSAccessKeyId="+awsaccesskeyid+"&policy="+awspolicy+"&signature="+awssignature;
	//document.getElementById('file').innerHTML=data;
	//setTimeout ( "parent.location=\"http://"+awsbucket+".s3.amazonaws.com/"+awsfilename+"\";", 100 );
	//document.myform.action ="http://s3.amazonaws.com/"+awsbucket;
	ajaxPost("http://s3.amazonaws.com/"+awsbucket, alert, data)
	return true;
}

function OnSubmitForm()
{
	var key = document.getElementById('key');
	var email = document.getElementById('email');
	var cryptfile=Base64.encode(Crypto.HMAC(Crypto.SHA256, email.value, key.value, { asString: true }));
	var jsText = document.getElementById('pfile').innerHTML;
	var decryptfile=Crypto.HMAC(Crypto.SHA256, email.value, key.value, { asString: true });
	var encjsText=Base64.encode(Crypto.AES.encrypt(jsText, decryptfile));
	var awsaccesskeyid=userpass['awsaccesskeyid'][0];
	var awspolicy=userpass['awspolicy'][0];
	var awssignature=userpass['awssignature'][0];

	document.getElementById('file').innerHTML=encjsText;
	
	if (document.getElementById('acl')==null){
	var newval=document.createElement("input");
	newval.setAttribute("type","hidden");
	newval.setAttribute("id","acl");
	newval.setAttribute("name","acl");
	newval.setAttribute("value","public-read");   
	document.getElementById("myform").insertBefore(newval,document.getElementById("myform").firstChild);

	newval=document.createElement("input");
	newval.setAttribute("type","hidden");
	newval.setAttribute("name","key");
	newval.setAttribute("value",awsjsdir+(cryptfile)+".js");   
	document.getElementById("myform").insertBefore(newval,document.getElementById("myform").firstChild);

	newval=document.createElement("input");
	newval.setAttribute("type","hidden");
	newval.setAttribute("name","content-type");
	newval.setAttribute("value","text/html");   
	document.getElementById("myform").insertBefore(newval,document.getElementById("myform").firstChild);

	newval=document.createElement("input");
	newval.setAttribute("type","hidden");
	newval.setAttribute("name","AWSAccessKeyId");
	newval.setAttribute("value",awsaccesskeyid);   
	document.getElementById("myform").insertBefore(newval,document.getElementById("myform").firstChild);

	newval=document.createElement("input");
	newval.setAttribute("type","hidden");
	newval.setAttribute("name","policy");
	newval.setAttribute("value",awspolicy);   
	document.getElementById("myform").insertBefore(newval,document.getElementById("myform").firstChild);

	newval=document.createElement("input");
	newval.setAttribute("type","hidden");
	newval.setAttribute("name","signature");
	newval.setAttribute("value",awssignature);   
	document.getElementById("myform").insertBefore(newval,document.getElementById("myform").firstChild);
	}
	//setTimeout ( "parent.location=\"http://"+awsbucket+".s3.amazonaws.com/"+awsfilename+"\";", 100 );
	document.myform.action ="http://s3.amazonaws.com/"+awsbucket;

	return true;
}

function formclear() {

	delete userpass;
	document.getElementById('email').value="";
	document.getElementById('key').value="";
	document.getElementById('site').value="";
	document.getElementById('user').value="";
	document.getElementById('urllink').href="";
	document.getElementById('urllink').innerText="";
	document.getElementById('url').value="";
	document.getElementById('decr').value="";
	document.getElementById('workspace').innerHTML="<br><br>";
	document.getElementById('pfile').innerHTML="";
	document.getElementById('key-jquery-hashmask-sparkline').innerHTML="";
	runPassword('', 'decr');
}
function addpolicy(){
	var key = document.getElementById('key').value;
	var email = document.getElementById('email').value;
	var awskey=document.getElementById('awskey').value;
	awsaccesskeyid=document.getElementById('awsid').value;
	
	if (key.length==0 || email.length==0) {
	alert("Please enter a email and key.");
	return;
	}

	if (awskey.length==0 || awsaccesskeyid.length==0) {
	alert("Please enter aws key id and secret key id .");
	return;
	}

	var cryptfile=Base64.encode(Crypto.HMAC(Crypto.SHA256, email, key, { asString: true }));

	var policy64="eyJleHBpcmF0aW9uIjoiMjAxOS0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W3siYnVja2V0IjoiIn0seyJhY2wiOiJwdWJsaWMtcmVhZCJ9LFsiZXEiLCIka2V5IiwiIl0sWyJzdGFydHMtd2l0aCIsIiRDb250ZW50LVR5cGUiLCJ0ZXh0L2h0bWwiXV19";
	var policy=Base64.decode(policy64);
	var poljs=JSON.parse(policy);
	poljs['conditions'][0]['bucket']=awsbucket;
	poljs['conditions'][2][2]=awsjsdir+cryptfile+".js";
	var newpoly=JSON.stringify(poljs);
	var awspolicy=Base64.encode(newpoly);
	var awssignature=b64_hmac_sha1(awskey, awspolicy);
	var template={'passconfig':['1',''],'awsaccesskeyid':[awsaccesskeyid,''],'awspolicy':[awspolicy,''],'awssignature':[awssignature,''],'eof':['','']};
	var jsontemplate=JSON.stringify(template);
	document.getElementById('pfile').innerHTML=jsontemplate;
	userpass=template;
}
function addpass(){
	var site = document.getElementById('site').value;
	var key = document.getElementById('key').value;
	var user = document.getElementById('user').value;
	var url = document.getElementById('url').value;
	var urllink = document.getElementById('urllink');
	var decr = document.getElementById('decr').value;
	var wspace = document.getElementById('pfile');
	
	//var cryptkey=Crypto.HMAC(Crypto.SHA256, site, Crypto.HMAC(Crypto.SHA256, email, key, { asString: true }), { asString: true });	
	var cryptkey=Crypto.HMAC(Crypto.SHA256, site, key, { asString: true });
	var toaddc = Base64.encode(cryptkey);
	var toadd = site;
	
	var whtml="{";

	for ( var iu in userpass ){
		if (iu!=toadd && iu!=toaddc && iu!='eof') {
		urltmp=userpass[iu][2]==undefined?'':userpass[iu][2];
			whtml+="'"+iu+"': ['"+userpass[iu][0]+"','"+userpass[iu][1]+"','"+urltmp+"'],\n";
			}
	}
	
	toadd=document.getElementById('clear').checked ? toaddc : toadd;
	
	whtml+="'"+toadd+"': ['"+Base64.encode(Crypto.AES.encrypt(user, cryptkey))+"','"+Base64.encode(Crypto.AES.encrypt(decr, cryptkey))+"','"+Base64.encode(Crypto.AES.encrypt(url, cryptkey))+"'],\n";
	whtml+="'eof':['','','']}";
	wspace.innerHTML=whtml;
	if (awsdebug==0){
		OnSubmitForm();	
		document.getElementById('myform').submit();
	}else{
		userpass=eval("("+whtml+")");
	}
	urllink.innerText=url;
	urllink.href="http://"+url;
}

function delpass(){
	var site = document.getElementById('site').value;
	var key = document.getElementById('key').value;
	var wspace = document.getElementById('pfile');
	
	//var cryptkey=Crypto.HMAC(Crypto.SHA256, site, Crypto.HMAC(Crypto.SHA256, email, key, { asString: true }), { asString: true });	
	var cryptkey=Crypto.HMAC(Crypto.SHA256, site, key, { asString: true });
	var todeletec = Base64.encode(cryptkey);
	var todelete = site;
	
	var whtml="{";

	for ( var iu in userpass ){
		if (iu!=todelete && iu!=todeletec && iu!='eof'){
			url=userpass[iu][2]==undefined?'':userpass[iu][2];
			whtml+="'"+iu+"': ['"+userpass[iu][0]+"','"+userpass[iu][1]+"','"+url+"'],\n";
		}
	}
	whtml+="'eof':['','','']}";
	wspace.innerHTML=whtml;
	if (awsdebug==0){
		OnSubmitForm();	
		document.getElementById('myform').submit();
	}else{
		userpass=eval("("+whtml+")");
	}
}

function getpass() {
	var key = document.getElementById('key').value;
	var email = document.getElementById('email').value;
	var site = document.getElementById('site').value;
	var user = document.getElementById('user').value;
	var url = document.getElementById('url').value;
	var decr = document.getElementById('decr').value;
	var wspace = document.getElementById('workspace');
	userpass=null;

	var cachedate=(new Date()).getTime();
	var cryptfile=Base64.encode(Crypto.HMAC(Crypto.SHA256, email, key, { asString: true }));
	var cryptbucket=Base64.encode(Crypto.HMAC(Crypto.SHA256, key, email, { asString: true }));

	//var cryptkey=Crypto.HMAC(Crypto.SHA256, site, Crypto.HMAC(Crypto.SHA256, email, key, { asString: true }), { asString: true });
	var cryptkey=Crypto.HMAC(Crypto.SHA256, site, key, { asString: true });
	var lookupc = Base64.encode(cryptkey);
	var lookup = site;
	
	wspace.innerHTML= "<pre>'"+lookup+"':<br>&nbsp;['"+Base64.encode(Crypto.AES.encrypt(user, cryptkey))+"',&nbsp;'"+Base64.encode(Crypto.AES.encrypt(decr, cryptkey))+"',&nbsp;'"+Base64.encode(Crypto.AES.encrypt(url, cryptkey))+"']&nbsp;<br>"+awsjsdir+cryptfile+".js&nbsp;</pre>";

	ajaxRequest("http://"+awsbucket+".s3.amazonaws.com/"+awsjsdir+encodeURIComponent(cryptfile)+".js?cache="+cachedate,formfind);
}

//callback from ajax request to get the password file (in encrypted format)
function formfind(encjsText) {
	var key = document.getElementById('key').value;
	var email = document.getElementById('email').value;
	var site = document.getElementById('site').value;
	var user = document.getElementById('user');
	var url = document.getElementById('url');
	var urllink = document.getElementById('urllink');
	var decr = document.getElementById('decr');
	var wspace = document.getElementById('workspace');
	var cryptfile=Base64.encode(Crypto.HMAC(Crypto.SHA256, email, key, { asString: true }));
	
	document.getElementById('pfile').innerHTML=encjsText;
	//var cryptkey=Crypto.HMAC(Crypto.SHA256, site, Crypto.HMAC(Crypto.SHA256, email, key, { asString: true }), { asString: true });
	
	var cryptkey=Crypto.HMAC(Crypto.SHA256, site, key, { asString: true });
	var lookupc = Base64.encode(cryptkey);
	var lookup = site;
	
	var jsText="";
	
	try {
	var decryptfile=Crypto.HMAC(Crypto.SHA256, email, key, { asString: true });
	jsText=Crypto.AES.decrypt(Base64.decode(encjsText), decryptfile);
	}
	catch(err){
	jsText=encjsText;
	alert("Passwords not doubly encrypted.  Press More->Debug->Save");
	}
	userpass=eval("("+jsText+")");
	document.getElementById('pfile').innerHTML=jsText;

	user.value="";
	decr.value="";
	url.value="";
	urllink.href="";
	urllink.innerText="";
	runPassword('', 'decr');

	if (!userpass) {
		alert("Please check that your password is correct");
		return false;
	}
		
	var siteuser="";
	var sitepass="";
		
	if (userpass[lookup]){
		siteuser=userpass[lookup][0];
		sitepass=userpass[lookup][1];
		siteurl=userpass[lookup][2];
		document.getElementById('clear').checked=false;
		
	}else if (userpass[lookupc]) {
		siteuser=userpass[lookupc][0];
		sitepass=userpass[lookupc][1];
		siteurl=userpass[lookupc][2];
		document.getElementById('clear').checked=true;
	
	} else {
		//	alert("Please enter a site to retrieve usename and passowrd");
		return false;
	}
	
	lookup=document.getElementById('clear').checked ? lookupc : lookup;
	wspace.innerHTML= "<pre>'"+lookup+"':<br>&nbsp;['"+Base64.encode(Crypto.AES.encrypt(user.value, cryptkey))+"',&nbsp;'"+Base64.encode(Crypto.AES.encrypt(decr.value, cryptkey))+"',&nbsp;'"+Base64.encode(Crypto.AES.encrypt(url.value, cryptkey))+"']&nbsp;<br>"+awsjsdir+cryptfile+".js&nbsp;</pre>";
		
	//decr.value=Crypto.AES.encrypt(sitepass, cryptkey);
	user.value=Crypto.AES.decrypt(Base64.decode(siteuser),cryptkey);
	decr.value=Crypto.AES.decrypt(Base64.decode(sitepass),cryptkey);
	if (siteurl!=undefined){
		url.value=Crypto.AES.decrypt(Base64.decode(siteurl),cryptkey);
		urllink.innerText=Crypto.AES.decrypt(Base64.decode(siteurl),cryptkey);
		urllink.href="http://"+Crypto.AES.decrypt(Base64.decode(siteurl),cryptkey);
	}
	runPassword(decr.value, 'decr');
	decr.focus();
	decr.select();
}

awsdebug=0;
awsmore=0;

function awsshowdbg(){
	var awsdiv=document.getElementById("divform");
	if (awsdebug==0) {
		awsdebug=1;
		awsdiv.style.visibility="visible";
	}else{
		awsdebug=0;
		awsdiv.style.visibility="hidden";
	}
}

function awsshowmore(){
	var awsrow=document.getElementById("awsmore");
	var awsrand=document.getElementById("awsrand");
	var urlbox=document.getElementById("urlbox");
	if (awsmore==0) {
		awsmore=1;
		awsrow.style.visibility="visible";
		awsrand.style.visibility="visible";
		urlbox.style.visibility="visible";
	}else{
		awsmore=0;
		awsrow.style.visibility="hidden";
		awsrand.style.visibility="hidden";
		urlbox.style.visibility="hidden";
		var awsdiv=document.getElementById("divform");
		awsdebug=0;
		awsdiv.style.visibility="hidden";
	}
}

function randomPass(){
    
	var decr=document.getElementById('decr');
	decr.value=GenerateAndValidate(12,1);
	decr.focus();
	decr.select();

}