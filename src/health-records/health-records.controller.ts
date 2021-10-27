import { InjectQueue } from '@nestjs/bull';
import { Controller, Post } from '@nestjs/common';
import { Queue } from 'bull';

@Controller('health-records')
export class HealthRecordsController {
  constructor(@InjectQueue('health_records') private readonly healthRecordsQueue: Queue) {}

  @Post('pull')
  async start(): Promise<void> {
    await this.healthRecordsQueue.add('health_records.pull.start', {
      healthGorillaPatientId: '1'
    });
  }
}
