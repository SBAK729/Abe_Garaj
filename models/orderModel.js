import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  employee: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "The order must be assigned to Employee to work with."],
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Specify the owner of the vehicle."],
  },
  vehicle: {
    type: mongoose.Schema.ObjectId,
    ref: "Vehicle",
    required: [true, "Specify the vehicle that need the service."],
    unique: true,
  },
  description: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  estimated_completion_date: {
    type: Date,
    default: Date.now() + 24 * 60 * 60 * 1000,
  },
  completed_at: Date,
  order_status: {
    type: String,
    enum: ["pending", "onProgress", "completed"],
    default: "pending",
  },
  order_services: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Service",
      required: [true, "Specify the service needed to be provided!!"],
    },
  ],
});

orderSchema.pre(/^find/, function (next) {
  this.populate("employee", "-_id first_name last_name phone_number")
    .populate("customer", "-_id first_name last_name phone_number")
    .populate("vehicle", "-_id vehicle_make vehicle_model vehicle_type")
    .populate({
      path: "order_services",
      select: "serviceName serviceDescription",
    });

  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
