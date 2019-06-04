import { DefaultRoles } from '../../../auth/role/defaultRoles';

export interface IEndpointUserRoles {
  default: (string | DefaultRoles)[];
  read?: (string | DefaultRoles)[];
  write?: (string | DefaultRoles)[];
  update?: (string | DefaultRoles)[];
  delete?: (string | DefaultRoles)[];
}
