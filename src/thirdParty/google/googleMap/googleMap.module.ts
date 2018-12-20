import { Module } from '@nestjs/common';
import { HttpModule } from '../../../http/http.module';
import { GoogleMapService } from './googleMap.service';

@Module({
  imports: [HttpModule],
  providers: [GoogleMapService],
  exports: [GoogleMapService],
})
export class GoogleMapModule {}
