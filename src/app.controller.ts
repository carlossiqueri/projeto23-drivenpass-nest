import {
  Body,
  Controller,
  Delete,
  Get,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth/auth.guard';
import { User } from './decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import { DeleteDto } from './users/dto/delete-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth(): string {
    return this.appService.getHealth();
  }

  @Delete('erase')
  @UseGuards(AuthGuard)
  erase(@Body() deleteDto: DeleteDto, @User() user: UserPrisma) {
    if (!deleteDto.password) throw new UnauthorizedException();

    return this.appService.erase(deleteDto, user);
  }
}
