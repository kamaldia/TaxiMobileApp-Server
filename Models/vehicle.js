import {Schema, model} from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
import Driver from './driver.js';

const VehicleSchema = new Schema({
  plate: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: number => /^[A-Za-z]?[0-9]+$/.test(number),
      message: 'Plate number can start with a letter but followed by numbers'
    }
  },
  color: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['7-seater', 'car', 'motorcycle'],
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
  year: {
    type: String,
    required: true,
    validate: {
      validator: value => value >= 1990 && value <= new Date().getFullYear(),
      message: 'Year must be between 1990 and the current year'
    }
  },
  image: {
    type: String,
    required: true,
  },
  legals: [{
    type: String,
    required: true,
  }],
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'driver',
    autopopulate: true,
  },
}, {timestamps: true});

VehicleSchema.plugin(autopopulate);

VehicleSchema.pre('deleteOne', { query: true, document: true }, async function(next) { //we assign the type of operation as remove, we assign document:true for individual operations like remove, save, or validate, if it was update, or find or deletemany we would assigned {query: true} instead
  const vehicle_id = this._conditions._id; //since this is a query object
  try {
    const vehicle = await Vehicle.findById(vehicle_id);
    await Driver.findByIdAndUpdate(vehicle.driver, {$pull: {vehicles: vehicle_id}});
    next();
  } catch (error) {
    console.error('error in vehicle model pre removal hook:',error);
  }
});

VehicleSchema.pre('save', { document: true }, async function(next) { //we assign the type of operation as save, we assign document:true for individual operations like remove, save, or validate, if it was update, or find or deletemany we would assigned {query: true} instead
  const vehicle = this;
  console.log("this is save hook in vehicle");
  try {
    await Driver.findByIdAndUpdate(vehicle.driver, {$push: {vehicles: vehicle._id}});
    next();
  } catch (error) {
    console.error('error in vehicle model pre save hook:',error);
  }
});

const Vehicle = model('vehicle', VehicleSchema);

export default Vehicle;