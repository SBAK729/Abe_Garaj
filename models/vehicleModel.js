import mongoose from "mongoose";
import validator from "validator";

const vehicleSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Vehicle must belong to a user."],
  },
  vehicle_year: {
    type: Number,
    required: [true, "You have to provide the manufacturing year for vehicle."],
  },
  vehicle_make: {
    type: String,
    required: [
      true,
      "please provide your vehicle make,like Toyota, Ford, or Honda.",
    ],
  },
  vehicle_model: {
    type: String,
    required: [
      true,
      "please provide your vehicle model,like Corolla, Civic, or F-150.",
    ],
  },
  vehicle_type: {
    type: String,
    required: [
      true,
      "please provide your vehicle type,like sedan, SUV, truck, or motorcycle.",
    ],
  },
  vehicle_mileage: Number,
  vehicle_tag: {
    type: String,
    required: [true, "Your vehicle  must have Tag!!!"],
    validate: {
      validator: function (v) {
        return /^(\d{4}[A-Z]{1,3}|[A-Z]{2,4}\d{3,4}|\d{3}CD\d{1,2})$/.test(
          v.toString()
        );
      },
      message: (props) => `${props.value} is not a valid licence plate number!`,
    },
  },
  vehicle_color: String,
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
