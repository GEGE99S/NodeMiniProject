const express = require("express");
const path = require("path");
const app = express();

app.listen(8081, () => {
  console.log("listening on 8081");
});

app.use(express.static(path.join(__dirname, "../react-client/build")));
app.get("/first-service", (req, res) => {
  res.sendFile(path.join(__dirname, "../react-client/build/index.html"));
});

// var cors = require(cors);
// app.use(cors());
