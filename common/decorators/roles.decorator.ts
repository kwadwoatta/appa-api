import { SetMetadata } from '@nestjs/common';
import { Role } from 'common/enums';

export const ROLES_KEY = 'role';
export const AllowedRoles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
