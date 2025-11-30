# Use official .NET SDK image to build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies
COPY *.sln .
COPY CadabraTest.API/*.csproj ./CadabraTest.API/
RUN dotnet restore

# Copy everything else and build
COPY CadabraTest.API/. ./CadabraTest.API/
RUN dotnet publish -c Release -o out

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/CadabraTest.API/out .
EXPOSE 5000
ENTRYPOINT ["dotnet", "CadabraTest.API.dll"]
