import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
// import User from './User';
mongoose.set('debug', true);

const Schema = mongoose.Schema;

const User = new Schema({

  username: String,
  company: String,
  email: String,
  phone: String,
  timeEnd: Number,
  bids: [{type: Schema.Types.ObjectId, ref: 'Bid'}]

}, {timestamps: true});

User.plugin(passportLocalMongoose, {
  usernameField: 'username',
  selectFields: 'username company email phone timeEnd',
  errorMessages: {
    IncorrectUsernameError: 'The username you entered is incorrect. Try again.',
    IncorrectPasswordError: 'Incorrect password. Try again.',
    UserExistsError: 'This username is taken'
  }
});

export default mongoose.model('User', User);
