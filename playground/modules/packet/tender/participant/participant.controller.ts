import { Body, Controller, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DefaultRoles } from '../../../../../src/auth/role/defaultRoles';
import { Roles } from '../../../../../src/auth/role/roles.decorator';
import { CrudControllerFactory } from '../../../../../src/crud/crud.controller';
import { FileStorageDto } from '../../../../../src/fileStorage/fileStorage.dto';
import { FileStorageService } from '../../../../../src/fileStorage/fileStorage.service';
import { IFileStorageDto } from '../../../../../src/fileStorage/interfaces/fileStorage.interface';
import { ExceptionHandler } from '../../../../../src/utils/error.utils';
import { PARTICIPANT_ENDPOINT } from './interfaces/participant.const';
import { IParticipant, IParticipantDto } from './interfaces/participant.interface';
import { ParticipantMapper } from './participant.mapper';
import { ParticipantService } from './participant.service';

@Controller(PARTICIPANT_ENDPOINT)
export class ParticipantController extends CrudControllerFactory<IParticipantDto, IParticipant>(PARTICIPANT_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(
    protected readonly service: ParticipantService,
    protected readonly fileService: FileStorageService,
    protected readonly mapper: ParticipantMapper,
  ) {
    super(service, mapper);
  }

  @Post('document')
  @UseInterceptors(FileInterceptor('file'))
  @Roles(DefaultRoles.authenticated)
  async document(@UploadedFile() file: any, @Body() { id }: { id }, @Res() res: any): Promise<IFileStorageDto> {
    try {
      if (!id) {
        return ExceptionHandler('Object ID is required', 400);
      }

      const data = new FileStorageDto();

      let participant: IParticipantDto;
      if (await this.service.isExist(id)) {
        participant = await this.service.fetch(id);
        if (participant.document) {
          data.id = participant.document.id;
        }
      }

      data.file = file;
      data.ownerId = id;
      data.object = 'document';
      data.type = 'document';

      const uploadResult = await this.fileService.upload(data, DefaultRoles.authenticated);

      if (participant) {
        participant.document = uploadResult;

        await this.service.update(id, participant);
      }

      return res.status(200).json(uploadResult);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }
}
