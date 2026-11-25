import "dotenv/config";
import express from "express";
import connectDB from "./config/connection.js";

const app = express();
const PORT = process.env.PORT || 3000;
// lets server read JSON sent in request. Needed for POST and PUT
app.use(express.json());

// test route to see if server is working in browser
app.get("/", (req, res) => {
  res.json({ message: "Zenith Product API is running" });
});

const startServer = async () => {
  await connectDB(); // waits until MongoBD is connected

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
