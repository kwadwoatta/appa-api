import { SetMetadata } from '@nestjs/common';
import { Role } from 'common/enums';

export const ROLE_KEY = 'role';
export const AllowRole = (role: Role) => SetMetadata(ROLE_KEY, role);
