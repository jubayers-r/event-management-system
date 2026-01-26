import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

/**
 * ROLES
 */
export enum UserRole {
  HOST = "HOST",
  USER = "USER",
  MANAGER = "MANAGER",
}

/**
 * JWT PAYLOAD TYPE
 */
type JwtPayload = {
  id: string;
  role: UserRole;
};

/**
 * MAIN AUTHORIZATION MIDDLEWARE
 */
const authorization = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const token = req.cookies?.access_token;
      const token = req.headers["authorization"] as string | undefined;

      // console.log({ cookies: req.cookies });

      if (!token) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }

      let decoded: JwtPayload;

      try {
        decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as string,
        ) as JwtPayload;
      } catch {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }

      // if (!user.emailVerified) {
      //   return res.status(403).json({
      //     success: false,
      //     message: "Email not verified",
      //   });
      // }

      // attach user to req (same shape you were using)
      req.user = {
        id: user.id,
        email: user.email!,
        name: user.name!,
        role: user.role!,
      };

      if (roles.length && !roles.includes(user.role as UserRole)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden! You don't have permission to access this resource!",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authorization;
