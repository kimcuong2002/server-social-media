import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Market } from './entities/market.entity';
import { UserModule } from '../user/user.module';
import { MarketService } from './market.service';
import { MarketResolver } from './market.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Market]), UserModule],
  providers: [MarketService, MarketResolver],
  exports: [],
})
export class MarketModule {}
