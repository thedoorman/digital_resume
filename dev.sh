#!/bin/bash

# Create CSS directory if it doesn't exist
mkdir -p assets/css

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    echo "Visit https://nodejs.org/ to download and install Node.js"
    exit 1
fi

# Check if browser-sync is installed globally or locally
if ! command -v browser-sync &> /dev/null; then
    echo "📦 Installing browser-sync locally..."
    # Create package.json if it doesn't exist
    if [ ! -f package.json ]; then
        npm init -y > /dev/null 2>&1
    fi
    # Install browser-sync as a dev dependency
    npm install --save-dev browser-sync
    echo "✅ browser-sync installed successfully"
fi

# Use local browser-sync from node_modules
BROWSER_SYNC="./node_modules/.bin/browser-sync"

# Function to find an available port
find_available_port() {
    local port=$1
    while ! nc -z localhost $port 2>/dev/null; do
        return 0
    done
    return 1
}

# Find available ports
BS_PORT=3000
while ! find_available_port $BS_PORT; do
    BS_PORT=$((BS_PORT + 1))
done

# Compile Sass with correct flags
sass --watch assets/sass:assets/css \
    --style=compressed \
    --source-map \
    --load-path=assets/sass/libs \
    --load-path=assets/sass/base \
    --load-path=assets/sass/components \
    --load-path=assets/sass/layout &
SASS_PID=$!

# Start browser-sync using local installation
$BROWSER_SYNC start \
    --server \
    --port $BS_PORT \
    --files "assets/css/*.css, *.html, assets/js/*.js" \
    --no-notify \
    --no-open &
BS_PID=$!

# Handle script termination
trap 'kill $SASS_PID $BS_PID 2>/dev/null || true' EXIT

echo "🚀 Development server running at http://localhost:$BS_PORT"
echo "📦 Sass watching for changes"
echo "🔄 Auto-reload enabled"
echo "Press Ctrl+C to stop"

# Keep script running
wait 