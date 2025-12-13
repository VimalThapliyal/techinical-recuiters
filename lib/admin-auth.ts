"use client";

export interface AdminAuth {
  authenticated: boolean;
  username: string;
  timestamp: number;
}

const AUTH_KEY = "adminAuth";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const authData = localStorage.getItem(AUTH_KEY);
    if (!authData) return false;

    const auth: AdminAuth = JSON.parse(authData);
    
    // Check if session is still valid (within 24 hours)
    const now = Date.now();
    if (now - auth.timestamp > SESSION_DURATION) {
      localStorage.removeItem(AUTH_KEY);
      return false;
    }

    return auth.authenticated === true;
  } catch {
    return false;
  }
}

export function getAdminAuth(): AdminAuth | null {
  if (typeof window === "undefined") return null;

  try {
    const authData = localStorage.getItem(AUTH_KEY);
    if (!authData) return null;

    return JSON.parse(authData) as AdminAuth;
  } catch {
    return null;
  }
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
}

