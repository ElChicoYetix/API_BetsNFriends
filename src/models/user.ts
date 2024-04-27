
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    googleId: string;
    usuario: string;
    email: string;
    role: string;
}

const userSchema = new Schema({
    googleId: {
        type: String,
        required: true,
        unique: true,
    },
    usuario: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    role: { type: String,
        default: 'user' }
});

const User = mongoose.model<IUser>('User', userSchema);

// Exporta el modelo para que pueda ser importado
export default User;


