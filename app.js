import express from "express";
import AppError from "./utils/appError.js";
import { errorHandler } from "./controllers/errorControlers.js";

import userRoutes from "./routes/userRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

app.use(express.json({ limit: "10kb" }));

//Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/Service", serviceRoutes);
app.use("/api/v1/vehicle", vehicleRoutes);
app.use("/api/v1/order", orderRoutes);

app.use("*", (req, res, next) => {
  //   const err = new Error(`Can't find ${req.originalUrl} on this server!!`);
  //   err.statusCode = err.statusCode || 500;
  //   err.status = err.status || "fail";

  next(new AppError(`Can't find ${req.originalUrl} on this server!!`, 404));
});

app.use(errorHandler);

export default app;
