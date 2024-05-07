// src/models/login.ts
import mongoose from 'mongoose';

// Create Schema
const Loginschema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: { type: String, 
        default: 'user'
    }
});

// Collection part
const collection = mongoose.model("users", Loginschema);

export default collection;
