export interface NameData {
  firstName: string;
  lastName: string;
  nickName: string | undefined;
}

export interface contactData {
  email: string | undefined;
  phone: string | undefined;
}

export interface partnerData {
  name: NameData;
  isComing: boolean;
  specialDietRequirements: string[] | [];
}

export interface childData {
  name: NameData;
  age: number;
  specialDietRequirements: string[] | [];
}

export interface GuestData {
  id: string;
  name: NameData;
  contact: contactData;
  isComing: boolean;
  didReply: boolean;
  specialDietRequirements: string[] | [];
  partner: partnerData | undefined;
  children: childData[] | [];
}
