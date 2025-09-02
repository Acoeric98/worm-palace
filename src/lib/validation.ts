export const USERNAME_REGEX = /^[A-Za-z0-9_]+$/;

export function isValidUsername(username: string): boolean {
  return USERNAME_REGEX.test(username);
}
