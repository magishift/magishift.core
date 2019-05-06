import { ICrudDto } from './interfaces/crud.interface';
import { IKanban } from './interfaces/kanban.interface';

export const KanbanSchemas: { [key: string]: IKanban } = {};

export const Kanban = (key: string): any => {
  return (target: { name: string; prototype: ICrudDto }) => {
    KanbanSchemas[target.name] = { keyField: key };
  };
};
