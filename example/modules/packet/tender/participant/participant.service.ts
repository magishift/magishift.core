import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../../../../src/crud/crud.service';
import { DraftService } from '../../../../../src/crud/draft/draft.service';
import { IParticipant, IParticipantDto } from './interfaces/participant.interface';
import { Participant } from './participant.entity';
import { ParticipantMapper } from './participant.mapper';

@Injectable()
export class ParticipantService extends CrudService<IParticipant, IParticipantDto> {
  constructor(
    @InjectRepository(Participant) protected readonly repository: Repository<Participant>,
    protected readonly mapper: ParticipantMapper,
    protected readonly draftService: DraftService,
  ) {
    super(repository, draftService, mapper);
  }
}
