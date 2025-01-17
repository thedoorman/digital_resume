#!/bin/bash

echo "Testing email API..."
curl -X POST https://api.jesseclark.dev/contactMe \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message from the API"
  }' \
  -v 