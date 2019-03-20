import { Entity } from 'typeorm';
import { IUser } from '../../user/interfaces/user.interface';
import { User } from '../../user/user.entity';

@Entity()
export class Admin extends User implements IUser {}
