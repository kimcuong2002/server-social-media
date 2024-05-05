import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Market } from './entities/market.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Market]), UserModule],
  providers: [],
  exports: [],
})
export class PostModule {}
