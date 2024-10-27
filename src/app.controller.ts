import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'exemplo' })
  @ApiResponse({ status: 200, description: 'Rota funcionando' })
  getHello(): string {
    return this.appService.getHello();
  }
}
