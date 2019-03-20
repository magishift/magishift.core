import { FormSchemas } from './form.decorator';
import { GridSchemas } from './grid.decorator';
import { IFormSchema } from './interfaces/form.interface';
import { IGridSchema } from './interfaces/grid.interface';

function replaceControllerToDTO(str: string): string {
  return str.replace('Service', 'Dto');
}

export function GetFormSchema(serviceName: string): IFormSchema {
  const dtoName = replaceControllerToDTO(serviceName);
  return { schema: { ...FormSchemas[dtoName] } };
}

export function GetGridSchema(serviceName: string): IGridSchema {
  const dtoName = replaceControllerToDTO(serviceName);
  return { schema: { ...GridSchemas[dtoName] } };
}
