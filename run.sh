#!/bin/bash
set -e

# Print colored output
function echo_info() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

function echo_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1"
}

function echo_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo_error "Docker is not installed. Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! docker compose version &> /dev/null; then
    if ! command -v docker-compose &> /dev/null; then
        echo_error "Docker Compose is not installed. Please install Docker Compose first: https://docs.docker.com/compose/install/"
        exit 1
    else
        COMPOSE_CMD="docker-compose"
    fi
else
    COMPOSE_CMD="docker compose"
fi

echo_info "Building Docker image (if needed)..."
$COMPOSE_CMD build run

echo_info "Running Carv script..."
$COMPOSE_CMD run --rm run "$@"

echo_success "Done!" 