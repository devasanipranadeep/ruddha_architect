import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { api, type Project } from "@/lib/api";

export const Route = createFileRoute("/admin/projects/edit/$id")({
  component: EditProjectPage,
});

function EditProjectPage() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    category: "Architecture",
    location: "",
    year: "",
    image: "",
    tall: false,
    description: "",
    area: "",
    client_name: "",
    budget: "",
    featured: false,
    status: "draft",
  });
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = ["Architecture", "Interior Design", "Landscape", "Renovation", "Turnkey Build", "Consulting"];

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await api.getProject(id);
        setProject(data);
        setFormData({
          slug: data.slug,
          title: data.title,
          category: data.category,
          location: data.location,
          year: String(data.year),
          image: data.cover_image || "",
          tall: false,
          description: data.description || "",
          area: data.area || "",
          client_name: data.client_name || "",
          budget: data.budget || "",
          featured: data.featured || false,
          status: data.status || "draft",
        });
      } catch (error) {
        console.error("Failed to load project:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, image: event.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleBlur = () => {
    if (project && formData.slug === project.slug && formData.title) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(prev.title) }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.year.trim()) newErrors.year = "Year is required";
    if (!formData.image.trim()) newErrors.image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      let coverImageUrl = formData.image;

      if (coverImageFile) {
        const uploadResponse = await api.uploadImage(coverImageFile);
        coverImageUrl = uploadResponse.url;
      }

      await api.updateProject(id, {
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        location: formData.location,
        year: parseInt(formData.year),
        area: formData.area,
        description: formData.description,
        client_name: formData.client_name,
        budget: formData.budget,
        cover_image: coverImageUrl,
        featured: formData.featured,
        status: formData.status,
      });
      navigate({ to: "/admin/projects" });
    } catch (error) {
      console.error("Failed to update project:", error);
      alert("Failed to update project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-foreground/60">Loading project...</div>;
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/60">Project not found.</p>
        <button onClick={() => navigate({ to: "/admin/projects" })} className="mt-4 text-gold hover:underline">Back to Projects</button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <button
          onClick={() => navigate({ to: "/admin/projects" })}
          className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={18} />
          Back to Projects
        </button>
        <h1 className="font-display text-4xl">Edit Project</h1>
        <p className="mt-2 text-foreground/60">Update project details</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              onBlur={handleTitleBlur}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-gold"
              placeholder="Project title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-gold font-mono text-sm"
              placeholder="project-slug"
            />
            {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug}</p>}
            <p className="mt-1 text-xs text-foreground/60">URL-friendly identifier</p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-gold"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-gold"
              placeholder="City, Country"
            />
            {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-gold"
              placeholder="2024"
            />
            {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year}</p>}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Project Image <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-foreground/5 cursor-pointer transition-colors">
                <Upload size={18} />
                <span>Upload new image</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {formData.image && (
                <img src={formData.image} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
              )}
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-gold font-mono text-sm"
                placeholder="Or enter image URL"
              />
            </div>
            {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
          </div>

          {/* Tall Layout */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="tall"
              id="tall"
              checked={formData.tall}
              onChange={handleInputChange}
              className="w-4 h-4 accent-gold"
            />
            <label htmlFor="tall" className="text-sm font-medium">
              Use tall layout (2 rows in grid)
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-gold"
              placeholder="Project description..."
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-gold text-primary-foreground px-6 py-3 rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-60"
            >
              <Save size={18} />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/admin/projects" })}
              className="px-6 py-3 border border-border rounded-lg hover:bg-foreground/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
