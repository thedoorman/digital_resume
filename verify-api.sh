#!/bin/bash

# Load environment variables
source .env

# Configure AWS CLI
aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
aws configure set region $AWS_DEFAULT_REGION

API_ID="ttzisvgb7j"

# Get the resource ID for /contactMe
RESOURCE_ID=$(aws apigateway get-resources \
    --rest-api-id $API_ID \
    --query 'items[?path==`/contactMe`].id' \
    --output text)

echo "Resource ID for /contactMe: $RESOURCE_ID" 