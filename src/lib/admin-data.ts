import { PROJECTS } from "@/data/site";

export interface AdminProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string;
  image: string;
  tall?: boolean;
  description?: string;
}

const STORAGE_KEY = "ruddha_admin_projects";

// Initialize localStorage with default projects if empty
function initializeStorage() {
  if (typeof window === "undefined") return;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initialProjects: AdminProject[] = PROJECTS.map((p, index) => ({
      id: `project-${index}`,
      slug: p.slug,
      title: p.title,
      category: p.category,
      location: p.location,
      year: p.year,
      image: typeof p.image === "string" ? p.image : "",
      tall: p.tall,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProjects));
  }
}

export function getAdminProjects(): AdminProject[] {
  if (typeof window === "undefined") return [];
  
  initializeStorage();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function getAdminProjectById(id: string): AdminProject | undefined {
  const projects = getAdminProjects();
  return projects.find((p) => p.id === id);
}

export function getAdminProjectBySlug(slug: string): AdminProject | undefined {
  const projects = getAdminProjects();
  return projects.find((p) => p.slug === slug);
}

export function createAdminProject(project: Omit<AdminProject, "id">): AdminProject {
  const projects = getAdminProjects();
  const newProject: AdminProject = {
    ...project,
    id: `project-${Date.now()}`,
  };
  
  const updatedProjects = [...projects, newProject];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
  
  return newProject;
}

export function updateAdminProject(id: string, updates: Partial<AdminProject>): AdminProject | null {
  const projects = getAdminProjects();
  const index = projects.findIndex((p) => p.id === id);
  
  if (index === -1) return null;
  
  const updatedProject = { ...projects[index], ...updates };
  const updatedProjects = [...projects];
  updatedProjects[index] = updatedProject;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
  
  return updatedProject;
}

export function deleteAdminProject(id: string): boolean {
  const projects = getAdminProjects();
  const filteredProjects = projects.filter((p) => p.id !== id);
  
  if (filteredProjects.length === projects.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProjects));
  return true;
}

export function exportAdminProjects(): string {
  const projects = getAdminProjects();
  return JSON.stringify(projects, null, 2);
}

export function importAdminProjects(json: string): boolean {
  try {
    const projects = JSON.parse(json) as AdminProject[];
    if (!Array.isArray(projects)) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return true;
  } catch {
    return false;
  }
}
