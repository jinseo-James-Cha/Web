const bcrypt = require('bcryptjs');
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  "userName":  {
    type: String,
    unique : true
  },
  "password": String,
  "email": String,
  "loginHistory": {
    "dataTime": Date,
    "userAgent": String
  } 
});

let User;

//var pass = encodeURIComponent("Wlstjck2!"); // this step is needed if there are special characters in your password, ie "$"
//var db = mongoose.createConnection(`mongodb://dbUser:${pass}@senecaweb.03yn7.mongodb.net/web322_week8?retryWrites=true&w=majority`);
    

//line3
//User = db.model("users", userSchema);
//resolve();


module.exports.initialize = function() {
    return new Promise(function (resolve, reject) {
        
        var pass = encodeURIComponent("Wlstjck2!"); // this step is needed if there are special characters in your password, ie "$"

        var url = "mongodb+srv://dbUser:Wlstjck2!@senecaweb.03yn7.mongodb.net/web322_week8?retryWrites=true&w=majority";
        

        //mongoose.connect(`mongodb+srv://dbUser:${pass}@senecaweb.03yn7.mongodb.net/web322_week8?retryWrites=true&w=majority`, {useNewUrlParser : true, useUnifiedTopology: true});
        //mongoose.set('useCreateIndex', true);    
            //above line is error//
            //console.log("JAMES");

            mongoose.connect(`mongodb+srv://dbUser:${pass}@senecaweb.03yn7.mongodb.net/web322_week8?retryWrites=true&w=majority`, {useNewUrlParser : true, useUnifiedTopology: true}, function(error){
            //mongoose.set('useCreateIndex', true);
                if(error) reject(error);
                else {
                    console.log("connection successful");
    
                    var db = mongoose.createConnection(`mongodb+srv://dbUser:${pass}@senecaweb.03yn7.mongodb.net/web322_week8?retryWrites=true&w=majority`,{useNewUrlParser : true, useUnifiedTopology: true});
                    
                    db.on('error', (err)=>{
                        
                        reject(err);
                    });
                      
                    db.once('open', ()=>{
                        
                        User = db.model("users", userSchema);
                        resolve();
                    });
                }
                            
            });
            
        
    });
}



module.exports.registerUser = function(userData){
    return new Promise(function (resolve, reject) {
        
        
        if(!userData.userName || userData.userName.trim().length ==0
           || !userData.password || userData.password.trim().length == 0
           || !userData.password2 || userData.password2.trim().length ==0){
               reject("Error:user name or password cannot be empty of only white spaces! ");
        }
        else if(userData.password != userData.password2){
            reject("Error: Passwords do not match");
        }
        else{
            
            bcrypt.genSalt(10, function(err, salt) { 
                console.log("James1");
                bcrypt.hash(userData.password, salt, function(err, hashValue) {
                    console.log("James2");
                    if(err) {
                        reject("There was an error encrypting the password");
                    }
                    else{
                        userData.password = hashValue;
                    }
                });
                if(err) {
                    reject("There was an error encrypting the password");
                }
           });

            let newUser = new User(userData);
            newUser.save((err) =>{
                if(err && err.code == 11000){
                    reject("User Name already taken");
                }
                else if(err && err.code != 11000){
                    reject("There was an error creating the user: " + err);
                }
                else{
                    resolve();
                }
                
            });
            process.exit();
        }
    });
}

module.exports.checkUser = function(userData){
    return new Promise(function (resolve, reject) {
        
        var comparedPasswords;

        User.findOne({ userName: userData.userName})
        .exec()
        .then((foundUser) => {

            bcrypt.compare(userData.password, foundUser.password).then((res) => {
                // res === true if it matches and res === false if it does not match
                comparedPasswords = res;
            });

            if(!foundUser){
                reject("Unable to find user: " + userData.userName);
                //process.exit();
            }
            else if(!comparedPasswords){
                reject("Unable to find user: " + userData.userName);
            }
            else{
                foundUser.loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
        
                User.updateOne(
                    { userName: foundUser.userName},
                    { $set: { loginHistory: foundUser.loginHistory } }
                )
                .exec()
                .then(()=>{
                    resolve(foundUser);
                }).catch((err)=>{
                    reject("There was an error verifying the user: " + err);
                });
            }
        }).catch((err)=>{
            reject("Unable to find user: " + userData.userName);
        });
    });
}