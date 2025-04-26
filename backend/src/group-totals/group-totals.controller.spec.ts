import { Test, TestingModule } from '@nestjs/testing';
import { GroupTotalsController } from './group-totals.controller';

describe('GroupTotalsController', () => {
  let controller: GroupTotalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupTotalsController],
    }).compile();

    controller = module.get<GroupTotalsController>(GroupTotalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
