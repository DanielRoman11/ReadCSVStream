import {
  Controller,
  Get,
  Logger,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller()
// @UseInterceptors(CacheInterceptor)
export class AppController {
  private logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Get('stream')
  @UseGuards(ThrottlerGuard)
  async RetirosStream(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 100,
  ) {
    this.logger.warn('Function Call..');
    return await this.appService.getCsvData(Number(page), Number(pageSize));
  }

  @Get('map')
  @UseGuards(ThrottlerGuard)
  async RetirosMap(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 100,
  ) {
    this.logger.warn('Function Call..');
    return await this.appService.getCsvMap(Number(page), Number(pageSize));
  }

  @Get('order')
  async OrderCsv() {
    return await this.appService.orderCsv();
  }
}
