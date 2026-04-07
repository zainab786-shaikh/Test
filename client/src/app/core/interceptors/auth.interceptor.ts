import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    
    const publicEndpoints = ['/logindetail/validate', '/public'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));

    if (token && !isPublicEndpoint) {
        
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(authReq);
    }

    return next(req);
};
