var http = require("https");

function postReq(){
    var options = {
    "method": "POST",
    "hostname": "ttzisvgb7j.execute-api.us-east-1.amazonaws.com",
    "port": null,
    "path": "/prod/contactMe?name=Jesse%20Clark&email=yourmom%40gmail.com&message=How%20are%20you%20doing%20you%20idiot!%3F",
    "headers": {
        "cache-control": "no-cache",
        "postman-token": "2bb56b25-b20d-55fd-769b-09dbe4431ba3"
    }
    };

    var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
    });
    });

    req.end();
}