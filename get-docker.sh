#!/bin/bash

# Docker installation script for Linux systems
# This script installs Docker and Docker Compose

set -e

echo "🐳 Starting Docker installation..."

# Check if running on a supported system
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo "❌ This script is designed for Linux systems."
    echo "For other systems, please visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker is already installed
if command -v docker &> /dev/null; then
    echo "✅ Docker is already installed."
    docker --version
else
    echo "📦 Installing Docker..."
    
    # Update package index
    sudo apt-get update
    
    # Install prerequisites
    sudo apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release
    
    # Add Docker's official GPG key
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    
    # Set up the repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker Engine
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    echo "✅ Docker installed successfully!"
fi

# Check if Docker Compose is available
if docker compose version &> /dev/null; then
    echo "✅ Docker Compose is available."
    docker compose version
else
    echo "❌ Docker Compose not found. Please install it manually."
    exit 1
fi

# Add current user to docker group (optional, requires logout/login)
if ! groups | grep -q docker; then
    echo "📝 Adding current user to docker group..."
    sudo usermod -aG docker $USER
    echo "⚠️  Please log out and log back in for group changes to take effect."
fi

echo ""
echo "🎉 Docker installation complete!"
echo ""
echo "To get started with the Vacation Scheduler:"
echo "1. cd to the Business directory"
echo "2. Run: docker compose up -d"
echo "3. Access the app at: http://localhost:3000"
echo ""
echo "For development mode with hot-reload:"
echo "docker compose --profile dev up"
