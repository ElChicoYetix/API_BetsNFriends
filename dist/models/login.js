"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/login.ts
const mongoose_1 = __importDefault(require("mongoose"));
// Create Schema
const Loginschema = new mongoose_1.default.Schema({
    name: {
        type: String,
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
const collection = mongoose_1.default.model("users", Loginschema);
exports.default = collection;
