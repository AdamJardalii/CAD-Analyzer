# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution and project files
COPY CadabraTest.sln .
COPY CadabraTest.API/CadabraTest.API.csproj ./CadabraTest.API/

# Restore dependencies
RUN dotnet restore

# Copy all files
COPY . .

# Build and publish
RUN dotnet publish CadabraTest.API/CadabraTest.API.csproj -c Release -o /app/out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 5000
ENTRYPOINT ["dotnet", "CadabraTest.API.dll"]
