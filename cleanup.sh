#!/bin/bash

# Load environment variables
source .env

# Configure AWS CLI
aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
aws configure set region $AWS_DEFAULT_REGION

# Assume role
echo "Assuming role..."
CREDENTIALS=$(aws sts assume-role \
    --role-arn $AWS_ROLE_ARN \
    --role-session-name "CleanupSession" \
    --duration-seconds 900)

export AWS_ACCESS_KEY_ID=$(echo $CREDENTIALS | jq -r .Credentials.AccessKeyId)
export AWS_SECRET_ACCESS_KEY=$(echo $CREDENTIALS | jq -r .Credentials.SecretAccessKey)
export AWS_SESSION_TOKEN=$(echo $CREDENTIALS | jq -r .Credentials.SessionToken)

# Verify permissions
echo "Verifying permissions..."
aws sts get-caller-identity

# List bucket contents before cleanup
echo "Current bucket contents:"
aws s3 ls s3://jesseclark.io --recursive
aws s3 ls s3://www.jesseclark.io/root/ --recursive

# Empty buckets
echo "Emptying jesseclark.io bucket..."
aws s3 rm s3://jesseclark.io --recursive

echo "Emptying www.jesseclark.io/root/ folder..."
aws s3 rm s3://www.jesseclark.io/root/ --recursive

# Verify buckets are empty
echo "Verifying buckets are empty..."
aws s3 ls s3://jesseclark.io --recursive
aws s3 ls s3://www.jesseclark.io/root/ --recursive

echo "Cleanup completed!" 