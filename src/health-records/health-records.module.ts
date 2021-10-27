import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { HealthRecordsController } from './health-records.controller';
import { HealthRecordsProcessor } from './health-records.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'health_records',
    }),
  ],
  controllers: [HealthRecordsController],
  providers: [HealthRecordsProcessor],
})
export class HeathRecordsModule {}
