#!/bin/bash

# Navigate to your project folder
cd CadabraTest.API

# Restore dependencies
dotnet restore

# Build the project
dotnet build --configuration Release

# Run the project on the assigned PORT
dotnet run --urls=http://0.0.0.0:$PORT
