import { SnakeNamingStrategy } from '@magishift/config';
import { HttpModule } from '@magishift/http';
import { IRedisModuleOptions, RedisModule } from '@magishift/redis';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv = require('dotenv');
import { join } from 'path';
import { KeycloakController } from './keycloak.controller';
import { KeycloakEntity } from './keycloak.entity';
import { KeycloakService } from './keycloak.service';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

process.env = { ...parsed, ...process.env };

const redisConfig: IRedisModuleOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  username: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  synchronize: false,
  entities: [join(__dirname, '**.entity{.ts,.js}')],
  namingStrategy: new SnakeNamingStrategy(),
  cache: {
    type: 'redis',
    options: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      duration: 30000,
    },
  },
};

@Module({
  imports: [
    RedisModule.register(redisConfig),
    TypeOrmModule.forRoot(dbConfig),
    HttpModule,
    TypeOrmModule.forFeature([KeycloakEntity]),
  ],
  controllers: [KeycloakController],
  providers: [KeycloakService],
  exports: [KeycloakService],
})
export class KeycloakModule {}
