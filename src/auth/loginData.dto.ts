import { ApiModelProperty } from '@nestjs/swagger';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class LoginInput {
  @Field()
  @ApiModelProperty()
  readonly username: string;

  @Field()
  @ApiModelProperty()
  readonly password: string;
}
