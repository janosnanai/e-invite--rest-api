import { Document } from "mongoose";

export interface PartnerDocument extends Document {
  firstName: string;
  lastName: string;
  nickName: string | null;
  specialDiet: string[] | [];
}

export interface ChildDocument extends Document {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string | null;
  age: number;
  specialDiet: string[] | [];
}

export interface GuestDocument extends Document {
  voucherId: string;
  firstName: string;
  lastName: string;
  nickName: string | null;
  email: string | null;
  phone: string | null;
  isComing: boolean;
  didReply: boolean;
  specialDiet: string[] | [];
  partner: PartnerDocument | null;
  children: ChildDocument[] | [];
  createdDate: Date;
  modifiedDate: Date;
}
