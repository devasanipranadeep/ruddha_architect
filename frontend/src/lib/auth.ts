const AUTH_KEY = "ruddha_admin_auth";
const TOKEN_KEY = "ruddha_admin_token";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001/api";

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.detail || "Login failed" };
    }

    const data = await response.json();
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(AUTH_KEY, Date.now().toString());
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Network error. Please check if the backend is running." };
  }
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  const auth = localStorage.getItem(AUTH_KEY);
  const token = localStorage.getItem(TOKEN_KEY);
  if (!auth || !token) return false;

  // Session expires after 24 hours
  const loginTime = parseInt(auth, 10);
  const now = Date.now();
  const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);

  if (hoursSinceLogin > 24) {
    logout();
    return false;
  }

  return true;
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
