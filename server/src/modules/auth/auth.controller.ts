import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import {
  badRequest,
  notFound,
  okResponse,
  postSuccessful,
  unauthorizedRequest,
} from "../../utils/responseHandler";
import { Prisma } from "../../../generated/prisma/client";

const create = async (req: Request, res: Response) => {
  try {
    const { password, ...rest } = req.body;

    if (!password) {
      return badRequest(res, "Password is required");
    }

    const hashedPass = await bcrypt.hash(password, 10);

    // lowercase all string fields
    const loweredRest: Record<string, any> = {};
    for (const key in rest) {
      const value = rest[key];
      loweredRest[key] =
        typeof value === "string" ? value.toLowerCase() : value;
    }

    const user = await prisma.user.create({
      data: {
        ...(loweredRest as Prisma.UserCreateInput),
        password: hashedPass,
      },
    });

    // remove password before sending
    const { password: _, ...safeUser } = user;

    postSuccessful(res, "User registered", safeUser);
  } catch (error: any) {
    if (error.code === "P2002") {
      return badRequest(res, "User already exists");
    }
    return badRequest(res, error.message);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return badRequest(res, "Email and password are required");
    }

    email = email.toLowerCase();

    // 2️⃣ Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return notFound(res, "User");
    }

    // 3️⃣ Ensure password exists
    if (!user.password) {
      return unauthorizedRequest(res, "credentials");
    }

    // 4️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return unauthorizedRequest(res, "credentials");
    }

    // 5️⃣ Optional: email verification check
    // if (!user.emailVerified) {
    //   return unauthorizedRequest(res, "Email not verified");
    // }

    // 6️⃣ Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7h",
      },
    );

    // 7️⃣ Set cookie (DEV + PROD SAFE)
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    // 8️⃣ Remove password before response
    const { password: _, ...safeUser } = user;

    return okResponse(res, "Login successful", {
      token, // useful for Postman / mobile
      user: safeUser,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return badRequest(res, "Invalid login request");
  }
};

const logout = async (_req: Request, res: Response) => {
  // clear the cookie
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return okResponse(res, "Logged out successfully");
};

export const authController = {
  create,
  login,
  logout,
};
