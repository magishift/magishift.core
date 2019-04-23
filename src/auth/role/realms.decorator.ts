import { SetMetadata } from '@nestjs/common';

export const Realms = (...realm: string[]) => SetMetadata('realm', realm);
