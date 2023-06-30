import { SA_ViewAdminDto } from '../dto/user/sa-view-admin.dto';

export const showArrayOfObjects = (objects: Array<SA_ViewAdminDto>) => {
  let result = '';
  objects.forEach((obj, index) => {
    result += `${obj.role} ${index + 1}:\n`;
    Object.entries(obj).forEach(([key, value]) => {
      result += `  ${key}: ${value}\n`;
    });
    result += '\n';
  });

  return result;
};
