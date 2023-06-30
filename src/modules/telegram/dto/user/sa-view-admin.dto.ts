import { Roles } from './create-user.dto';

export class SA_ViewAdminDto {
  public telegramId: string;
  public userName: string;
  public firstName: string;
  public lastName: string;
  public role: Roles;
  public createdAt: Date;
}
