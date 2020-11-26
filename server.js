/*********************************************************************************
* BTI325 – Assignment 6
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Jinseo Cha Student ID: 063262141 Date: Nov 22th,2020
*
* Online (Heroku) Link: https://stormy-brook-59477.herokuapp.com/
*
********************************************************************************/ 
var clientSessions = require("client-sessions");
//var dataServiceAuth = require("data-service-auth.js");
var dataServiceAuth = require("./data-service-auth.js");

var path = require("path");
var express = require("express");
var multer = require("multer");
var app = express();
var dataService = require("./data-service.js");
const bodyParser = require('body-parser');

var fs = require("fs");

const exphbs = require('express-handlebars');

var HTTP_PORT = process.env.PORT || 8080;

function onhttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

///helper
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});


app.use(clientSessions({
    cookieName : "session",
    secret: "assignment6_bti325",
    duration : 2 * 60 * 1000,
    activeDuration : 1000 * 60
}));

app.engine(".hbs", exphbs({
    extname:".hbs" ,
    defaultLayout: "main",
    helpers: {
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
            '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
           }

    }
}));
app.set("view engine", ".hbs");


app.get("/", function(req, res){
    res.render("home");
    //res.sendFile(path.join(__dirname + "/views/home.html"));
});

app.get("/about", function(req, res){
    res.render("about");
    //res.sendFile(path.join(__dirname + "/views/about.html"));
});
/////////A3 new routes//////////
app.get("/employees/add", function(req, res){
    dataService.getDepartments().then((data)=>{
        if(data.length > 0 ){
            res.render("addEmployee",{departments: data});
        }
        else{
            res.render("addEmployee",{departments: []});
        }
    }).catch((err) =>{
        //res.json({message: err});
        res.render("addEmployee",{departments: []});
    });
    
    //res.sendFile(path.join(__dirname + "/views/addEmployee.html"));
});

app.get("/departments/add", function(req, res){
    res.render("addDepartment");
    //res.sendFile(path.join(__dirname + "/views/addEmployee.html"));
});

app.get("/images/add", function(req, res){
    res.render("addImage");
    //res.sendFile(path.join(__dirname + "/views/addImage.html"));
});



app.get("/employees", function(req, res){
    
    if(req.query.status){
        
        dataService.getEmployeesByStatus(req.query.status).then((data)=>{
            res.render("employees",{employees: data});
        }).catch((err)=>{
            res.status(500).send("Unable to get Employee by Status");
        });
    }
    else if(req.query.department){
        
        dataService.getEmployeesByDepartment(req.query.department).then((data)=>{
            res.render("employees",{employees: data});
        }).catch((err)=>{
            res.status(500).send("Unable to get Employee by Department");
        });
    }
    else if(req.query.manager){
        
        dataService.getEmployeesByManager(req.query.manager).then((data)=>{
            res.render("employees",{employees: data});
        }).catch((err)=>{
            res.status(500).send("Unable to get Employee by Manager");
        });
    }
    else{
        dataService.getAllEmployees().then((data)=>{
            //console.log(data + data.length + "@@@@@@@@@@@@@@@2");
            if(data.length > 0 ){
                res.render("employees",{employees: data});
            }
            else{
                res.render("employees",{ message: "no results" });
            }
        }).catch((err)=>{
            res.status(500).send("Unable to get all Employees");
        });

    }
});

/*app.get('/employee/:value', function(req, res){
    dataService.getEmployeeByNum(req.params.value).then((data)=>{
        res.render("employee", { employee: data });
    }).catch((err) =>{
        res.render("employee",{message:"no results"});
    });
});
*/
app.get("/employee/:empNum", (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    
    dataService.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
        }).catch(() => {
            viewData.employee = null; // set employee to null if there was an error
        }).then(dataService.getDepartments)
        .then((data) => {
            viewData.departments = data; // store department data in the "viewData" object as "departments"
    // loop through viewData.departments and once we have found the departmentId that matches
    // the employee's "department" value, add a "selected" property to the matching
    // viewData.departments object
        for (let i = 0; i < viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.employee.department) {
                viewData.departments[i].selected = true;
            }
        }
        }).catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
        }).then(() => {
            if (viewData.employee == null) { // if no employee - return an error
                res.status(404).send("Employee Not Found");
            } else {
                res.render("employee", { viewData: viewData }); // render the "employee" view
            }
        });
});



app.get('/department/:departmentId', function(req, res){
    dataService.getDepartmentById(req.params.departmentId).then((data)=>{
        if(!data){
            res.status(404).send("Department Not Found without data");
        }
        else{
            res.render("department", { department: data });
        }
    }).catch((err) =>{
        res.status(404).send("Department Not Found");
    });
});

/*
app.get("/managers", function(req, res){
    dataService.getManagers().then((data)=>{
        res.json(data);
    }).catch((err) =>{
        res.json({message: err});
    });
});
*/
app.get("/departments", function(req, res){
    dataService.getDepartments().then((data)=>{
        if(data.length > 0 ){
            res.render("departments",{departments: data});
        }
        else{
            res.render("departments", {message : "no results"});
        }
    }).catch((err)=>{
        res.status(500).send("Unable to get Departments");
    });
});

///multer///
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});
  
const upload = multer({ storage: storage });

///adding post route///
app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("./");
    
});

///adding get route, using fs module
app.get("/images", function(req, res){
    
    fs.readdir("./public/images/uploaded", function(err, items) {
    
    //var imagesobj = {};
    //imagesobj = items;
    //res.json({images: items});
    res.render("images",{data:items});
    });
});

//adding Post route in part3

app.post("/employees/add", (req, res)=>{
    
    const employeeData = req.body;
    
    dataService.addEmployee(employeeData).then((data)=>{
        res.redirect("./");
    }).catch((err)=>{
        res.status(500).send("Unable to add Employee");
    });
    
});

app.post("/departments/add", (req, res)=>{
    
    //const employeeData = req.body;
    
    dataService.addDepartment(req.body).then((data)=>{
        res.redirect("./");
    }).catch((err)=>{
        res.status(500).send("Unable to add Department");
    });
    
});

//update employee
app.post("/employee/update", (req, res) => {

    //console.log(req.body);

    dataService.updateEmployee(req.body).then(()=>{
        res.redirect("/employees");
    }).catch((err)=>{
        res.status(500).send("Unable to Update Employee");
    });
    
});

app.post("/department/update", (req, res) => {

    //console.log(req.body);

    dataService.updateDepartment(req.body).then(()=>{
        res.redirect("/departments");
    }).catch((err)=>{
        res.status(500).send("Unable to Update department");
    });
    
});

app.get("/employees/delete/:empNum", (req, res) => {
    
    dataService.deleteEmployeeByNum(req.params.empNum).then((data) => {
        
            res.redirect("/employees");
        }).catch(() => {
            res.status(500).send("Unable to Remove Employee /Employee Not Found");
        });   
});



app.get("*", function(req, res){
    res.status(404).send("Page Not Found");
});




/*dataService.initialize()
.then(function(){
    app.listen(HTTP_PORT, function(){
    console.log("app listening on: " + HTTP_PORT)
    });
}).catch(function(err){
    console.log("1unable to start server: " + err);
});
*/
dataService.initialize()
.then(dataServiceAuth.initialize)
.then(function(){
 app.listen(HTTP_PORT, function(){
 console.log("app listening on: " + HTTP_PORT)
 });
}).catch(function(err){
 console.log("unable to start server: " + err);
});


