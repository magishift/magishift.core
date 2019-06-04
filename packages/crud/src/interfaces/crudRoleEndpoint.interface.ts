import { DefaultRoles } from '@magishift/auth';

export interface ICrudRoleEndpoint {
  default: (string | DefaultRoles)[];
  read?: (string | DefaultRoles)[];
  write?: (string | DefaultRoles)[];
  update?: (string | DefaultRoles)[];
  delete?: (string | DefaultRoles)[];
}
