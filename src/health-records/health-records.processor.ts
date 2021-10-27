import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Queue, Job } from 'bull';

const RESOURCES = [
  'encounters',
  'procedures'
];

const OPTIONS = {
  attempts: 3
};

@Processor('health_records')
export class HealthRecordsProcessor {
  private readonly logger = new Logger(HealthRecordsProcessor.name);
  constructor(@InjectQueue('health_records') private healthRecordsQueue: Queue) {}
  

  @Process('health_records.pull.start')
  startPulling(job: Job): void {
    console.log('Starting pipeline for patient:', job.data.healthGorillaPatientId)

    this.healthRecordsQueue.add('health_records.pull.update', job.data, OPTIONS)
  }

  @Process('health_records.pull.update')
  async pullUpdate(job: Job): Promise<void> {
    try {
      console.log('Querying $p-360...');
      console.log('Patient $p-360 updated:', job.data.healthGorillaPatientId);
    } catch (error) {
      if (job.attemptsMade === OPTIONS.attempts) {
        await this.startResourcePipeline(job);
      } else {
        this.logger.error(error.message);
        await job.retry();
      }
    }
  }

  @Process('health_records.pull.encounters')
  async pullEncounters(job: Job): Promise<void> {
    try {
      this.logger.debug('Start pulling patient...');
      this.logger.debug(job.data);
      this.logger.debug('Patient encounters saved');
    } catch (error) {
      this.logger.error(error.message);
      await job.retry();
    }
  }

  @Process('health_records.pull.procedures')
  async pullProcedures(job: Job): Promise<void> {
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Unexpected error')), 10000)
      });
      // this.logger.debug('Start pulling  procedures...');
      // this.logger.debug(job.data);
      // this.logger.debug('Patient procedures saved');
    } catch (error) {
      this.logger.error(error.message);
      await job.retry();
    }
  }

  async startResourcePipeline(job: Job): Promise<void> {
    const resourceJobs = RESOURCES.map((resource) => ({
      name: `health_records.pull.${resource}`,
      data: job.data,
      opts: OPTIONS,
    }));

    await this.healthRecordsQueue.addBulk(resourceJobs);
  }
}
