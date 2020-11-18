import { ObjectID } from 'mongodb';

export type Id = {
  _id: ObjectID;
};

export type User = {
  email: string;
  getNews: boolean;
};

export type FullUser = Id &
  User & {
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    password?: string;
    mailchimpId?: string;
  };

export type Admin = Omit<FullUser, 'isActive' | 'createdAt'>;

export type UserQuery = {
  skip: number;
  limit: number;
  search: string;
};
