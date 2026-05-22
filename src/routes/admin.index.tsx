import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FolderOpen, Plus, TrendingUp, Edit2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { api, type Project } from "@/lib/api";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStatsEditor, setShowStatsEditor] = useState(false);
  const [stats, setStats] = useState({
    projects_delivered: 142,
    years_of_practice: 18,
    design_awards: 27,
    repeat_clients: 96,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProjects();
    loadStats();
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

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const saveStats = async () => {
    setIsSaving(true);
    try {
      await api.updateStats(stats);
      setShowStatsEditor(false);
      alert("Statistics updated successfully");
    } catch (error) {
      console.error("Failed to save stats:", error);
      alert("Failed to save statistics");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl">Dashboard</h1>
        <p className="mt-2 text-foreground/60">Manage your portfolio and projects</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-foreground/60">Loading...</div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Projects Delivered"
              value={stats.projects_delivered}
              icon={<FolderOpen size={24} />}
              trend="+"
            />
            <StatCard
              title="Years of Practice"
              value={stats.years_of_practice}
              icon={<TrendingUp size={24} />}
              trend="Years"
            />
            <StatCard
              title="Design Awards"
              value={stats.design_awards}
              icon={<TrendingUp size={24} />}
              trend="Awards"
            />
            <StatCard
              title="Client Satisfaction"
              value={stats.repeat_clients}
              icon={<TrendingUp size={24} />}
              trend="%"
            />
          </div>

          <div className="mb-8 flex justify-end">
            <button
              onClick={() => setShowStatsEditor(true)}
              className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg hover:bg-foreground/5 transition-colors"
            >
              <Edit2 size={16} />
              Edit Statistics
            </button>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="font-display text-2xl mb-4">Quick Actions</h2>
            <div className="flex gap-4">
              <button
                onClick={() => navigate({ to: "/admin/projects" })}
                className="flex items-center gap-2 bg-gold text-primary-foreground px-6 py-3 rounded-lg hover:bg-gold/90 transition-colors"
              >
                <Plus size={18} />
                Add New Project
              </button>
              <button
                onClick={() => navigate({ to: "/admin/projects" })}
                className="flex items-center gap-2 border border-border px-6 py-3 rounded-lg hover:bg-foreground/5 transition-colors"
              >
                <FolderOpen size={18} />
                Manage Projects
              </button>
            </div>
          </div>

          {/* Recent Projects */}
          <div>
            <h2 className="font-display text-2xl mb-4">Recent Projects</h2>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-foreground/5">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-foreground/60">Title</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-foreground/60">Category</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-foreground/60">Location</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-foreground/60">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-foreground/60">
                        No projects yet.{" "}
                        <button onClick={() => navigate({ to: "/admin/projects" })} className="text-gold hover:underline">
                          Add your first project
                        </button>
                      </td>
                    </tr>
                  ) : (
                    projects.slice(0, 5).map((project) => (
                      <tr key={project.id} className="border-t border-border hover:bg-foreground/5">
                        <td className="px-6 py-4 font-medium">{project.title}</td>
                        <td className="px-6 py-4 text-foreground/60">{project.category}</td>
                        <td className="px-6 py-4 text-foreground/60">{project.location}</td>
                        <td className="px-6 py-4 text-foreground/60">{project.year}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Stats Editor Modal */}
      {showStatsEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl">Edit Statistics</h3>
              <button
                onClick={() => setShowStatsEditor(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Projects Delivered</label>
                <input
                  type="number"
                  value={stats.projects_delivered}
                  onChange={(e) => setStats({ ...stats, projects_delivered: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Years of Practice</label>
                <input
                  type="number"
                  value={stats.years_of_practice}
                  onChange={(e) => setStats({ ...stats, years_of_practice: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Design Awards</label>
                <input
                  type="number"
                  value={stats.design_awards}
                  onChange={(e) => setStats({ ...stats, design_awards: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Client Satisfaction (%)</label>
                <input
                  type="number"
                  value={stats.repeat_clients}
                  onChange={(e) => setStats({ ...stats, repeat_clients: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-gold"
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button
                  onClick={() => setShowStatsEditor(false)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-foreground/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveStats}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-gold text-primary-foreground rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-60"
                >
                  <Save size={16} />
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string; value: number; icon: React.ReactNode; trend: string }) {
  return (
    <div className="border border-border rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-foreground/60">{title}</p>
          <p className="mt-2 text-3xl font-display">{value}</p>
          <p className="mt-1 text-xs text-gold">{trend}</p>
        </div>
        <div className="text-gold">{icon}</div>
      </div>
    </div>
  );
}
