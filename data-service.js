const Sequelize = require('sequelize');

var sequelize = new Sequelize('d9bcgqlc4g0urp', 'vnghvmiffztrfk', '53ca9920de4d8acdde4ea6ee3c1ef8e80b529af126c4bd497c7c6ed924eb99bf', {
    host: 'ec2-3-220-222-72.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: { rejectUnauthorized: false }
    }
   });

   sequelize.authenticate().then(()=> console.log('Connection success.'))
   .catch((err)=>console.log("Unable to connect to DB.", err));



var Employee = sequelize.define('Employee',{
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true
         
    },
    firstName: Sequelize.STRING,
    lasttName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

var Department = sequelize.define('Department',{
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});


module.exports.initialize = function() {
    return new Promise(function (resolve, reject) {
        
        sequelize.sync().then(function () {
            
            resolve();
            /*
            Employee.create({
            
            }).then(function () {
                console.log("success employee model!");
                Department.create({
                
                }).then(function(){
                    console.log("success department model!");
                    resolve();

                }).catch(function (error) {
                    console.log("unable to sync the database");
                });
            }).catch(function (error) {
                reject("unable to sync the database");
            });
            */
        }).catch(function (error) {
            reject("unable to sync the database");
        });

    });
}

module.exports.getAllEmployees = function() {
    return new Promise(function (resolve, reject) {
        
        sequelize.sync().then(function () {

            Employee.findAll({
                    
            }).then(function(data){
                data = data.map(value =>value.dataValues);
                //console.log(data);
                resolve(data);

            }).catch(function (error) {
                reject("no result returned");
            });
        });
    });
}

module.exports.getManagers = function() {
    return new Promise(function (resolve, reject) {
        reject();
    
    });
}

module.exports.getDepartments = function() {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {

            Department.findAll({
            
            }).then(function(data){
                data = data.map(value =>value.dataValues);
                //console.log(data);
                resolve(data);

            }).catch(function (error) {
                reject("no result returned");
            });
        });
    });
}

module.exports.addEmployee = function(employeeData) {
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;

        for(const prop in employeeData){
            if( employeeData[prop] == ""){
                employeeData[prop] = null;
            }
        }
        
        sequelize.sync().then(function () {
        
            Employee.create({

                employeeNum: employeeData.employeeNum,
                firstName: employeeData.firstName,
                lasttName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate

            }).then(function(){
                
                resolve();

            }).catch(function (error) {
                reject("unable to create employee");
            });
        });
    });
}

module.exports.addDepartment = function(departmentData) {
    return new Promise(function (resolve, reject) {
        
        for(const prop in departmentData){
            if( departmentData[prop] == ""){
                departmentData[prop] = null;
            }
        }
        
        sequelize.sync().then(function () {
        
            Department.create({

                departmentId: departmentData.departmentId,
                departmentName: departmentData.departmentName

            }).then(function(){
                
                resolve();

            }).catch(function (error) {
                reject("unable to create department");
            });
        });
    });
}



//get employees by status
/////////need to check it works or not////////////////
/////////////////////////////////////////////////////////
module.exports.getEmployeesByStatus = function(status) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {

            Employee.findAll({
            },{

                where : { status : status }
               
                
            }).then(function(data){
                data = data.map(value =>value.dataValues);
                //console.log(data);
                resolve(data);

            }).catch(function (error) {
                reject("no result returned");
            });
        });
    });
}

//get employees by status
module.exports.getEmployeesByDepartment = function(department) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {

            Employee.findAll({
            
                
                where : { department : department }
               
                
            }).then(function(data){
                
                data = data.map(value =>value.dataValues);
                
                resolve(data);

            }).catch(function (error) {
                reject("no result returned");
            });
        });
    });
}

module.exports.getEmployeesByManager = function(manager) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {

            Employee.findAll({
            
                
                where : { employeeManagerNum : manager }
               
                
            }).then(function(data){
                data = data.map(value =>value.dataValues);
                //console.log(data);
                resolve(data);

            }).catch(function (error) {
                reject("no result returned");
            });
        });
    });
}

module.exports.getEmployeeByNum = function(num) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {

            Employee.findAll({
            

                where : { employeeNum : num }
               
                
            }).then(function(data){
                data = data.map(value =>value.dataValues);
                //console.log(data);
                resolve(data[0]);

            }).catch(function (error) {
                reject("no result returned");
            });
        });
    });
}

module.exports.getDepartmentById = function(id) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {

            Department.findAll({

                attributes: ['departmentId', 'departmentName'],

                where : { departmentId : id }
               
                
            }).then(function(data){
                data = data.map(value =>value.dataValues);
                //console.log(data);
                resolve(data[0]);

            }).catch(function (error) {
                reject("no result returned");
            });
        });
    });
}

module.exports.updateEmployee = function(employeeData) {
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;

        for(const prop in employeeData){
            if( employeeData[prop] == ""){
                employeeData[prop] = null;
            }
        }

        sequelize.sync().then(function () {

            Employee.update({
                //employeeNum: employeeData.employeeNum,
                firstName: employeeData.firstName,
                lasttName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate
            }, {
                where : { employeeNum : employeeData.employeeNum}
            }).then(function() { 
                console.log("successfully updated");
                resolve();
    
            }).catch(function (error) {
                console.log("something went wrong to UPDATE!");
                reject("unable to update employee");
            });
        });
    });
}

module.exports.updateDepartment = function(departmentData) {
    return new Promise(function (resolve, reject) {
        
        for(const prop in departmentData){
            if( departmentData[prop] == ""){
                departmentData[prop] = null;
            }
        }

        sequelize.sync().then(function () {

            Department.update({
                departmentName: departmentData.departmentName 
            }, {
                where : { departmentId : departmentData.departmentId}
            }).then(function() { 
                console.log("successfully updated");
                resolve();
    
            }).catch(function (error) {
                console.log("something went wrong to UPDATE!");
                reject("unable to update department");
            });
        });
    });
}

module.exports.deleteEmployeeByNum = function(empNum) {
    return new Promise(function (resolve, reject) {
        
        sequelize.sync().then(function () {

            Employee.destroy({
                where : { employeeNum : empNum}
            }).then(function() { 
                console.log("successfully destroyed");
                resolve();
    
            }).catch(function (error) {
                console.log("something went wrong to destroy!");
                reject("unable to destroy employee");
            });
        });
    });
}