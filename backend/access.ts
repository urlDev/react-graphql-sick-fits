import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

// Simply, the access control returns yes or no value
// depending on the user session

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

// permissions check if someone meets a criteria yer or no
export const permissions = {
  ...generatedPermissions,
};

// Rule based function
// rules can return a boolean
// - yes or no or a filter which limits
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have the permission for this
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. If not, do they own this item?
    return { user: { id: session.itemId } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageProducts({ session })) {
      return true;
    }

    // they should only see available products
    return { status: 'AVAILABLE' };
  },
  canOrder({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have the permission for this
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // 2. If not, do they own this item?
    return { user: { id: session.itemId } };
  },
  canManageOrderItems({ session }: ListAccessArgs) {
    // 1. Do they have the permission for this
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // 2. If not, do they own this item?
    return { order: { user: { id: session.itemId } } };
  },
  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have the permission for this
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    // 2. If not, do they own this item?
    return { id: session.itemId };
  },
};
