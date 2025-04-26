import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupsModule } from './groups/groups.module';
import { GroupTotalsModule } from './group-totals/group-totals.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Carga automáticamente el .env
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    GroupsModule,
    GroupTotalsModule,
  ],
})
export class AppModule {}
