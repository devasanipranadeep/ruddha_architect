from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Supabase Configuration
    SUPABASE_URL: str = "https://veeonffibrkunboagkdu.supabase.co"
    SUPABASE_KEY: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZW9uZmZpYnJrdW5ib2Fna2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDA3MDYsImV4cCI6MjA5NTAxNjcwNn0.yJrH31gXOyn6mrIrWOl2h7SjqPDhdEGibm4I-luQT9I"
    
    # Admin Configuration
    ADMIN_EMAIL: str = "ruddha.arch@gmail.com"
    ADMIN_PASSWORD: str = "20B@r1124"
    
    # JWT Configuration
    JWT_SECRET_KEY: str = "ruddha-secret-key-2024"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Email Configuration
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "ruddha.arch@gmail.com"
    SMTP_PASSWORD: str = "your-app-password"
    EMAIL_FROM: str = "ruddha.arch@gmail.com"
    
    # WhatsApp Configuration
    WHATSAPP_API_KEY: Optional[str] = None
    
    # Frontend Configuration
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Environment
    ENVIRONMENT: str = "development"


settings = Settings()
