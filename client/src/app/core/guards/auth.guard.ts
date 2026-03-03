import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Authentication Guard
 * Checks if user is logged in before allowing access
 */
export const authGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    // Redirect to login with return URL
    router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
    });
    return false;
};

/**
 * Role Guard Factory
 * Checks if user has required role(s)
 * Usage in routes: canActivate: [roleGuard(['admin', 'principal'])]
 */
export function roleGuard(allowedRoles: string[]): CanActivateFn {
    return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        const authService = inject(AuthService);
        const router = inject(Router);

        if (!authService.isAuthenticated()) {
            router.navigate(['/login'], {
                queryParams: { returnUrl: state.url }
            });
            return false;
        }

        const userRole = authService.getUserRole();

        if (userRole && allowedRoles.includes(userRole)) {
            return true;
        }

        // User is authenticated but doesn't have required role
        router.navigate(['/unauthorized']);
        return false;
    };
}

/**
 * Guest Guard
 * Redirects authenticated users away from login/register pages
 */
export const guestGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
        return true;
    }

    // Redirect authenticated users to their role-specific page
    const role = authService.getUserRole();
    switch (role) {
        case 'admin':
            router.navigate(['/school']);
            break;
        case 'principal':
        case 'teacher':
            router.navigate(['/school-dashboard']);
            break;
        case 'student':
            const user = authService.getUser();
            if (user) {
                router.navigate([`/student-dashboard/school/${user.referenceId}/standard/1/student/${user.id}`]);
            }
            break;
        default:
            router.navigate(['/']);
    }

    return false;
};
