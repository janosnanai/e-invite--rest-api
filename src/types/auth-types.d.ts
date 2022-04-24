import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface UserDataJwtPayload extends JwtPayload {
  id: string;
  role: string;
}

export interface UserDataRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}
