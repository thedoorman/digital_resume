#!/bin/bash

# Load environment variables
source .env

# Create a properly encoded test event
echo '{
    "version": "2.0",
    "routeKey": "POST /contactMe",
    "rawPath": "/contactMe",
    "rawQueryString": "",
    "headers": {
        "content-type": "application/json"
    },
    "requestContext": {
        "http": {
            "method": "POST",
            "path": "/contactMe"
        }
    },
    "body": "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"message\":\"Test Message\"}"
}' > event.json

# Test Lambda with the event file
echo "Testing Lambda function..."
aws lambda invoke \
    --function-name contactMe \
    --payload fileb://event.json \
    --cli-binary-format raw-in-base64-out \
    response.json

echo -e "\nResponse:"
cat response.json

# Clean up
rm event.json response.json 