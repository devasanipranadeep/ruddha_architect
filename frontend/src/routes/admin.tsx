import { createFileRoute, Link, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LayoutDashboard, FolderOpen, LogOut, Lock, X, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    // Check if user is authenticated
    const token = api.getToken();
    setShowLogin(!token);
    setCurrentPath(router.state.location.pathname);
  }, [router]);

  useEffect(() => {
    setCurrentPath(router.state.location.pathname);
  }, [router.state.location.pathname]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await api.login(email, password);
      console.log("Login successful:", result);
      setShowLogin(false);
      setPassword("");
      // Force a re-check of authentication
      const token = api.getToken();
      console.log("Token after login:", token);
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setShowLogin(true);
    setEmail("");
    setPassword("");
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl text-gradient-gold mb-2">Ruddha Admin</h1>
            <p className="text-foreground/60">Enter your credentials to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:border-gold"
                  placeholder="Enter email"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:border-gold"
                  placeholder="Enter password"
                />
              </div>
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={!email || !password || loading}
              className="w-full bg-gold text-primary-foreground px-6 py-3 rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card min-h-screen p-6">
          <div className="mb-8">
            <Link to="/" className="font-display text-2xl text-gradient-gold">
              Ruddha Admin
            </Link>
          </div>
          
          <nav className="space-y-2">
            <AdminLink to="/admin" icon={<LayoutDashboard size={18} />} currentPath={currentPath}>
              Dashboard
            </AdminLink>
            <AdminLink to="/admin/projects" icon={<FolderOpen size={18} />} currentPath={currentPath}>
              Projects
            </AdminLink>
            <AdminLink to="/admin/messages" icon={<Mail size={18} />} currentPath={currentPath}>
              Messages
            </AdminLink>
          </nav>

          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-sm text-foreground/60 hover:text-foreground transition-colors w-full"
            >
              <LogOut size={18} />
              Logout
            </button>
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              Back to Site
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function AdminLink({ to, icon, children, currentPath }: { to: string; icon: React.ReactNode; children: React.ReactNode; currentPath: string }) {
  const isActive = currentPath === to;
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors",
        isActive
          ? "bg-gold/10 text-gold"
          : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
      )}
    >
      {icon}
      {children}
    </Link>
  );
}
