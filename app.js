import express from "express";
import userRoutes from "./routes/userRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";

const app = express();

app.use(express.json({ limit: "10kb" }));

//Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/Service", serviceRoutes);
app.use("/api/v1/vehicle", vehicleRoutes);

export default app;
