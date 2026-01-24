import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";

export enum UserRole {
  HOST = "HOST",
  USER = "USER",
  MANAGER = "MANAGER",
}

const authorization = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session) {
        return res.status(403).json({
          success: false,
          message: "unauthorized access",
        });
      }

      if (!session?.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "email not verified",
        });
      }

      req.user = {
        id: session?.user.id!,
        email: session?.user.email!,
        name: session?.user.name!,
        role: session?.user.role!,
      };

      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden! You don't have permission to access this resources!",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authorization;