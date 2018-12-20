import { FormSchemas } from './form.decorator';
import { GridSchemas } from './grid.decorator';
import { IFormSchema } from './interfaces/form.interface';
import { IGridSchema } from './interfaces/grid.interface';

function replaceControllerToDTO(str: string): string {
  return str.replace('Controller', 'Dto');
}

export function GetFormSchema(controllerName: string): IFormSchema {
  const dtoName = replaceControllerToDTO(controllerName);
  return { schema: { ...FormSchemas[dtoName] } };
}

export function GetGridSchema(controllerName: string): IGridSchema {
  const dtoName = replaceControllerToDTO(controllerName);
  return { schema: { ...GridSchemas[dtoName] } };
}
