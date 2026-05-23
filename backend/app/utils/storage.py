from typing import List, Dict, Optional
import uuid
from supabase import Client, create_client
from app.core.config import settings

# Initialize Supabase client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

# Storage bucket name
STORAGE_BUCKET = "project-images"


def upload_file_to_storage(file_bytes: bytes, filename: str, content_type: str) -> str:
    """Upload a file to Supabase Storage and return the public URL."""
    # Generate unique filename
    extension = filename.split(".")[-1] if "." in filename else "jpg"
    unique_name = f"{uuid.uuid4()}.{extension}"
    file_path = f"uploads/{unique_name}"
    
    # Upload to Supabase Storage
    supabase.storage.from_(STORAGE_BUCKET).upload(
        path=file_path,
        file=file_bytes,
        file_options={"content-type": content_type}
    )
    
    # Get public URL
    public_url = supabase.storage.from_(STORAGE_BUCKET).get_public_url(file_path)
    return public_url


# Projects operations
def get_projects() -> List[Dict]:
    """Get all projects."""
    response = supabase.table('projects').select('*').execute()
    return response.data


def get_project_by_id(project_id: str) -> Optional[Dict]:
    """Get a project by ID."""
    response = supabase.table('projects').select('*').eq('id', project_id).execute()
    if response.data:
        return response.data[0]
    return None


def create_project(project_data: Dict) -> Dict:
    """Create a new project."""
    response = supabase.table('projects').insert(project_data).execute()
    return response.data[0]


def update_project(project_id: str, project_data: Dict) -> Optional[Dict]:
    """Update a project."""
    response = supabase.table('projects').update(project_data).eq('id', project_id).execute()
    if response.data:
        return response.data[0]
    return None


def delete_project(project_id: str) -> bool:
    """Delete a project."""
    response = supabase.table('projects').delete().eq('id', project_id).execute()
    return len(response.data) > 0


# Contact messages operations
def get_contact_messages() -> List[Dict]:
    """Get all contact messages."""
    response = supabase.table('contact_messages').select('*').execute()
    return response.data


def create_contact_message(message_data: Dict) -> Dict:
    """Create a new contact message."""
    response = supabase.table('contact_messages').insert(message_data).execute()
    return response.data[0]


def update_contact_message(message_id: str, status: str) -> Optional[Dict]:
    """Update contact message status."""
    response = supabase.table('contact_messages').update({'status': status}).eq('id', message_id).execute()
    if response.data:
        return response.data[0]
    return None


def delete_contact_message(message_id: str) -> bool:
    """Delete a contact message."""
    response = supabase.table('contact_messages').delete().eq('id', message_id).execute()
    return len(response.data) > 0


# Stats operations
DEFAULT_STATS = {
    "projects_delivered": 0,
    "years_of_practice": 0,
    "design_awards": 0,
    "repeat_clients": 0,
}


def get_stats() -> Dict:
    """Get site statistics from Supabase."""
    response = supabase.table('site_stats').select('*').eq('id', 'main').execute()
    if response.data:
        row = response.data[0]
        return {
            "projects_delivered": row.get("projects_delivered", 0),
            "years_of_practice": row.get("years_of_practice", 0),
            "design_awards": row.get("design_awards", 0),
            "repeat_clients": row.get("repeat_clients", 0),
        }
    return DEFAULT_STATS.copy()


def update_stats(stats_data: Dict) -> Dict:
    """Update site statistics in Supabase."""
    row = {
        "id": "main",
        "projects_delivered": stats_data.get("projects_delivered", 0),
        "years_of_practice": stats_data.get("years_of_practice", 0),
        "design_awards": stats_data.get("design_awards", 0),
        "repeat_clients": stats_data.get("repeat_clients", 0),
    }
    response = supabase.table('site_stats').upsert(row).execute()
    if response.data:
        return response.data[0]
    return row
