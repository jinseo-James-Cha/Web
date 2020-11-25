var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema({
  "userName":  {
    type: String,
    unique : true
  },
  "password": String,
  "email": String,
  "employeeCount": {
    "dataTime": Date,
    "userAgent": String
  } 
});

let User;

//var Company = mongoose.model("web322_companies", companySchema);