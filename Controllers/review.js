import Review from "../Models/review.js";
import User from "../Models/user.js";
import Driver from "../Models/driver.js";
import Order from "../Models/order.js";

//create Review
export const createReview = async (req, res) => {
  const { order, user, driver } = req.body;
  try {
    const order_exists = await Order.findById(order);
    const user_exists = await User.findById(user);
    const driver_exists = await Driver.findById(driver);

    if (!order_exists) {
      console.log(`Order not found of id: ${order}`);
      return res.status(404).json({ error: "Order not found" });
    }

    if (!user_exists) {
      console.log(`User not found of id: ${user}`);
      return res.status(404).json({ error: "User not found" });
    }

    if (!driver_exists) {
      console.log(`Driver not found of id: ${driver}`);
      return res.status(404).json({ error: "Driver not found" });
    }

    const review = await Review.create(req.body, { runValidators: true });

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get all review
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get review by id
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update review
export const updateReview = async (req, res) => {
  const { id } = req.params;

  try {
    const Review = await Review.findOneAndUpdate(
      { _id: id },
      req.body,
      { runValidators: true }
      );

    if (!Review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json(Review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// delete a reviewded review
export const deleteReviewById = async (req, res) => {
  try {
    const review = await Review.deleteOne({_id: req.params.id})

    if (review.deletedCount === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
