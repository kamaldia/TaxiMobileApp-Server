import Vehicle from "../Models/vehicle.js";
import Driver from "../Models/driver.js";

//create Vehicle
export const postVehicle = async (req, res) => {
  const { plate, driver } = req.body;
  try {
    const vehicle_exists = await Vehicle.findOne({plate});
    const driver_exists = await Driver.findById(driver);

    if (vehicle_exists) {
      return res.status(400).json({ error: "Vehicle already exists!" });
    }

    if (!driver_exists) {
      console.log(`Driver not found of id: ${driver}`);
      return res.status(404).json({ error: "Driver not found" });
    }

    const new_vehicle = new Vehicle(req.body);

    if (req.files.image[0]) {
      new_vehicle.image = req.files.image[0].path;
    } else {
      return res.status(400).json({ message: 'Vehicle image is required!' });
    }

    if (req.files.legals.length === 2) { //length == 2 since the array has to be edited together to keep the order
      new_vehicle.legals = req.files.legals.map((legal) => legal.path);
    } else {
      return res.status(400).json({ message: 'Vehicle legals has to be rhe full 2 documents!' });
    }

    const vehicle = await new_vehicle.save({ runValidators: true });

    res.status(201).json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get all vehicles
export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get vehicle by id
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update vehicle
export const updateVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    let updated_vehicle = req.body;
    const vehicle_to_update = await Vehicle.findById(id);

    if(!vehicle_to_update) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    if (req.files.image[0]) {
      updated_vehicle.image = req.files.image[0].path;
    }

    if (req.files.legals.length === 2) { //length == 2 since the array has to be edited together to keep the order
      updated_vehicle.legals = req.files.legals.map((legal) => legal.path);
    } else {
      return res.status(400).json({ message: 'Vehicle legals has to be rhe full 2 documents!' });
    }

    if (updated_vehicle.active) { //assign vehicle to driver
      const driver_activated_vehicle = await Driver.findByIdAndUpdate(vehicle_to_update.driver, {active_vehicle: id});
      if (!driver_activated_vehicle) {
        return res.status(400).json({ message: "Couldnt assign vehicle to driver" });
      }
    }

    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: id },
      updated_vehicle,
      { runValidators: true }
      );

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not updated" });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// delete a vehicleded vehicle
export const deleteVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.deleteOne(
      {_id: req.params.id}
    );
      console.log("this is vehicle in delete controller", vehicle);
    if (vehicle.deletedCount === 0) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
