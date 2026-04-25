#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies for the root (backend)
npm install

# Build the TypeScript backend
npm run build

# Install dependencies for the frontend
npm install --prefix frontend

# Build the frontend
npm run build --prefix frontend
