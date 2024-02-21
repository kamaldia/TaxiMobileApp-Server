import {Schema, model} from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
import User from './user.js';
import Driver from './driver.js';

const OrderSchema = new Schema({
  location: { //object of objects resembling google map input
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
  destination: { //object of objects resembling google map input
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
  type: {
    type: String,
    enum: ['ride', 'delivery'],
    default: 'ride',
  },
  payment_type: {
    type: String,
    enum: ['cash', 'wish', 'card'],
    default: 'cash',
  },
  status: {
    type: String,
    enum: ['canceled', 'pending', 'accepted', 'pickedup', 'extended', 'fulfilled'],
    default: 'pending',
  },
  price: {
    type: Number,
  },
  dateAndTime: {
    type: Date,
    required: false
},
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: 'vehicle',
    required: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    autopopulate: true,
  },
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'driver',
    autopopulate: true,
  },
}, {timestamps: true});

OrderSchema.plugin(autopopulate);

OrderSchema.pre('deleteOne', { query: true }, async function(next) { //we assign the type of operation as remove, we assign document:true for individual operations like remove, save, or validate, if it was update, or find or deletemany we would assigned {query: true} instead
  const order_id = this._conditions._id;
  try {
    const order = await Order.findById(order_id);
    await User.findByIdAndUpdate(order.user, {$pull: {orders: order._id}}); //$pull is an update operator in mongodb, we use it instead of filtering the array
    await Driver.findByIdAndUpdate(order.driver, {$pull: {orders: order._id}});
    next();
  } catch (error) {
    console.error('error in order model pre removal hook:',error);
  }
});

OrderSchema.pre('save', { document: true }, async function(next) { //use findbyidandupdate in controller for updates to not trigger this hook on updates
  const order = this;
  try {
    await User.findByIdAndUpdate(order.user, {$push: {orders: order._id}}); //$push is an update operator in mongodb
    await Driver.findByIdAndUpdate(order.driver, {$push: {orders: order._id}});
    next();
  } catch (error) {
    console.error('error in order model pre save hook:',error);
  }
});

const Order = model('order', OrderSchema);

export default Order;