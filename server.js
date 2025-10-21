require("dotenv").config(); // load .env variables
const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/maps-key", (req, res) => {
  res.json({ key: process.env.GOOGLE_MAPS_KEY });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
