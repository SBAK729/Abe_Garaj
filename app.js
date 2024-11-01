import express from "express";
import userRoutes from "./routes/userRoutes.js";
import ServiceRoutes from "./routes/ServiceRoutes.js";

const app = express();

app.use(express.json({ limit: "10kb" }));

//Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/Service", ServiceRoutes);

export default app;
