import {Schema, model} from 'mongoose';

const AdminSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: email_address => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_address),
      message: 'Email address must be in valid format(example@example.com)'
    }
  },
  password: {
    type: String,
  },
});

export default model('admin', AdminSchema);