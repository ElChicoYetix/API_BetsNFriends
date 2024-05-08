"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BetMessageSchema = new mongoose_1.default.Schema({
    chatId: String,
    user: String,
    message: String,
    timestamp: Date,
});
const BetMessage = mongoose_1.default.model('BetMessage', BetMessageSchema);
exports.default = BetMessage;
