import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Driver from '../Models/driver.js';
import Vehicle from '../Models/vehicle.js';

export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getDriverById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Driver not found!' });
    }

    const driver = await Driver.findById(id);

    if (!driver) {
      return res.status(404).json({ error: 'Couldnt get driver!' });
    }

    res.status(200).json({ driver });

  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const register = async (req, res) => {
  const { username, password, confirmed_password } = req.body;

  try {
    const password_requirements = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    if (!password_requirements.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one letter and one number, and be at least 8 characters long' });
    }

    if (password !== confirmed_password ) {
      return res.status(400).json({ message: 'Passwords do not match!' });
    }

    const hashed_password  = await bcrypt.hash(password, 12);
    const existingDriver = await Driver.findOne({ username });
    
    if (existingDriver) {
      return res.status(400).json({ message: 'Username already in use!' });
    }

    if (existingDriver?.email) {
      return res.status(400).json({ message: 'Email already in use!' });
    }

    if (existingDriver?.phone) {
      return res.status(400).json({ message: 'Phone already in use!' });
    }
    
    const new_driver = new Driver({ ...req.body, password: hashed_password });

    // console.log("this is files in driver register:", req.files);

    if (req.files.image[0]) {
      new_driver.image = req.files.image[0].path;
    } else {
      return res.status(400).json({ message: 'Driver image is required!' });
    }

    if (req.files.legals.length === 4) {
      new_driver.legals = req.files.legals.map((legal) => legal.path);
    } else {
      return res.status(400).json({ message: 'Driver legals are required!' });
    }

    const driver = await new_driver.save({ runValidators: true });

    res.status(201).json({ message: 'Driver created successfully!', driver });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

export const login = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const secret_key = process.env.DRIVER_JWT_SECRET;

    if (!secret_key) {
      throw new Error('Driver JWT secret key not configured.');
    }
    const driver = await Driver.findOne({ $or: [{username}, {email}] }); //$or is to find object where one of the properties in array matches ones in DB

    if (!driver || !(await bcrypt.compare(password, driver.password))) {
      return res.status(401).json({ error: 'Invalid username, email or password!' });
    }

    const token = jwt.sign({ driver_id: driver._id }, secret_key, { expiresIn: '90d' });
    
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.RUNNING_ON !== 'localhost', //it will work on http when on localhost, otherwise it only works on https for security
      sameSite: 'strict', //strictly on same site to avoid fraud for drivers
      maxAge: 90 * 24 * 60 * 60 * 1000, //90 days expiry
    });

    res.status(200).json({ message: 'Logged in Successfully!'});

  } catch (error) {
    console.error(error);
    res.status(500).json(error.message)
  }
};

export const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    let updated_driver = {...req.body}

    const driver_to_update = await Driver.findById(id);

    if (!driver_to_update) {
      return res.status(404).json({ error: 'driver not found!' });
    }

    if (updated_driver.password) {
      const password_requirements = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
      if (!password_requirements.test(updated_driver.password)) {
        return res.status(400).json({ message: 'Password must contain at least one letter and one number, and be at least 8 characters long' });
      }
      if (!await bcrypt.compare(updated_driver.old_password, driver_to_update.password)) {
        return res.status(400).json({ error: 'wrong password!' })
      }
      const hashed_password  = await bcrypt.hash(updated_driver.password, 12);
      updated_driver.password = hashed_password;
    }

    if (req.files.image[0]) {
      updated_driver.image = req.files.image[0].path;
    }

    if (req.files.legals.length === 4) { //length == 4 since the array has to be edited together to keep the order
      updated_driver.legals = req.files.legals.map((legal) => legal.path);
    } else {
      return res.status(400).json({ message: 'Driver legals has to be rhe full 4 documents!' });
    }

    if (updated_driver.active_vehicle) {
      const {active_vehicle} = updated_driver;
      let active_vehicle_exists = await Vehicle.findById(active_vehicle);
      if (!active_vehicle_exists) { //if there is not car with provided id
        return res.status(404).json({error: `active_vehicle with id ${active_vehicle} not found`})
      } else if (active_vehicle_exists.driver !== updated_driver._id) { //if existing car is not for the driver
        return res.status(404).json({error: `active_vehicle with id ${active_vehicle} is for another owner`})
      }
    }

    const driver = await Driver.findOneAndUpdate({ _id: id }, updated_driver, { runValidators: true });

    if (!driver) {
      return res.status(404).json({ error: 'Driver not updated!' });
    }

    res.status(200).json({ message: 'Driver was updated successfully!', driver });

  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Driver not found!' });
    }

    const driver = await Driver.deleteOne({_id: id});

    if (driver.deletedCount === 0) {
      return res.status(404).json({ error: 'Driver not found!' });
    }

    res.status(200).json({ message: 'Driver was deleted successfully!' });
  } catch (error) {
    res.status(500).json(error.message);
  }
};