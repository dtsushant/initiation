// types/express.d.ts
import { IUserData } from '../features/user/user.interface';

declare module 'express' {
  interface Request {
    user?: IUserData;
  }
}
