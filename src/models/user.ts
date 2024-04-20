
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    googleId: string;
    displayName: string;
    email: string;
    // Otros campos si es necesario
}

const userSchema = new Schema({
    googleId: {
        type: String,
        required: true,
        unique: true,
    },
    displayName: {
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


