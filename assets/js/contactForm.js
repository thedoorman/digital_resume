var createCORSRequest = function(method, url) {
    console.log("INFO: Sending POST request");
    var { name, email, message } = getParams();
    url += 'name='+name+'&email='+email+'&message='+message;
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
  
  var url = 'https://ttzisvgb7j.execute-api.us-east-1.amazonaws.com/prod/contactMe?';
  var method = 'POST';
  var xhr = createCORSRequest(method, url);
  
  xhr.onload = function() {
    // Success code goes here.
  };
  
  xhr.onerror = function() {
    // Error code goes here.
  };
  
  xhr.send();

function getParams() {
    var name = document.getElementsByName("form_name")[0].textContent;
    var email = document.getElementsByName("form_email")[0].textContent;
    var message = document.getElementsByName("form_message")[0].textContent;
    return { name, email, message };
}
