import mongoose from "mongoose";

const serviceSchema = mongoose.Schema({
  serviceName: {
    type: String,
    required: [true, "Services must have name!"],
    unique: true,
  },
  serviceDescription: {
    type: String,
    required: [true, "Services must have description!"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  serviceStatus: {
    type: Boolean,
    default: true,
  },
});

serviceSchema.pre(/^find/, function (next) {
  this.find({ serviceStatus: { $ne: false } });
  next();
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;
