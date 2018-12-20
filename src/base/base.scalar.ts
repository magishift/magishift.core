import { Scalar } from '@nestjs/graphql';
import { Kind } from 'graphql';

@Scalar('Date')
export class DateScalar {
  description: string = 'Date custom scalar type';

  parseValue(value: string): Date {
    return new Date(value); // value from the client
  }

  serialize(value: Date): number {
    return value.getTime(); // value sent to the client
  }

  parseLiteral(ast: any): null | number {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10); // ast value is always in string format
    }
    return null;
  }
}
