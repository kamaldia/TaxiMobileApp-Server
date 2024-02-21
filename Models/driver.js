import {Schema, model} from 'mongoose';
import Vehicle from './vehicle.js';
import Order from './order.js';
import Review from './review.js';

const DriverSchema = new Schema({
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
    required: true,
  },
  legals: [{
    type: String,
    required: true,
  }],
  verified: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ['banned', 'standard', 'premium', 'moderator'],
    default: 'standard',
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  online: {
    type: Boolean,
    default: false,
  },
  active_vehicle: {
    type: Schema.Types.ObjectId,
    ref: 'vehicle',
    // autopopulate: true,
  },
  vehicles: [{
    type: Schema.Types.ObjectId,
    ref: 'vehicle',
  }],
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'order',
  }],
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'review',
    // autopopulate: true,
  }],
}, {timestamps: true});

DriverSchema.pre('deleteOne', { query: true }, async function(next) { //we assign the type of operation as remove, we assign document:true for individual operations like remove, save, or validate, if it was update, or find or deletemany we would assigned {query: true} instead
  const driver_id = this._conditions._id; //best practice is to reference the current driver document for clarity, we could have used the word this instead
  try {
    const driver = await Driver.findById(driver_id);
    console.log("this is driver in driver model pre hook", driver);
    await Promise.all(driver.reviews.map(async review_id => { //we use Promise.all() to await deletion of all associated reviews
      await Review.findByIdAndDelete(review_id);
    }));
    await Promise.all(driver.orders.map(async order_id => {
      await Order.findByIdAndDelete(order_id);
    }));
    await Promise.all(driver.vehicles.map(async vehicle_id => {
      await Vehicle.findByIdAndDelete(vehicle_id);
    }));
    next();
  } catch (error) {
    console.error('error in driver schema pre remove hook: ',error);
  }
});

const Driver = model('driver', DriverSchema);

export default Driver;