# Ruddhaa Architects & Interiors - Backend API

A simplified backend API for the Ruddhaa Architects & Interiors website, built with FastAPI and Supabase.

## Features

- **Authentication**: JWT-based admin authentication
- **Project/Portfolio Management**: Full CRUD for projects
- **Contact Form**: Store and manage client contact information
- **Email Notifications**: Send email notifications for new inquiries
- **WhatsApp Notifications**: Send WhatsApp notifications (placeholder for API integration)
- **Supabase Database**: All data stored in Supabase PostgreSQL

## Technology Stack

- **Framework**: FastAPI 0.109.0
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT with python-jose
- **Password Hashing**: bcrypt via passlib
- **Email**: SMTP
- **Validation**: Pydantic
- **API Documentation**: Swagger UI / ReDoc

## Project Structure

```
server/
├── app/
│   ├── api/
│   │   └── v1/
│   │       └── endpoints/     # Simplified API endpoints
│   ├── core/                  # Core configuration
│   ├── schemas/               # Pydantic schemas
│   ├── services/              # Notification services
│   └── utils/                 # Supabase storage utilities
├── requirements.txt
├── .env.example
├── supabase_schema.sql
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `SUPABASE_URL`: Your Supabase project URL (e.g., https://your-project.supabase.co)
- `SUPABASE_KEY`: Your Supabase anon key

### 3. Setup Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in Supabase dashboard
3. Run the SQL commands from `supabase_schema.sql`
4. Get your credentials from Settings > API

The schema includes two tables:
- `projects` - For storing project/portfolio information
- `contact_messages` - For storing client contact information

### 4. Run the Application

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
  - Email: `ruddha.arch@gmail.com`
  - Password: `20B@r1124`

### Projects/Portfolio
- `GET /api/projects` - Get all projects
- `GET /api/projects/{id}` - Get project by ID
- `POST /api/projects` - Create project (admin)
- `PUT /api/projects/{id}` - Update project (admin)
- `DELETE /api/projects/{id}` - Delete project (admin)

### Contact Form
- `POST /api/contact` - Submit contact form (sends email & WhatsApp notification)
- `GET /api/contact` - Get all contact messages (admin)

### Health
- `GET /` - Root endpoint
- `GET /api/health` - Health check

## Admin Credentials

- **Email**: ruddha.arch@gmail.com
- **Password**: 20B@r1124

**Important**: Change these credentials in `app/core/config.py` for production!

## Database Schema

### Projects Table
- `id` (UUID)
- `title` (VARCHAR)
- `slug` (VARCHAR, unique)
- `category` (VARCHAR)
- `location` (VARCHAR)
- `description` (TEXT)
- `client_name` (VARCHAR)
- `year` (INTEGER)
- `area` (VARCHAR)
- `budget` (VARCHAR)
- `cover_image` (TEXT)
- `gallery_images` (JSONB)
- `featured` (BOOLEAN)
- `status` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Contact Messages Table
- `id` (UUID)
- `name` (VARCHAR)
- `email` (VARCHAR)
- `phone` (VARCHAR)
- `service` (VARCHAR)
- `message` (TEXT)
- `status` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Email Configuration

To enable email notifications, update the SMTP settings in `app/core/config.py`:

```python
SMTP_HOST: str = "smtp.gmail.com"
SMTP_PORT: int = 587
SMTP_USER: str = "your-email@gmail.com"
SMTP_PASSWORD: str = "your-app-password"
EMAIL_FROM: str = "ruddha.arch@gmail.com"
```

For Gmail, you need to:
1. Enable 2-factor authentication
2. Create an app password at https://myaccount.google.com/apppasswords
3. Use the app password as SMTP_PASSWORD

## WhatsApp Integration

The WhatsApp notification is a placeholder. To implement:
1. Get a WhatsApp Business API key
2. Update `app/services/notification_service.py` to make API calls
3. Add `WHATSAPP_API_KEY` to config

## License

Copyright © 2024 Ruddhaa Architects & Interiors
