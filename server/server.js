const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/api");

const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/aegisguard";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const app = express();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({
    name: "AegisGuard",
    role: "Anti-bot middleware gateway",
    endpoints: ["/api/health", "/api/session/start", "/api/analyze"],
  });
});

async function start() {
  let mongoStatus = "disconnected";

  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2500 });
    mongoStatus = "connected";
    console.log(`MongoDB connected: ${MONGODB_URI}`);
  } catch (error) {
    console.warn(
      "MongoDB unavailable. Analysis will still run; sessions will not persist."
    );
    console.warn(error.message);
  }

  app.listen(PORT, () => {
    console.log(`AegisGuard middleware listening on http://localhost:${PORT}`);
    console.log(`MongoDB status: ${mongoStatus}`);
  });
}

start();
