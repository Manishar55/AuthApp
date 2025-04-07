
const express = require("express");
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 4000;

app.use(express.json());

//import route and mount
const user = require("./routes/user");
app.use("api/v1", user);

//activate server
app.listen(PORT, ()=>{
    console.log(`App is listening at ${PORT}`); 
})

//connect to the database
const dbConnect = require("./config/database");
dbConnect();


//default Route
app.get("/", (req, res)=>{
    res.send(`<h1>This is homepage </h1>`);
});
