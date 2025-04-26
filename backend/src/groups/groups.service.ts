import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group } from './schemas/group.schema';

@Injectable()
export class GroupsService {
    constructor(@InjectModel('Group') private groupModel: Model<Group>) { }

    // Crear un nuevo grupo
    async create(name: string, members: string[]): Promise<Group> {
        const group = new this.groupModel({ name, members });
        return await group.save();
    }

    // Obtener todos los grupos
    async findAll(): Promise<Group[]> {
        return await this.groupModel.find().exec();
    }

    // Obtener un grupo por ID
    async findOne(id: string): Promise<Group | null> {
        return await this.groupModel.findById(id).exec();
    }


    // Actualizar un grupo
    // Actualizar un grupo
    async update(id: string, name: string, members: string[]): Promise<Group | null> {
        return await this.groupModel.findByIdAndUpdate(id, { name, members }, { new: true }).exec();
    }


    // Eliminar un grupo
    async remove(id: string): Promise<Group | null> {
        return await this.groupModel.findByIdAndDelete(id).exec();
    }

}
