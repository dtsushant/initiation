
// types/express.d.ts
import { UserDTO } from '../features/user/user.entity';

declare module 'express' {
  interface Request {
    user?: UserDTO;
  }
}
