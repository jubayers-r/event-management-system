export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    }
  }
}

export interface jwtUser {
  id: string;
  email: string;
  name: string;
  role: string;
}
