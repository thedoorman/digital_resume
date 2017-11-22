console.log('INFO: Setting the createCorsRequest!')
var createCORSRequest = function(method, url) {
    console.log("INFO: Sending POST request");

    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
      // Most browsers.
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
      // IE8 & IE9
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      // CORS not supported.
      xhr = null;
    }
    return xhr;
  };
 
console.log('INFO: Grabbing parameters!')    
var name = document.getElementsByName("name")[0].value;
var email = document.getElementsByName("email")[0].value;
var message = document.getElementsByName("message")[0].value;
var url = 'https://ttzisvgb7j.execute-api.us-east-1.amazonaws.com/prod/contactMe?name='+name+'&email='+email+'&message='+message;
var method = 'POST';
console.log('INFO: URL: '+ url)        
var xhr = createCORSRequest(method, url);
xhr.onload = function() {
    // Success code goes here.
    console.log('SUCCESS: Made the call!')
    };
    
    xhr.onerror = function() {
    // Error code goes here.
    console.log('ERROR: Did not make the call!')
    
    };
    
    xhr.send();
  