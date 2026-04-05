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

    
    setAuthData(response: AuthResponse): void {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    }

    
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    
    getUser(): AuthUser | null {
        const userStr = localStorage.getItem(this.USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    }

    
    getUserRole(): string | null {
        const user = this.getUser();
        return user ? user.role : null;
    }

    
    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000; 
            return Date.now() < exp;
        } catch (error) {
            return false;
        }
    }

    
    hasRole(role: string): boolean {
        return this.getUserRole() === role;
    }

    
    hasAnyRole(roles: string[]): boolean {
        const userRole = this.getUserRole();
        return userRole ? roles.includes(userRole) : false;
    }

    
    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.router.navigate(['/login']);
    }

    
    getAuthHeader(): { Authorization: string } | {} {
        const token = this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
}
