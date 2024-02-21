import {Schema, model} from 'mongoose';
import Driver from './driver.js';

const OnlineDriverSchema = new Schema({
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'driver',
    autopopulate: true,
  },
  expectancy: {
    type: String,
    enum: ['deliver', 'ride', 'both'],
  },
}, {timestamps: true});

OnlineDriverSchema.pre('deleteOne', { query: true }, async function(next) { //we assign the type of operation as remove, we assign document:true for individual operations like remove, save, or validate, if it was update, or find or deletemany we would assigned {query: true} instead
  const online_driver_id = this._conditions._id;
  try {
    const online_driver = await OnlineDriver.findById(online_driver_id);
    await Driver.findByIdAndUpdate(online_driver.driver, {online: false});
    next();
  } catch (error) {
    console.error('error in online-driver model pre removal hook:',error);
  }
});

OnlineDriverSchema.pre('save', { document: true }, async function(next) { //we assign the type of operation as savve, we assign document:true for individual operations like remove, save, or validate, if it was update, or find or deletemany we would assigned {query: true} instead
  const online_driver = this;
  console.log("this is online driver in model pre save hook", online_driver);
  try {
    await Driver.findByIdAndUpdate(online_driver.driver, {online: true});
    next();
  } catch (error) {
    console.error('error in online-driver model pre save hook:',error);
  }
});

const OnlineDriver = model('online-driver', OnlineDriverSchema);

export default OnlineDriver;