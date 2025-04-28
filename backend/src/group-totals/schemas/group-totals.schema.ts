import { Schema } from 'mongoose';

export const GroupTotalsSchema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  nombre: { type : String, required: true},
  deudas: { type: Object, required: true }, // Aquí seguimos utilizando Object para los totales
  productos: { type: Object, required: true }, // Aquí seguimos utilizando Object para los totales
  createdAt: { type: Date, default: Date.now },
});
