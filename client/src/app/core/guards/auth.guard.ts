import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';


export const authGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    
    router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
    });
    return false;
};


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

        
        router.navigate(['/unauthorized']);
        return false;
    };
}


export const guestGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
        return true;
    }

    
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
