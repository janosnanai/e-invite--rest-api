import mongoose from "mongoose";
import { Document } from "mongoose";

export interface PartnerDocument extends Document {
  firstName: string;
  lastName: string;
  nickName: string;
  foodGlutenFree: boolean;
  foodLactoseFree: boolean;
  foodDiabetic: boolean;
  partnerOf: mongoose.Types.ObjectId;
}

export interface ChildDocument extends Document {
  firstName: string;
  lastName: string;
  nickName: string;
  age: number;
  foodGlutenFree: boolean;
  foodLactoseFree: boolean;
  foodDiabetic: boolean;
  parent: mongoose.Types.ObjectId;
}

export interface GuestDocument extends Document {
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  phone: string;
  isComing: boolean;
  didReply: boolean;
  foodGlutenFree: boolean;
  foodLactoseFree: boolean;
  foodDiabetic: boolean;
  partner: mongoose.Types.ObjectId | null;
  children: mongoose.Types.ObjectId[] | [];
  createdDate: number;
  modifiedDate: number;
}
