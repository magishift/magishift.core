import { Column, Entity } from 'typeorm';
import { DefaultRoles } from '../auth/role/defaultRoles';
import { CrudEntity } from '../crud/crud.entity';
import { IFile, IFileStorage } from './interfaces/fileStorage.interface';

@Entity()
export class FileStorage extends CrudEntity implements IFileStorage {
  @Column()
  ownerId: string;

  @Column({ unique: true })
  url: string;

  @Column()
  object: string;

  @Column()
  type: string;

  @Column({ type: 'simple-json', default: {} })
  meta: IFile;

  @Column({ type: 'simple-array', default: [DefaultRoles.public] })
  permissions: string[];

  @Column({ default: 'local' })
  storage: 'local' | 'S3' = 'local';

  @Column({ default: 'submitted' })
  dataStatus: 'temp' | 'submitted';
}
