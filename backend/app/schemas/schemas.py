from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

# Project Categories
PROJECT_CATEGORIES = [
    "Architecture",
    "Interior Design",
    "Landscape",
    "Renovation",
    "Turnkey Build",
    "Consulting"
]


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=255)
    category: str = Field(..., description=f"Must be one of: {', '.join(PROJECT_CATEGORIES)}")
    location: str = Field(..., max_length=255)
    description: Optional[str] = None
    client_name: Optional[str] = None
    year: int = Field(..., ge=1900, le=2100)
    area: str = Field(..., max_length=100)
    budget: Optional[str] = None
    cover_image: Optional[str] = None
    gallery_images: List[str] = []
    featured: bool = False
    status: str = Field(default="draft", description="Must be draft, published, or archived")


class ProjectResponse(BaseModel):
    id: str
    title: str
    slug: str
    category: str
    location: str
    description: Optional[str]
    client_name: Optional[str]
    year: int
    area: str
    budget: Optional[str]
    cover_image: Optional[str]
    gallery_images: List[str]
    featured: bool
    status: str
    created_at: Optional[str]
    updated_at: Optional[str]


class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: str = Field(..., max_length=20)
    service: Optional[str] = None
    message: str = Field(..., min_length=1)


class ContactMessageResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    service: Optional[str]
    message: str
    status: str
    created_at: Optional[str]
