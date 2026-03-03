import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Authentication Middleware
 * Verifies JWT token from Authorization header
 */
export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const jwtSecret = process.env.JWT_SECRET || "your-default-secret-change-in-production";

        const decoded = jwt.verify(token, jwtSecret);

        // Attach user info to request for downstream use
        (req as any).user = decoded;

        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
        return res.status(401).json({ message: "Unauthorized" });
    }
}

/**
 * Role-based Authorization Middleware Factory
 * Creates middleware that checks if user has required role
 */
export function requireRole(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                message: "Forbidden: You do not have permission to access this resource"
            });
        }

        next();
    };
}
