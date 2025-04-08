
// //instance of mongoose
// const mongoose =  require("mongoose");

// require("dotenv").config();

// const dbConnect = ()=>{
//     mongoose.connect(process.env.DATABASE_URL)
//     .then(()=>console.log('DB connecton successful'))
//     .catch((error)=>{
//         console.log('Issue in DB connection');
//         console.log(error.message);
//         process.exit(1);
//     });
// }

// module.exports=dbConnect;



//instance of mongoose
const mongoose = require("mongoose");


//env file ka configuration process object me load kar dega
require("dotenv").config();


//it will establish a connection between your app & database
const dbConnect = ()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>console.log('DB connecton successful'))
    .catch((error)=>{
        console.log('Issue in DB connection');
        console.log(error.message);
        process.exit(1);
    });
}

module.exports=dbConnect;