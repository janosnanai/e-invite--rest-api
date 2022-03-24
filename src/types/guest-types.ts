import { Document } from "mongoose";

export interface PartnerDocument extends Document {
  id?: string;
  firstName: string;
  lastName: string;
  nickName?: string;
  specialDietRequirements: string[] | [];
}

export interface ChildDocument extends Document {
  id?: string;
  firstName: string;
  lastName: string;
  nickName?: string;
  age: number;
  specialDietRequirements: string[] | [];
}

export interface GuestDocument extends Document {
  id?: string;
  firstName: string;
  lastName: string;
  nickName?: string;
  email?: string;
  phone?: string;
  isComing: boolean;
  didReply: boolean;
  specialDietRequirements: string[] | [];
  partner?: PartnerDocument;
  children: ChildDocument[] | [];
}
