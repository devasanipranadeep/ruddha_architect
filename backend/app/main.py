from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from app.api.v1.endpoints.endpoints import router
import os

# Initialize FastAPI app
app = FastAPI(
    title="Ruddhaa Architects & Interiors API",
    description="Simplified backend API for Ruddhaa Architects & Interiors",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Configure CORS
frontend_url = os.getenv("FRONTEND_URL", "")
allowed_origins = [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:5173",
]
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include API router
app.include_router(router, prefix="/api")


# Global exception handler to ensure CORS headers are present on all error responses
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch unhandled exceptions and return a proper JSON response.
    This ensures CORSMiddleware processes the response and adds CORS headers,
    preventing the browser from showing misleading CORS errors.
    """
    print(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"}
    )


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Ruddhaa Architects & Interiors API",
        "version": "1.0.0",
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
