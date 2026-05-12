import * as bcrypt from 'bcrypt';

/** Mismo valor en seed y en UsersService. */
export const USER_PASSWORD_BCRYPT_ROUNDS = 10;

/** Detecta strings ya guardados con bcrypt ($2a$, $2b$, $2y$). */
export function isBcryptPasswordHash(value: string): boolean {
  return /^\$2[aby]\$\d{2}\$/.test(value);
}

/** Solo para contraseñas en texto plano recibidas por API o migradas. */
export async function hashUserPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, USER_PASSWORD_BCRYPT_ROUNDS);
}
