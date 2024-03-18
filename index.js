require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connect_DB = require("./db/db");

const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const evRoute = require("./routes/event");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api", postRoute);
app.use("/api/ev", evRoute);



app.listen(3000 ,async () => {
  await connect_DB();
  console.log("Server running on port 3000");
});
