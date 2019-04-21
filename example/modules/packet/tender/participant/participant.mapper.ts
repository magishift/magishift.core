import { Injectable } from '@nestjs/common';
import { CrudMapper } from '../../../../../src/crud/crud.mapper';
import { IParticipant, IParticipantDto } from './interfaces/participant.interface';
import { ParticipantDto } from './participant.dto';
import { Participant } from './participant.entity';

@Injectable()
export class ParticipantMapper extends CrudMapper<IParticipant, IParticipantDto> {
  constructor() {
    super(Participant, ParticipantDto);
  }
}
