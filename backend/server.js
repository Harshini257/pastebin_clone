const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

console.log("MONGO_URI =", process.env.MONGO_URI);

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const pasteRoutes = require("./routes/pasteRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/pastes", pasteRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    console.log("Connection State:", mongoose.connection.readyState);
  })
  .catch((err) => {
    console.error("❌ Connection Error:");
    console.error(err);
  });

app.get("/", (req, res) => {
  res.send("PasteBin API is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "PasteBin API is healthy",
    timestamp: new Date(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});