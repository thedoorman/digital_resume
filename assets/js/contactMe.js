function corsPost() {
  var name = document.getElementsByName("name")[0].value;
  var email = document.getElementsByName("email")[0].value;
  var message = document.getElementsByName("message")[0].value;
  var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://ttzisvgb7j.execute-api.us-east-1.amazonaws.com/prod/contactMe?name="+name+"&email="+email+"&message="+message,
  "method": "OPTIONS",
  "headers": {
    "access-control-allow-origin": "*",
    "access-control-allowheaders": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  }
}
console.log("Settings: " + settings)
$.ajax(settings).done(function (response) {
  console.log(response);
});
settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://ttzisvgb7j.execute-api.us-east-1.amazonaws.com/prod/contactMe?name="+name+"&email="+email+"&message="+message,
  "method": "POST",
  "headers": {
    "access-control-allow-origin": "*",
    "access-control-allowheaders": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  }
}
console.log("Settings: " + settings)
$.ajax(settings).done(function (response) {
  console.log(response);
});
  location.reload();
}

function post() {
  console.log("PREPARING POST MESSAGE")
  var data = null;

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
      console.log(this.responseText);
  }
  });

  xhr.open("POST", "https://ttzisvgb7j.execute-api.us-east-1.amazonaws.com/prod/contactMe?name=Jesse%20Clark&email=yourmom%40gmail.com&message=How%20are%20you%20doing%20you%20idiot!%3F");
  xhr.setRequestHeader("cache-control", "no-cache");
  xhr.setRequestHeader("access-control-allow-origin", "*");
  xhr.setRequestHeader("access-control-allowheaders", "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token");

  xhr.send(JSON.stringify(data));
  xhr.onloadend = function () {
    // done
  };
}