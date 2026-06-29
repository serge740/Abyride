import { Request } from 'express';

export interface RequestWithMember extends Request {
  member?: {
    id: string;
    email: string;
    names: string;
  };
}
