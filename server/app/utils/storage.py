from typing import List, Dict, Optional
from supabase import Client, create_client
from app.core.config import settings

# Initialize Supabase client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


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
