import Order from "../Models/order.js";
import User from "../Models/user.js";
import Driver from "../Models/driver.js";
// import Vehicle from "../Models/vehicle.js";

//create Order
export const createOrder = async (req, res) => {
  const { user, driver } = req.body;
  try {
    // const vehicle_exists = await Vehicle.findById(vehicle);
    const user_exists = await User.findById(user);
    const driver_exists = await Driver.findById(driver);

    // if (!vehicle_exists) {
    //   console.log(`Vehicle not found of id: ${vehicle}`);
    //   return res.status(404).json({ error: "Vehicle not found" });
    // }

    if (!user_exists) {
      console.log(`User not found of id: ${user}`);
      return res.status(404).json({ error: "User not found" });
    }

    if (!driver_exists) {
      console.log(`Driver not found of id: ${driver}`);
      return res.status(404).json({ error: "Driver not found" });
    }
    
    const order = await Order.create(req.body, { runValidators: true });

    res.status(201).json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get all order
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get order by id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update order
export const updateOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const Order = await Order.findOneAndUpdate(
      { _id: id },
      req.body,
      { runValidators: true }
      );

    if (!Order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(Order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// delete a orderded order
export const deleteOrderById = async (req, res) => {
  try {
    const order = await Order.deleteOne({_id: req.params.id})

    if (order.deletedCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
