import "dotenv/config";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;
// lets server read JSON sent in request. Needed for POST and PUT
app.use(express.json());

// test route to see if server is working in browser
app.get("/", (req, res) => {
  res.json({ message: "Zenith Product API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
