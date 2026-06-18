from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
import uuid
import shutil
from app.core.config import settings
from app.schemas.schemas import (
    LoginRequest, TokenResponse, 
    ProjectCreate, ProjectResponse,
    ContactMessageCreate, ContactMessageResponse,
    PROJECT_CATEGORIES
)
from app.utils.storage import (
    get_projects, get_project_by_id, create_project, 
    update_project, delete_project, create_contact_message,
    upload_file_to_storage, get_stats, update_stats
)
from app.services.notification_service import send_contact_notification, send_whatsapp_message

router = APIRouter()
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Upload directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Verify JWT token and return admin info."""
    try:
        payload = jwt.decode(credentials.credentials, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        if email != settings.ADMIN_EMAIL:
            raise HTTPException(status_code=403, detail="Not authorized")
        
        return {"email": email, "role": "admin"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# Auth endpoints
@router.post("/auth/login")
async def login(request: dict):
    """Admin login."""
    email = request.get("email")
    password = request.get("password")
    
    print(f"Login attempt - Email: {email}, Password: {password}")
    print(f"Expected - Email: {settings.ADMIN_EMAIL}, Password: {settings.ADMIN_PASSWORD}")
    
    if email != settings.ADMIN_EMAIL:
        raise HTTPException(status_code=401, detail="Invalid email")
    
    if password != settings.ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    
    access_token = create_access_token({"sub": settings.ADMIN_EMAIL, "role": "admin"})
    return {"access_token": access_token, "token_type": "bearer"}


# Project endpoints
@router.get("/projects", response_model=list[ProjectResponse])
async def get_all_projects():
    """Get all projects."""
    projects = get_projects()
    return projects


@router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str):
    """Get a specific project."""
    project = get_project_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("/projects", response_model=ProjectResponse, status_code=201)
async def add_project(project: ProjectCreate, current_admin: dict = Depends(get_current_admin)):
    """Create a new project (admin only)."""
    from datetime import datetime
    project_data = project.dict()
    project_data["created_at"] = datetime.now().isoformat()
    project_data["updated_at"] = datetime.now().isoformat()
    return create_project(project_data)


@router.put("/projects/{project_id}", response_model=ProjectResponse)
async def update_project_endpoint(project_id: str, project: ProjectResponse, current_admin: dict = Depends(get_current_admin)):
    """Update a project (admin only)."""
    updated = update_project(project_id, project.dict())
    if not updated:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated


@router.delete("/projects/{project_id}", status_code=204)
async def delete_project_endpoint(project_id: str, current_admin: dict = Depends(get_current_admin)):
    """Delete a project (admin only)."""
    if not delete_project(project_id):
        raise HTTPException(status_code=404, detail="Project not found")


# Contact endpoints
@router.post("/contact", response_model=ContactMessageResponse, status_code=201)
async def submit_contact(message: ContactMessageCreate, background_tasks: BackgroundTasks):
    """Submit contact form."""
    from datetime import datetime
    # Save message
    message_data = message.dict()
    message_data["status"] = "pending"
    message_data["created_at"] = datetime.now().isoformat()
    
    try:
        saved_message = create_contact_message(message_data)
    except Exception as e:
        print(f"Error saving contact message to Supabase: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save message. Database error: {str(e)}"
        )
    
    # Send notifications in background (don't block the response)
    background_tasks.add_task(
        send_contact_notification,
        message.name,
        message.email,
        message.phone,
        message.service,
        message.message
    )
    
    whatsapp_msg = f"New inquiry from {message.name} ({message.phone}). Service: {message.service}. Email: {message.email}"
    background_tasks.add_task(send_whatsapp_message, settings.ADMIN_EMAIL, whatsapp_msg)
    
    return saved_message


@router.get("/contact", response_model=list[ContactMessageResponse])
async def get_contact_messages(current_admin: dict = Depends(get_current_admin)):
    """Get all contact messages (admin only)."""
    from app.utils.storage import get_contact_messages
    return get_contact_messages()


@router.put("/contact/{message_id}", response_model=ContactMessageResponse)
async def update_contact_message_status(message_id: str, status_data: dict, current_admin: dict = Depends(get_current_admin)):
    """Update contact message status (admin only)."""
    from app.utils.storage import update_contact_message
    updated = update_contact_message(message_id, status_data.get("status", "read"))
    if not updated:
        raise HTTPException(status_code=404, detail="Message not found")
    return updated


@router.delete("/contact/{message_id}", status_code=204)
async def delete_contact_message(message_id: str, current_admin: dict = Depends(get_current_admin)):
    """Delete a contact message (admin only)."""
    from app.utils.storage import delete_contact_message
    try:
        if not delete_contact_message(message_id):
            raise HTTPException(status_code=404, detail="Message not found")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting contact message: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete message. Database error: {str(e)}"
        )


@router.get("/stats")
async def get_stats_endpoint():
    """Get site statistics."""
    return get_stats()


@router.put("/stats")
async def update_stats_endpoint(stats_data: dict, current_admin: dict = Depends(get_current_admin)):
    """Update site statistics (admin only)."""
    return update_stats(stats_data)


# Health check
@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


# File upload endpoint
@router.post("/upload/image")
async def upload_image(file: UploadFile = File(...), current_admin: dict = Depends(get_current_admin)):
    """Upload an image file to Supabase Storage (admin only)."""
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Read file bytes
    file_bytes = await file.read()
    
    # Upload to Supabase Storage
    try:
        public_url = upload_file_to_storage(file_bytes, file.filename, file.content_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
    
    return {"filename": file.filename, "url": public_url}


# Get categories endpoint
@router.get("/categories")
async def get_categories():
    """Get available project categories."""
    return {"categories": PROJECT_CATEGORIES}
