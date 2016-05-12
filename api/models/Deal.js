import mongoose from 'mongoose';
// import User from './User';
mongoose.set('debug', true);

const Schema = mongoose.Schema;

const Deal = new Schema({

  id: Number,
  bids: [{
    bidder: {type: Schema.Types.ObjectId, ref: 'User'},
    amount: Number,
  }]

}, {timestamps: true});

export default mongoose.model('Deal', Deal);
