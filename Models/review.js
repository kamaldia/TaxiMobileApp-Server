import {Schema, model} from 'mongoose';
import User from './user.js';
import Driver from './driver.js';

const ReviewSchema = new Schema({
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  text: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    autopopulate: true,
  },
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'driver',
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'order',
  },
}, {timestamps: true});

ReviewSchema.pre('deleteOne', { query: true }, async function(next) { //we assign the type of operation as remove, we assign document:true for individual operations like remove, save, or validate, if it was update, or find or deletemany we would assigned {query: true} instead
  const review_id = this._conditions._id; //since this is a query object
  try {
    const review = await Review.findById(review_id);
    await User.findByIdAndUpdate(review.user, {$pull: {reviews: review._id}}); //$pull is an update operator in mongodb, we use it instead of filtering the array
    await Driver.findByIdAndUpdate(review.driver, {$pull: {reviews: review._id}});
    next();
  } catch (error) {
    console.error('error in review model pre removal hook:',error);
  }
});

ReviewSchema.pre('save', { document: true }, async function(next) { //use findbyidandupdate in controller for updates to not trigger this hook on updates
  const review = this;
  try {
    await User.findByIdAndUpdate(review.user, {$push: {reviews: review._id}}); //$push is an update operator in mongodb
    await Driver.findByIdAndUpdate(review.driver, {$push: {reviews: review._id}});
    next();
  } catch (error) {
    console.error('error in review model pre save hook:',error);
  }
});

const Review = model('review', ReviewSchema);

export default Review;