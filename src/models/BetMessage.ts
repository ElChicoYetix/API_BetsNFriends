import mongoose from 'mongoose';

const BetMessageSchema = new mongoose.Schema({
  chatId: String,
  user: String,
  message: String,
  timestamp: Date,
});

const BetMessage = mongoose.model('BetMessage', BetMessageSchema);

export default BetMessage;
