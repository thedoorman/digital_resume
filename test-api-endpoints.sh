#!/bin/bash

API_URL="https://api.jesseclark.dev/contactMe"
TIMEOUT=10

echo "🔍 Testing API Endpoints..."

# 1. Test DNS Resolution
echo -e "\n1. Testing DNS Resolution:"
host api.jesseclark.dev

# 2. Test Basic Connectivity
echo -e "\n2. Testing Basic Connectivity:"
curl -I --connect-timeout $TIMEOUT $API_URL

# 3. Test OPTIONS Request (CORS)
echo -e "\n3. Testing OPTIONS Request:"
curl -X OPTIONS -i \
  --connect-timeout $TIMEOUT \
  -H "Origin: https://jesseclark.io" \
  -H "Access-Control-Request-Method: POST" \
  $API_URL

# 4. Test POST Request with minimal data
echo -e "\n4. Testing POST with minimal data:"
curl -X POST \
  --connect-timeout $TIMEOUT \
  -H "Content-Type: application/json" \
  -d '{"test": true}' \
  $API_URL

# 5. Test POST Request with full data
echo -e "\n5. Testing POST with full data:"
curl -X POST \
  --connect-timeout $TIMEOUT \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test",
    "email": "test@example.com",
    "message": "Test message"
  }' \
  $API_URL

# 6. Test Lambda Function directly
echo -e "\n6. Testing Lambda Function directly:"
aws lambda invoke \
  --function-name contactMe \
  --payload '{"body": "{\"name\":\"API Test\",\"email\":\"test@example.com\",\"message\":\"Test message\"}"}' \
  response.json

echo -e "\nResponse from Lambda:"
cat response.json
rm response.json

# 7. Check Lambda Logs
echo -e "\n7. Recent Lambda Logs:"
aws logs get-log-events \
  --log-group-name /aws/lambda/contactMe \
  --log-stream-name $(aws logs describe-log-streams \
    --log-group-name /aws/lambda/contactMe \
    --order-by LastEventTime \
    --descending \
    --limit 1 \
    --query 'logStreams[0].logStreamName' \
    --output text) \
  --limit 10

# 8. Check API Gateway Stage
echo -e "\n8. API Gateway Stage Configuration:"
aws apigateway get-stage \
  --rest-api-id ttzisvgb7j \
  --stage-name prod

echo -e "\n✅ Testing Complete!" 