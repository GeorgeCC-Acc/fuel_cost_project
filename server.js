require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;

// Allow CORS so front-end can fetch
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Endpoint to serve the API key
app.get("/maps-key", (req, res) => {
  res.json({ key: process.env.GOOGLE_MAPS_KEY });
});

// Serve static files (HTML, CSS, JS)
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
