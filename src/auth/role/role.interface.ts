import { DefaultRoles } from './role.const';

export interface IEndpointRoles {
  default: (string | DefaultRoles)[];
  read?: (string | DefaultRoles)[];
  write?: (string | DefaultRoles)[];
  update?: (string | DefaultRoles)[];
  delete?: (string | DefaultRoles)[];
}
