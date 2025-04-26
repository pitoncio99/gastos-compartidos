import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { Group } from './schemas/group.schema';

@Controller('groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) { }

    // Crear un nuevo grupo
    @Post()
    async create(@Body() body: { name: string; members: string[] }): Promise<Group> {
        return this.groupsService.create(body.name, body.members);
    }

    // Obtener todos los grupos
    @Get()
    async findAll(): Promise<Group[]> {
        return this.groupsService.findAll();
    }

    // Obtener un grupo por ID
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Group> {
        const group = await this.groupsService.findOne(id);
        if (!group) {
            throw new NotFoundException('Grupo no encontrado');
        }
        return group;
    }

    // Actualizar un grupo por ID
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() body: { name: string; members: string[] },
    ): Promise<Group> {
        const group = await this.groupsService.update(id, body.name, body.members);
        if (!group) {
            throw new NotFoundException('Grupo no encontrado para actualizar');
        }
        return group;
    }

    // Eliminar un grupo por ID
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Group> {
        const group = await this.groupsService.remove(id);
        if (!group) {
            throw new NotFoundException('Grupo no encontrado para eliminar');
        }
        return group;
    }
}
