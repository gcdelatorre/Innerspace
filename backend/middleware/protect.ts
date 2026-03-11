import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/db";

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: any; // You can define a proper User type here later
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // 1. Get token from Headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        // 2. The "Supabase Way" to verify the token:
        // This validates the JWT and returns the user object.
        // It's better than manual JWT verification because it also checks if the user is still valid/active.
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }

        // 3. Attach user to request
        req.user = user;
        next();
    } catch (err: any) {
        console.error("Auth error:", err.message);
        res.status(401).json({ message: "Token verification failed" });
    }
};
