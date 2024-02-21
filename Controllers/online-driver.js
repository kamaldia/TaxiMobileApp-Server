import OnlineDriver from "../Models/online-driver.js";
import Driver from "../Models/driver.js";

//create online_driver
export const addOnlineDriver = async(req, res) => {
  try {
    const { driver } = req.body;
    const driver_exists = await Driver.findById(driver);

    if (!driver_exists) {
      return res.status(404).json({error: `driver with id ${driver} not found`})
    } else {
      const driver_already_online = await OnlineDriver.findOne({driver: driver_exists._id});
      if (driver_already_online) {
        return res.status(400).json({error: `driver with id ${driver} already online`});
      }
    }

    const online_driver = await OnlineDriver.create(req.body, { runValidators: true });

    res.status(200).json(online_driver);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

// get all online_drivers
export const getAllOnlineDrivers = async (req, res) => {
  try {
    const online_drivers = await OnlineDriver.find();
    res.status(200).json(online_drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get delivering online_drivers
export const getDeliveryOnlineDrivers = async (req, res) => {
  try {
    const online_drivers = await OnlineDriver.find({expectancy: 'deliver'});
    res.status(200).json(online_drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get online_drivers for rides
export const getRideOnlineDrivers = async (req, res) => {
  try {
    const online_drivers = await OnlineDriver.find({expectancy: 'ride'});
    res.status(200).json(online_drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get online_driver by id
export const getOnlineDriverById = async (req, res) => {
  try {
    const online_driver = await OnlineDriver.findById(req.params.id);
    if (!online_driver) {
      return res.status(404).json({ message: 'Online_driver not found' });
    }
    res.status(200).json(online_driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update online_driver
export const updateOnlineDriverById = async (req, res) => {
  try {
    const { expectancy } = req.body;
    const online_driver = await OnlineDriver.findByIdAndUpdate(
      req.params.id,
      {expectancy}
    );

    if (!online_driver) {
      return res.status(404).json({ message: 'Online_driver not found' });
    }

    res.status(200).json(online_driver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete online_driver
export const deleteOnlineDriverById = async (req, res) => {
  try {
    const online_driver = await OnlineDriver.deleteOne({_id: req.params.id})

    if (online_driver.deletedCount === 0) {
      return res.status(404).json({ message: 'Online_driver not found' });
    }

    res.status(200).json({ message: 'Online_driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};