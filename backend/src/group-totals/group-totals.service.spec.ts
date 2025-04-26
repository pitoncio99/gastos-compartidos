import { Test, TestingModule } from '@nestjs/testing';
import { GroupTotalsService } from './group-totals.service';

describe('GroupTotalsService', () => {
  let service: GroupTotalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupTotalsService],
    }).compile();

    service = module.get<GroupTotalsService>(GroupTotalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
