import { Request } from 'express';

export interface RequestWithDriver extends Request {
  driver?: {
    id: string;
    email: string;
    names: string;
  };
}
