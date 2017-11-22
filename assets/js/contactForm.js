var createCORSRequest = function(method, url, name, email, message) {
    console.log("INFO: Sending POST request");
    var name = document.getElementsByName("name")[0].val;
    var email = document.getElementsByName("email")[0].val;
    var message = document.getElementsByName("message")[0].val;
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
  
  var url = 'https://ttzisvgb7j.execute-api.us-east-1.amazonaws.com/prod/contactMe?name='+name+'&email='+email+'&message='+message;
  var method = 'POST';
  var xhr = createCORSRequest(method, url);
  
  xhr.onload = function() {
    // Success code goes here.
  };
  
  xhr.onerror = function() {
    // Error code goes here.
  };
  
  xhr.send();