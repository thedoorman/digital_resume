#!/bin/bash

echo "Testing connectivity..."

# Test known working endpoint first
echo -e "\nTesting connectivity to api.github.com:"
curl -X GET https://api.github.com -I

# Test our API endpoint
echo -e "\nTesting our API endpoint:"
curl -X OPTIONS https://api.jesseclark.dev/contactMe \
  --connect-timeout 5 \
  -v

# Test with IP directly (if DNS resolves)
echo -e "\nTesting with IP directly:"
curl -X OPTIONS https://149.28.120.133/contactMe \
  -H "Host: api.jesseclark.dev" \
  --connect-timeout 5 \
  -v

echo -e "\nTests completed!" 