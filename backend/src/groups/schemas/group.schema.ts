import { Schema, Document } from 'mongoose';

export const GroupSchema = new Schema({
  name: { type: String, required: true },
  members: { type: [String], required: true },  // Lista de nombres de las personas
});

export interface Group extends Document {
  id: string;
  name: string;
  members: string[];
}
