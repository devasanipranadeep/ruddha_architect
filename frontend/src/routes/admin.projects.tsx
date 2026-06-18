import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Upload, X } from "lucide-react";
import { api, type Project, type ProjectCreate } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/projects")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Architecture",
    location: "",
    year: new Date().getFullYear(),
    area: "",
    description: "",
    client_name: "",
    budget: "",
    cover_image: "",
    gallery_images: [] as string[],
    featured: false,
    status: "draft",
  });
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const CATEGORIES = [
    "Architecture",
    "Interior Design",
    "Landscape",
    "Renovation",
    "Turnkey Build",
    "Consulting",
  ];

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await api.deleteProject(id);
      await loadProjects();
      setShowDeleteDialog(null);
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project");
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug || !formData.location || !formData.area) {
      alert("Please fill in all required fields");
      return;
    }

    if (!coverImageFile && !formData.cover_image) {
      alert("Please upload a cover image");
      return;
    }

    setIsSubmitting(true);
    try {
      let coverImageUrl = formData.cover_image;
      
      // Upload image if a file was selected
      if (coverImageFile) {
        const uploadResponse = await api.uploadImage(coverImageFile);
        coverImageUrl = uploadResponse.url;
      }

      // Upload gallery images
      const galleryImageUrls: string[] = [];
      for (const file of galleryFiles) {
        const uploadResponse = await api.uploadImage(file);
        galleryImageUrls.push(uploadResponse.url);
      }

      const projectData: ProjectCreate = {
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        location: formData.location,
        year: formData.year,
        area: formData.area,
        description: formData.description,
        client_name: formData.client_name,
        budget: formData.budget,
        cover_image: coverImageUrl,
        gallery_images: galleryImageUrls,
        featured: formData.featured,
        status: formData.status,
      };

      await api.createProject(projectData);
      await loadProjects();
      setShowAddForm(false);
      setFormData({
        title: "",
        slug: "",
        category: "Architecture",
        location: "",
        year: new Date().getFullYear(),
        area: "",
        description: "",
        client_name: "",
        budget: "",
        cover_image: "",
        gallery_images: [],
        featured: false,
        status: "draft",
      });
      setCoverImageFile(null);
      setCoverImagePreview("");
      setGalleryFiles([]);
      setGalleryPreviews([]);
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryUploadNew = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setGalleryFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setGalleryPreviews((prev) => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeGalleryPreview = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl">Projects</h1>
          <p className="mt-2 text-foreground/60">Manage your projects</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-gold text-primary-foreground px-6 py-3 rounded-lg hover:bg-gold/90 transition-colors"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {/* Actions Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Projects Table */}
      {loading ? (
        <div className="text-center py-12 text-foreground/60">Loading projects...</div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-foreground/5">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-foreground/60">Image</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-foreground/60">Title</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-foreground/60">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-foreground/60">Location</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-foreground/60">Year</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-foreground/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-foreground/60">
                    No projects found. {searchQuery && "Try a different search term or "}
                    {!searchQuery && (
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="text-gold hover:underline"
                      >
                        Add your first project
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="border-t border-border hover:bg-foreground/5">
                    <td className="px-6 py-4">
                      <img
                        src={project.cover_image}
                        alt={project.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">{project.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs bg-gold/10 text-gold rounded">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground/60">{project.location}</td>
                    <td className="px-6 py-4 text-foreground/60">{project.year}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to="/admin/projects/edit/$id"
                          params={{ id: project.id }}
                          className="p-2 hover:bg-foreground/10 rounded transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => setShowDeleteDialog(project.id)}
                          className="p-2 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="font-display text-xl mb-2">Delete Project</h3>
            <p className="text-foreground/60 mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteDialog(null)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-foreground/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteDialog)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-xl mb-4">Add New Project</h3>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-gold"
                  placeholder="Project title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-gold font-mono text-sm"
                  placeholder="project-slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-gold bg-background"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-gold"
                  placeholder="City, Country"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Year *</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Area *</label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-gold"
                    placeholder="e.g., 2500 sq ft"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cover Image *</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-foreground/5 cursor-pointer transition-colors">
                    <Upload size={18} />
                    <span>Upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {coverImagePreview && (
                    <div className="relative">
                      <img
                        src={coverImagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImageFile(null);
                          setCoverImagePreview("");
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-gold resize-none"
                  placeholder="Project description"
                />
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-medium mb-2">Gallery Images</label>
                <p className="text-xs text-foreground/60 mb-3">Add additional project images.</p>
                
                {galleryPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {galleryPreviews.map((preview, idx) => (
                      <div key={idx} className="relative group">
                        <img src={preview} alt={`Gallery ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeGalleryPreview(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label className="flex items-center gap-3 px-4 py-3 border border-dashed border-border rounded-lg hover:bg-foreground/5 cursor-pointer transition-colors">
                  <Plus size={18} />
                  <span>Add gallery images</span>
                  <input type="file" accept="image/*" multiple onChange={handleGalleryUploadNew} className="hidden" />
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-foreground/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gold text-primary-foreground rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-60"
                >
                  {isSubmitting ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
