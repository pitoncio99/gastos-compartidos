import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupTotalsController } from './group-totals.controller';
import { GroupTotalsService } from './group-totals.service';
import { GroupTotalsSchema } from './schemas/group-totals.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'GroupTotals', schema: GroupTotalsSchema }])],
  controllers: [GroupTotalsController],
  providers: [GroupTotalsService],
})
export class GroupTotalsModule {}
