const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8001/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  location: string;
  description: string;
  client_name?: string;
  year: number;
  area: string;
  budget?: string;
  cover_image: string;
  gallery_images: string[];
  featured: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreate {
  title: string;
  slug: string;
  category: string;
  location: string;
  description?: string;
  client_name?: string;
  year: number;
  area: string;
  budget?: string;
  cover_image?: string;
  gallery_images: string[];
  featured: boolean;
  status: string;
}

export interface CategoriesResponse {
  categories: string[];
}

export interface UploadResponse {
  filename: string;
  url: string;
}

let authToken: string | null = null;

export const api = {
  // Auth
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Login failed');
    }

    const data = await response.json();
    authToken = data.access_token;
    if (authToken) {
      localStorage.setItem('auth_token', authToken);
    }
    return data;
  },

  logout() {
    authToken = null;
    localStorage.removeItem('auth_token');
  },

  getToken(): string | null {
    if (!authToken) {
      authToken = localStorage.getItem('auth_token');
    }
    return authToken;
  },

  getAuthHeaders() {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    return response.json();
  },

  async getProject(id: string): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }

    return response.json();
  },

  async createProject(project: ProjectCreate): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      throw new Error('Failed to create project');
    }

    return response.json();
  },

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      throw new Error('Failed to update project');
    }

    return response.json();
  },

  async deleteProject(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
  },

  // Upload
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        ...(this.getToken() && { Authorization: `Bearer ${this.getToken()}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    return response.json();
  },

  // Categories
  async getCategories(): Promise<CategoriesResponse> {
    const response = await fetch(`${API_BASE_URL}/categories`);

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return response.json();
  },

  // Stats
  async getStats(): Promise<{
    projects_delivered: number;
    years_of_practice: number;
    design_awards: number;
    repeat_clients: number;
  }> {
    const response = await fetch(`${API_BASE_URL}/stats`);

    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    return response.json();
  },

  async updateStats(stats: {
    projects_delivered: number;
    years_of_practice: number;
    design_awards: number;
    repeat_clients: number;
  }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(stats),
    });

    if (!response.ok) {
      throw new Error('Failed to update stats');
    }

    return response.json();
  },
};
