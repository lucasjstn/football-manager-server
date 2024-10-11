import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity'
import { DbConfigService } from './db/db.config.services';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), TypeOrmModule.forRootAsync({
    useClass: DbConfigService,
    inject: [DbConfigService]
  }), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
