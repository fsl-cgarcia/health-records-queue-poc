import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeathRecordsModule } from './health-records/health-records.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    HeathRecordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
