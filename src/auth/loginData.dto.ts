import { ApiModelProperty } from '@nestjs/swagger';
import { ILoginDataDto } from './interfaces/auth.interface';

export abstract class LoginData implements ILoginDataDto {
  @ApiModelProperty()
  username: string;

  @ApiModelProperty()
  password: string;

  readonly role: string;
}
