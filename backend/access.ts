import { ListAccessArgs } from './types';

// Simply, the access control returns yes or no value
// depending on the user session

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}
