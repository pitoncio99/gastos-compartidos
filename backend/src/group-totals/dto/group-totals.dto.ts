import { IsString, IsObject, IsArray } from 'class-validator';

export class GroupTotalsDto {
  @IsString()
  readonly groupId: string;

  @IsObject()
  readonly deudas: Record<string, number>;

  @IsArray()
  readonly productos: Array<{
    nombre: string;
    precio: number;
    consumidores: string[];
  }>;
}
