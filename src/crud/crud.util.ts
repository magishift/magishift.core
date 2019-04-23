import { FormSchemaRegistries } from './form.decorator';
import { GridSchemaRegistries } from './grid.decorator';
import { IFormSchema } from './interfaces/form.interface';
import { IGridSchema } from './interfaces/grid.interface';
import { IKanban } from './interfaces/kanban.interface';
import { KanbanSchemas } from './kanban.decorator';

function replaceControllerToDTO(str: string): string {
  return str.replace('Service', 'Dto');
}

export function GetFormSchema(serviceName: string): IFormSchema {
  const dtoName = replaceControllerToDTO(serviceName);
  return { schema: FormSchemaRegistries[dtoName] };
}

export function GetGridSchema(serviceName: string): IGridSchema {
  const dtoName = replaceControllerToDTO(serviceName);
  return { schema: GridSchemaRegistries[dtoName] };
}

export function GetKanbanSchema(serviceName: string): IKanban {
  const dtoName = replaceControllerToDTO(serviceName);
  return KanbanSchemas[dtoName];
}
