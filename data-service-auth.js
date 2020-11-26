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

        var uri = "mongodb://dbUser:Wlstjck2!@senecaweb.03yn7.mongodb.net/web322_week8?retryWrites=true&w=majority";
        
        mongoose.connect(uri, {useNewUrlParser : true, useUnifiedTopology: true}, function(error){
            
            //above line is error//
            console.log("JAMES");
            if(error) reject(error);
            else {
                console.log("connection successful");

                var db = mongoose.createConnection(`mongodb://dbUser:${pass}@senecaweb.03yn7.mongodb.net/web322_week8?retryWrites=true&w=majority`);
                
                db.on('error', (err)=>{
                    reject(err);
                });
                  
                db.once('open', ()=>{
                    User = db.model("users", userSchema);
                    resolve();
                });

            }
        }).catch(function (error) {
            reject(error);
        });
    });
}



module.exports.registerUser = function(userData){
    return new Promise(function (resolve, reject) {
        
        if(!userData.userName || userData.userName.trim ===''
           || !userData.password || userData.password.trim ===''
           || !userData.password2 || userData.password2.trim ===''){
               reject("Error:user name or password cannot be empty of only white spaces! ");
        }
        else if(userData.password != userData.password2){
            reject("Error: Passwords do not match");
        }
        else{
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
        
        User.findOne({ userName: userData.userName})
        .exec()
        .then((foundUser) => {
            if(!foundUser){
                reject("Unable to find user: " + userData.userName);
                //process.exit();
            }
            else if(foundUser.password != userData.password){
                reject("Incorrect Password for user: " + userData.userName);
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