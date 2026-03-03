import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthUser {
    id: number;
    name: string;
    role: string;
    referenceId: number;
}

export interface AuthResponse {
    token: string;
    user: AuthUser;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'auth_user';

    constructor(private router: Router) { }

    /**
     * Store authentication token and user data
     */
    setAuthData(response: AuthResponse): void {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    }

    /**
     * Get stored JWT token
     */
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    /**
     * Get stored user data
     */
    getUser(): AuthUser | null {
        const userStr = localStorage.getItem(this.USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    }

    /**
     * Get user role
     */
    getUserRole(): string | null {
        const user = this.getUser();
        return user ? user.role : null;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        // Check if token is expired (basic check - decode JWT payload)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000; // Convert to milliseconds
            return Date.now() < exp;
        } catch (error) {
            return false;
        }
    }

    /**
     * Check if user has specific role
     */
    hasRole(role: string): boolean {
        return this.getUserRole() === role;
    }

    /**
     * Check if user has any of the specified roles
     */
    hasAnyRole(roles: string[]): boolean {
        const userRole = this.getUserRole();
        return userRole ? roles.includes(userRole) : false;
    }

    /**
     * Clear authentication data and logout
     */
    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.router.navigate(['/login']);
    }

    /**
     * Get authentication header for HTTP requests
     */
    getAuthHeader(): { Authorization: string } | {} {
        const token = this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
}
