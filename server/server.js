import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import express from "express";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "IMovies backend is running!",
    success: true,
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "IMovies API is healthy!",
    database: "connected",
  });
});

app.use("/api/auth", authRoutes);


const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`IMovies backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
