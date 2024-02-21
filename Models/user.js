import {Schema, model} from 'mongoose';
import Order from './order.js';
import Review from './review.js';

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: email_address => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_address),
      message: 'Email address must be in valid format(example@example.com)'
    }
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: phone_number => /^\d{8}$/.test(phone_number),
      message: 'Phone number must be exactly 8 digits'
    }
  },
  password: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  default_location: { //object of objects resembling google map input
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], //we have to enter [longitude, latitude] as array of numbers
      required: true,
    }
  },
  verified: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ['standard', 'premium'],
    default: 'standard',
  },
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'order',
    // autopopulate: true,
  }],
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'review',
    // autopopulate: true,
  }],
}, {timestamps: true});

UserSchema.pre('deleteOne', { query: true }, async function(next) { //we assign the type of operation as remove, we assign document:true for individual operations like remove, save, or validate, if it was update, or find or deletemany we would assigned {query: true} instead
  const user_id = this._conditions._id; //best practice is to reference the current user query for clarity, we could have used the word this instead
  try {
    const user = await User.findById(user_id);
    await Promise.all(user.reviews.map(async review_id => { //we use Promise.all() to await deletion of all associated reviews
      await Review.findByIdAndDelete(review_id);
    }));
    await Promise.all(user.orders.map(async order_id => {
      await Order.findByIdAndDelete(order_id);
    }));
    next();
  } catch (error) {
    console.error('error in user schema pre remove hook: ',error);
  }
});

const User = model('user', UserSchema);

export default User;