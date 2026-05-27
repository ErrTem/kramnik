import type { User } from '@prisma/client';

/** Safe user shape for API/UI — never expose passwordHash. */
export type UserPublic = Omit<User, 'passwordHash'>;
