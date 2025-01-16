#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    source .env
else
    echo "❌ .env file not found"
    exit 1
fi

# Check required environment variables
echo "Checking environment variables..."
for var in AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_DEFAULT_REGION CLOUDFRONT_DISTRIBUTION_ID AWS_ROLE_ARN; do
    if [ -z "${!var}" ]; then
        echo "❌ $var is not set"
    else
        echo "✅ $var is set"
    fi
done

# Configure AWS CLI
aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
aws configure set region $AWS_DEFAULT_REGION

# Verify AWS credentials
echo "Verifying AWS credentials..."
aws sts get-caller-identity

# Try to assume role
echo "Attempting to assume role..."
CREDENTIALS=$(aws sts assume-role \
    --role-arn $AWS_ROLE_ARN \
    --role-session-name "LocalDeploymentTest" \
    --duration-seconds 900)

if [ $? -eq 0 ]; then
    echo "✅ Successfully assumed role"
    export AWS_ACCESS_KEY_ID=$(echo $CREDENTIALS | jq -r .Credentials.AccessKeyId)
    export AWS_SECRET_ACCESS_KEY=$(echo $CREDENTIALS | jq -r .Credentials.SecretAccessKey)
    export AWS_SESSION_TOKEN=$(echo $CREDENTIALS | jq -r .Credentials.SessionToken)
    
    # Verify assumed role
    echo "Verifying assumed role..."
    aws sts get-caller-identity

    # Test S3 access
    echo "Testing S3 access..."
    aws s3 ls s3://jesseclark.io

    # Test CloudFront access
    echo "Testing CloudFront access..."
    aws cloudfront get-distribution --id $CLOUDFRONT_DISTRIBUTION_ID

    # Test CloudFront invalidation
    echo "Testing CloudFront invalidation..."
    aws cloudfront create-invalidation \
        --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
        --paths "/index.html" "/assets/*"

    echo "✅ All tests passed!"
else
    echo "❌ Failed to assume role"
    exit 1
fi 