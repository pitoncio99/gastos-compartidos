import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { GroupTotalsService } from './group-totals.service';
import { GroupTotals } from './interfaces/group-totals.interfaces';  // Asegúrate de definir esta interfaz
import { GroupTotalsDto } from './dto/group-totals.dto';  // Asegúrate de crear este DTO

@Controller('group-totals')
export class GroupTotalsController {
  constructor(private readonly groupTotalsService: GroupTotalsService) {}

  // Guardar los totales
  @Post()
  async create(@Body() groupTotalsDto: GroupTotalsDto): Promise<GroupTotals> {
    return this.groupTotalsService.create(groupTotalsDto);
  }

  // Obtener los totales por ID de grupo
  @Get(':groupId')
  async findByGroupId(@Param('groupId') groupId: string): Promise<GroupTotals> {
    return this.groupTotalsService.findByGroupId(groupId);
  }
}
