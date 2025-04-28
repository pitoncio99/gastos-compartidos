import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GroupTotals } from './interfaces/group-totals.interfaces';  // Asegúrate de definir esta interfaz
import { GroupTotalsDto } from './dto/group-totals.dto';  // Asegúrate de crear este DTO
import { NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';
@Injectable()
export class GroupTotalsService {
  constructor(
    @InjectModel('GroupTotals') private readonly groupTotalsModel: Model<GroupTotals>,
  ) {}

  // Crear los totales
  async create(groupTotalsDto: GroupTotalsDto): Promise<GroupTotals> {
    const { groupId, deudas, productos, nombre } = groupTotalsDto;
  
    const createdTotals = new this.groupTotalsModel({
      groupId: new mongoose.Types.ObjectId(groupId), // <- transformar aquí
      deudas,
      nombre,
      productos,
      createdAt: new Date(),
    });
  
    return await createdTotals.save();
  }

  // Obtener los totales por ID de grupo
  async findByGroupId(groupId: string): Promise<GroupTotals> {
    const groupTotals = await this.groupTotalsModel.findOne({ groupId }).exec();
    if (!groupTotals) {
      throw new NotFoundException(`Totales no encontrados para el grupo con ID ${groupId}`);
    }
    return groupTotals;
  }
}
