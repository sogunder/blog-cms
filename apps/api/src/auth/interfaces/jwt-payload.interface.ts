import { UserRole } from '../../common/enums';

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
}
