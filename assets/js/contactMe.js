function corsPost() {
  console.log("INFO: Sending POST request");
  var name = document.getElementsByName("name")[0].value;
  var email = document.getElementsByName("email")[0].value;
  var message = document.getElementsByName("message")[0].value;
  var settings = {
  "headers": {
    "Accept": "application/json",
    "cache-control": "no-cache",

  },
  "crossDomain": true,
  "url": "https://ttzisvgb7j.execute-api.us-east-1.amazonaws.com/prod/contactMe?name="+name+"&email="+email+"&message="+message,
  "data": "",
  "method": "POST",
}
console.log("Settings: " + 
" Async: " + settings.async +
" Crossdomain: " + settings.crossDomain +
" url: " + settings.url +
" data: " + settings.data +
" method: " + settings.method +
" headers: " + settings.headers);

$.ajax(settings).done(function (response) {
  console.log(response);
});

}
/*"Access-Control-Allow-Origin": "*",
"Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",*/