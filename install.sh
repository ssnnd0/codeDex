#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Update package lists
echo "Updating package lists..."
sudo apt-get update

# Install Node.js and npm if not already installed
if ! command -v node &> /dev/null
then
    echo "Node.js not found. Installing Node.js and npm..."
    sudo apt-get install -y nodejs npm
else
    echo "Node.js is already installed."
fi

# Install project dependencies
echo "Installing project dependencies..."
npm install --legacy-peer-deps

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    echo "RAPIDAPI_KEY=your_rapidapi_key_here" > .env
    echo "Please update the RAPIDAPI_KEY in the .env file with your actual key."
fi

echo "Installation complete!"
echo "To start the development server, run: npm run dev"
