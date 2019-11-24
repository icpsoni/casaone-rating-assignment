const app = require('./src/app');
const mongoose = require('mongoose');
//Port for Server
let port = process.env.PORT || 3000;

// Connecting to MongoDB Database
mongoose.connect(process.env.MONGODB_URI, {useUnifiedTopology: true, useNewUrlParser: true}).then(() => {
  console.log(":::: MongoDB Connected");
},(err)=>{
  console.log("Mongo Error", err);
});

app.listen(port, () => {
  console.log(":::: Backend APIs are up and running on PORT = ", port);
});
