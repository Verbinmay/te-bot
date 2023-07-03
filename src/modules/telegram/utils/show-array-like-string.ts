import { SA_ViewAdminDto } from '../dto/user/sa-view-admin.dto';

export const showArrayOfObjectsLikeString = (objects: Array<any>) => {
  let result = '';
  objects.forEach((obj, index) => {
    Object.entries(obj).forEach(([key, value]) => {
      result += `  ${key}: ${value}\n`;
    });
    result += '\n';
  });

  return result;
};
