// models/User.ts
/* 
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  nombre: string;
  usuario: string;
  correo: string;
  contraseña: string;
}

const userSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  usuario: { type: String, required: true },
  correo: { type: String, required: true },
  contraseña: { type: String, required: true }
});

export default mongoose.model<IUser>('User', userSchema);
*/

const { model, Schema, SchemaTypes } = require('mongoose');

const userSchema = new Schema({
    name: { type: SchemaTypes.String, required: true },
    email: { type: SchemaTypes.String, required: true, unique: true },
    password: { type: SchemaTypes.String, required: true },
    role: { type: SchemaTypes.String, default: 'user' }
});

export default model('User', userSchema);