import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 60 * 24,
      store: 'memory',
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
