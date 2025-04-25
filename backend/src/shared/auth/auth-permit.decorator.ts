import { SetMetadata } from '@nestjs/common';
import { PermitUser } from './auth.interface';

export const ACTION_PERMIT_CONDITION = 'action_permit_condition';
export const PermissionGateKeeper = (
  permission: PermitUser,
): MethodDecorator & ClassDecorator => {
  const finalPermission: PermitUser = {
    ...permission,
    allowPeasants: permission.allowPeasants ?? false,
  };
  return SetMetadata(ACTION_PERMIT_CONDITION, finalPermission);
};
