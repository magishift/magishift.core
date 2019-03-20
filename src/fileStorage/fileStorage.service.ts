import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';
import * as shell from 'shelljs';
import { Repository } from 'typeorm';
import { ConfigService } from '../config/config.service';
import { CrudService } from '../crud/crud.service';
import { DraftService } from '../crud/draft/draft.service';
import { FileStorageDto } from './fileStorage.dto';
import { FileStorage } from './fileStorage.entity';
import { FileStorageMapper } from './fileStorage.mapper';
import { IFileStorage, IFileStorageDto } from './interfaces/fileStorage.interface';

@Injectable()
export class FileStorageService extends CrudService<IFileStorage, IFileStorageDto> {
  private s3: AWS.S3 = new AWS.S3();

  constructor(
    @InjectRepository(FileStorage) protected readonly repository: Repository<FileStorage>,
    protected readonly draftService: DraftService,
    protected readonly mapper: FileStorageMapper,
  ) {
    super(repository, draftService, mapper);

    if (ConfigService.getConfig.s3) {
      AWS.config.update({
        accessKeyId: ConfigService.getConfig.s3.key,
        secretAccessKey: ConfigService.getConfig.s3.secrets,
      });
    }
  }

  async openFileS3(url: string): Promise<AWS.S3.GetObjectOutput> {
    const param: AWS.S3.Types.GetObjectRequest = {
      Bucket: ConfigService.getConfig.s3.bucketName,
      Key: url,
    };
    const result = await this.s3.getObject(param).promise();

    return result;
  }

  async upload(file: IFileStorageDto, ...permissions: string[]): Promise<IFileStorageDto> {
    if (ConfigService.getConfig.s3) {
      return this.uploadS3(file, ...permissions);
    } else {
      return this.uploadLocal(file, ...permissions);
    }
  }

  async uploadMultiple(files: FileStorageDto[]): Promise<IFileStorageDto[]> {
    const results = [];

    await files.forEach(async file => {
      results.push(await this.upload(file));
    });

    return results;
  }

  private async uploadS3(file: IFileStorageDto, ...permissions: string[]): Promise<IFileStorageDto> {
    const extension = path.extname(file.file.originalname);

    const fileName = `${file.type}${extension}`;

    const dir = `files/uploads/${file.object}/${file.ownerId}/`;

    const params: AWS.S3.Types.PutObjectRequest = {
      Bucket: ConfigService.getConfig.s3.bucketName,
      Key: dir + fileName,
      Body: file.file.buffer,
      ACL: 'public-read',
    };

    const s3Result = await this.s3.upload(params).promise();

    delete file.file.buffer;

    file.url = s3Result.Key;

    file.permissions = file.permissions || permissions;
    file.storage = 'S3';

    const findInDb = await this.repository.findOne({
      object: file.object,
      type: file.type,
      ownerId: file.ownerId,
    });

    if (findInDb) {
      file.id = findInDb.id;
      await this.update(findInDb.id, file);
      return file;
    } else {
      await this.create(file);
      return file;
    }
  }

  private async uploadLocal(file: IFileStorageDto, ...permissions: string[]): Promise<IFileStorageDto> {
    const extension = path.extname(file.file.originalname);

    const fileName = `${file.type}${extension}`;

    const dir = `files/uploads/${file.object}/${file.ownerId}/`;

    if (!fs.existsSync(dir)) {
      shell.mkdir('-p', dir);
    }

    fs.writeFileSync(dir + fileName, file.file.buffer);

    // remove buffer to minimize resources
    delete file.file.buffer;

    file.url = dir + fileName;

    file.permissions = file.permissions || permissions;
    file.storage = 'local';

    const findInDb = await this.repository.findOne({
      object: file.object,
      type: file.type,
      ownerId: file.ownerId,
    });

    if (findInDb) {
      file.id = findInDb.id;
      await this.update(findInDb.id, file);
      return file;
    } else {
      await this.create(file);
      return file;
    }
  }
}
