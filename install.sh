#!/bin/bash

#get present working dir
CURRENT_DIR=$(pwd)

# Change directory to where your package.json is located
cd "$CURRENT_DIR"

# Run npm install
npm install

# Optional: Display message when done
echo "npm install completed."

# start the  installer
node installer.js

echo "install completed."


