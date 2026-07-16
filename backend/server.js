const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());
app.use("/api/auth",
require("./routes/auth"));


app.use("/api/doctors",
require("./routes/doctors"));


app.use("/api/appointments",
require("./routes/appointments"));


app.use("/api/patient",
require("./routes/patient"));


app.get("/", (req, res) => {

    res.send("Smart Hospital Backend Running");

});


app.use("/api/auth",
require("./routes/auth"));


app.use("/api/doctors",
require("./routes/doctors"));


app.use("/api/appointments",
require("./routes/appointments"));



const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});