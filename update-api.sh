#!/bin/bash

# Load environment variables
source .env

# Configure AWS CLI
aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
aws configure set region $AWS_DEFAULT_REGION

API_ID="ttzisvgb7j"
RESOURCE_ID="gu10ua"

echo "Using API ID: $API_ID"
echo "Using Resource ID: $RESOURCE_ID"

# Update POST method integration
aws apigateway update-integration \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method POST \
    --patch-operations '[
        {
            "op": "replace",
            "path": "/type",
            "value": "AWS_PROXY"
        },
        {
            "op": "replace",
            "path": "/uri",
            "value": "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:500194254701:function:contactMe/invocations"
        },
        {
            "op": "replace",
            "path": "/integrationHttpMethod",
            "value": "POST"
        }
    ]'

# Deploy changes
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name prod \
    --description "Updated Lambda integration"

echo "API Gateway configuration updated!" 