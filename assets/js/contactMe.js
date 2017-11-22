function corsPost() {
  var name = document.getElementsByName("name")[0].value;
  var email = document.getElementsByName("email")[0].value;
  var message = document.getElementsByName("message")[0].value;
  var settings = {
  "async": true,
  "crossDomain": false,
  "url": "https://ttzisvgb7j.execute-api.us-east-1.amazonaws.com/prod/contactMe?name="+name+"&email="+email+"&message="+message,
  "method": "POST",
  "headers": {
    "access-control-allow-origin": "*",
    "access-control-allowheaders": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  }
}
console.log("Settings: " + 
" Async: " + settings.async +
" Crossdomain: " + settings.crossDomain +
" url: " + settings.url +
" method: " + settings.method +
" headers: " + settings.headers)

$.ajax(settings).done(function (response) {
  console.log(response);
});

}