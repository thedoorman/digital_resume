#!/bin/bash

# Load environment variables
source .env

# Configure AWS CLI
aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
aws configure set region $AWS_DEFAULT_REGION

# Test Lambda directly with proper event structure
echo "Testing Lambda function..."
aws lambda invoke \
    --function-name contactMe \
    --payload '{
        "body": "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"message\":\"Test Message\"}",
        "requestContext": {
            "http": {
                "method": "POST",
                "path": "/contactMe"
            }
        },
        "headers": {
            "content-type": "application/json"
        }
    }' \
    response.json

echo "Lambda Response:"
cat response.json 