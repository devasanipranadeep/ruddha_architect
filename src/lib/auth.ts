const AUTH_KEY = "ruddha_admin_auth";
const DEFAULT_PASSWORD = "admin123"; // In production, this should be stored securely

export function login(password: string): boolean {
  if (password === DEFAULT_PASSWORD) {
    localStorage.setItem(AUTH_KEY, Date.now().toString());
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  const auth = localStorage.getItem(AUTH_KEY);
  if (!auth) return false;
  
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

export function changePassword(oldPassword: string, newPassword: string): boolean {
  if (oldPassword === DEFAULT_PASSWORD) {
    // In a real app, you'd store the new password securely
    // For now, we'll use localStorage for the new password
    localStorage.setItem("ruddha_admin_password", newPassword);
    return true;
  }
  return false;
}

export function getStoredPassword(): string {
  return localStorage.getItem("ruddha_admin_password") || DEFAULT_PASSWORD;
}
