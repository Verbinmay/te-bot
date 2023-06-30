export type Roles = 'admin' | 'user';

export class CreateUserDto {
  role: Roles;
  firstName: string;
  lastName: string;
  userName: string;
  telegramId: string;
}
