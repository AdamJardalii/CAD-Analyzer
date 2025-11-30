# CADABRA Take-Home Exam

## Hello! 👋

Welcome to the CADABRA take-home exam! We're excited to see what you can build.

### Important: Deadline

**Your solution is due on Sunday, November 30th at 11:59 PM Lebanese Standard Time.**

### About This Exam

This is a take-home assignment where you'll build a **CAD Part Analysis API** using ASP.NET Core. The goal is to assess your ability to implement a RESTful API, work with services, handle file uploads, and structure code effectively.

### How to Get the Starter Code

**Download the starter code from Google Drive**: [Download Starter Code](https://drive.google.com/file/d/1AQMJWMNVz0AL_NeDQjeP6W4jyTdTWnok/view?usp=sharing)

1. Download and extract the ZIP file
2. Work on your solution locally

### How to Submit

**Submit your solution via Google Drive**:

1. **Create a ZIP file** of your completed `CadabraTest` folder
2. **Upload to Google Drive** along with your optional demo video (if you made one)
3. **Share the Drive link** via email to team@cadabrai.com

### What You Should Know

- **Not Timed**: This is **not a timed exam** - take your time to build a quality solution. Work at your own pace.
- **Open Resources**: You are welcome to use **any resources** you need
- **Structure**: This exam has:
  - **Required parts**: Must be completed (service implementations, core endpoints)
  - **Open-ended parts**: You have flexibility in how you implement them (storage choice, additional endpoints, optional AI integration)
- **Goal**: Demonstrate your ability to build a working API that meets the requirements. Focus on clean, functional code rather than perfection.

### What You'll Build

You'll be implementing a CAD Part Analysis API that:

- Receives CAD part files (as JSON mock data)
- Extracts metadata from those files (dimensions, material, mass, etc.)
- Analyzes the parts and generates insights/recommendations
- Stores the analysis results so they can be retrieved later

Don't worry - we've provided starter code, clear instructions, and sample data. Read through this README carefully, and if you have questions, please reach out!

Good luck!

---

## Problem Overview

You are building a **CAD Part Analysis API** that processes CAD part files, extracts metadata, generates insights, and stores the results for later retrieval. This is a RESTful API built with ASP.NET Core.

### What the API should do:

1. **Receives** CAD part files (as JSON mock data in this exam)
2. **Extracts** metadata from those files (dimensions, material, mass, etc.)
3. **Analyzes** the parts and generates insights/recommendations
4. **Stores** the analysis results so they can be retrieved later

---

## Understanding Swagger UI

### What is Swagger?

**Swagger UI** is an interactive API documentation and testing tool that's already configured in this project. It provides a web-based interface where you can:

- **View all available endpoints** - See what APIs are exposed
- **Test endpoints interactively** - Click buttons, fill forms, and see responses
- **Upload files** - Easily test file upload endpoints
- **See request/response formats** - Understand what data structures are expected
- **Debug your API** - Quickly verify if your implementation works

### How to Use Swagger

1. **Start the application**: Run `dotnet run` from the `CadabraTest.API` directory
2. **Open Swagger**: Navigate to `http://localhost:5000/swagger` (or the port shown in console)
3. **Explore endpoints**: You'll see all your API endpoints listed with:
   - HTTP method (GET, POST, DELETE, etc.)
   - Endpoint path (e.g., `/api/cad/analyze`)
   - Parameters and request body requirements
   - Expected response types
4. **Test endpoints**:
   - Click "Try it out" on any endpoint
   - Fill in parameters (e.g., upload a file, enter an ID)
   - Click "Execute"
   - See the response with status code, headers, and response body

### Example: Testing the Analyze Endpoint

1. In Swagger, find `POST /api/cad/analyze`
2. Click "Try it out"
3. Click "Choose File" and select `SampleData/mock_part_data.json`
4. Optionally change `includeAIAnalysis` to true/false
5. Click "Execute"
6. See the response - you should get back an `AnalysisResponse` with the analysis ID

**Note**: Swagger is already configured for you - you don't need to do anything special. Just run the app and visit the `/swagger` endpoint.

---

## Main Confusion Points - CLARIFIED

### 1. **File Format Understanding** IMPORTANT

- **You are NOT processing actual CAD files** (like `.sldprt`, `.step`, etc.)
- Instead, you receive **JSON files** that represent CAD part data
- These JSON files are located in `SampleData/` (e.g., `mock_part_data.json`)
- Your `CadProcessingService.ExtractMetadataAsync()` should:
  - Accept the uploaded file stream
  - Parse it as JSON
  - Extract relevant fields and map them to the `PartMetadata` model
  - Return the structured metadata

### 2. **AI/LLM Integration is OPTIONAL** 

- The `AIAnalysisService` does NOT require actual AI/LLM integration
- You can implement basic analysis logic based on the part metadata
- For example: check if dimensions are reasonable, suggest materials based on size, etc.
- AI integration (OpenAI, Anthropic, etc.) is **completely optional** and not required
- A simple rule-based analysis is perfectly acceptable

### 3. **Storage Implementation Choice**

- **Simple approach**: Use `Dictionary<Guid, AnalysisResponse>` or `ConcurrentDictionary` for in-memory storage
- **Advanced approach**: Use a database (SQLite, SQL Server, etc.)
- **Both are acceptable** - choose based on your preference/time constraints
- If using in-memory, consider using `Singleton` lifetime for the service

### 4. **Service Registration Required**

- In `Program.cs` (lines 23-25), you **must uncomment** and register:
  - `ICadProcessingService` → `CadProcessingService`
  - `IAIAnalysisService` → `AIAnalysisService`
  - `IAnalysisStorageService` → `AnalysisStorageService`
- Also inject these services into `CadController` constructor

### 5. **Two Additional Endpoints Required**

- You need to implement **at least 2 more endpoints** beyond the 3 provided (see "Provided Endpoints" section below)
- Examples:
  - `GET /api/cad/analyses` - List all analyses
  - `DELETE /api/cad/analysis/{id}` - Delete an analysis
  - `GET /api/cad/statistics` - Get statistics about analyses
- These are not explicitly specified, so use your judgment

---

## Provided Endpoints (Starter Code)

The following **3 endpoints** are provided in the starter code in `CadController.cs`. You need to **implement** the first two (they're currently stubbed), while the third is already functional:

### 1. **POST /api/cad/analyze** - AnalyzePart() **Needs Implementation**

- **Purpose**: Accepts a file upload and analyzes a CAD part
- **Parameters**:
  - `file` (IFormFile) - The CAD part file (JSON mock data)
  - `includeAIAnalysis` (bool, optional, default: true) - Whether to include AI analysis
- **Returns**: `AnalysisResponse` with analysis results
- **Status**: Currently returns "Not implemented yet" - **YOU MUST IMPLEMENT THIS**

### 2. **GET /api/cad/analysis/{analysisId}** - GetAnalysis() **Needs Implementation**

- **Purpose**: Retrieves a saved analysis by its unique ID
- **Parameters**:
  - `analysisId` (Guid) - The unique identifier of the analysis
- **Returns**: `AnalysisResponse` if found, `404 Not Found` if not found
- **Status**: Currently returns "Not implemented yet" - **YOU MUST IMPLEMENT THIS**

### 3. **GET /api/cad/health** - HealthCheck() **Already Implemented**

- **Purpose**: Health check endpoint to verify API is running
- **Returns**: `HealthResponse` with status "healthy", timestamp, and version
- **Status**: Already functional - no changes needed

### Additional Endpoints Required

You must add **at least 2 more endpoints** beyond these 3. Examples:

- `GET /api/cad/analyses` - List all saved analyses
- `DELETE /api/cad/analysis/{id}` - Delete an analysis by ID
- `GET /api/cad/statistics` - Get statistics about analyses
- Or any other endpoints you think would be useful

---

## Optional Steps

### Optional: AI/LLM Integration

- If you want to add real AI analysis, you can:
  - Uncomment line 19 in `Program.cs` to add HttpClient
  - Integrate with OpenAI, Anthropic, or other LLM providers
  - This is **not required** - basic analysis is fine

### Optional: Database Storage

- Instead of in-memory storage, you can use:
  - SQLite (easy to set up)
  - SQL Server
  - Entity Framework Core
  - In-memory storage is perfectly acceptable for this exam

### Optional: Additional Middleware

- Error handling middleware
- Request logging
- Authentication/Authorization (not required)

---

## Data Flow

```
1. User uploads JSON file → POST /api/cad/analyze
   ↓
2. CadController.AnalyzePart()
   - Validates file
   ↓
3. CadProcessingService.ExtractMetadataAsync()
   - Parses JSON
   - Extracts: partName, dimensions, material, mass, etc.
   ↓
4. AIAnalysisService.GenerateAnalysisAsync() [Optional]
   - Analyzes metadata
   - Generates insights and recommendations
   ↓
5. AnalysisStorageService.SaveAnalysisAsync()
   - Saves the complete AnalysisResponse
   ↓
6. Controller returns AnalysisResponse with unique ID
```

```
Later: User retrieves analysis
   ↓
GET /api/cad/analysis/{id}
   ↓
AnalysisStorageService.GetAnalysisAsync(id)
   ↓
Returns saved AnalysisResponse
```

---

## Testing Your Implementation

### Using Swagger UI

1. Run the application: `dotnet run`
2. Navigate to: `http://localhost:5000/swagger` (or the port shown in console)
3. Test endpoints:
   - **POST `/api/cad/analyze`**: Upload `SampleData/mock_part_data.json`
   - **GET `/api/cad/analysis/{id}`**: Use the ID returned from analyze endpoint
   - **GET `/api/cad/health`**: Should return healthy status
   - Test your additional endpoints

### Using Sample Data

- Upload `mock_part_data.json` or `mock_part_data_2.json` from `SampleData/` folder
- These are JSON files that represent CAD part data
- They contain all the fields your `CadProcessingService` needs to extract

---

## Project Structure

```
CadabraTest.API/
├── Controllers/
│   └── CadController.cs          # Request handling (TODO: implement endpoints)
├── Models/
│   └── AnalysisResponse.cs        # Data models (already defined)
├── Services/
│   ├── ICadProcessingService.cs   # Interface
│   ├── CadProcessingService.cs    # Extract metadata from JSON (TODO)
│   ├── IAIAnalysisService.cs      # Interface
│   ├── AIAnalysisService.cs       # Generate analysis (TODO)
│   ├── IAnalysisStorageService.cs # Interface
│   └── AnalysisStorageService.cs  # Store/retrieve analyses (TODO)
├── SampleData/
│   ├── mock_part_data.json        # Test data
│   └── mock_part_data_2.json       # Test data
└── Program.cs                      # Service registration (TODO: uncomment)
```



Good luck!
