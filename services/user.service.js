var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');

var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function authenticate(email, password) {
    var deferred = Q.defer();

    db.users.findOne({ email: email }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findOne(
        { email: userParam.email, password: userParam.password },
        function (err, user) {
            var uemail = userParam.email;
            var passid = userParam.password;
            var udob = userParam.dob;;  
                if(ValidateEmail(uemail)){
                    if(passid_validation(passid,6,12)){
                        if(getAge(udob)){
                        if (err) deferred.reject(err.name + ': ' + err.message);

                        if (user) {
                        // username already exists
                    deferred.reject('Email "' + userParam.email + '" is already taken');
                    } else {
                        createUser();
                    }  
                 }
             }
             
                return false;
            }
             function ValidateEmail(uemail){ 
               var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  
                if(uemail.match(mailformat)) {  
                    return true; 
                } 
                else { 
                    deferred.reject('You have entered an invalid email address!');
                    return false;  
                }  
            }
            function passid_validation(passid,mx,my){  
                var passid_len = passid.length;  
                if (passid_len == 0 ||passid_len >= my || passid_len < mx){  
                deferred.reject("Password should not be empty / length be between "+mx+" to "+my);  
                return false;  
                }  
                return true;  
            }                      
            function getAge(udob) {
                    //var dateformat = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
                    var today = new Date();
                    var birthDate = new Date(udob);
                    var age = today.getFullYear() - birthDate.getFullYear();
                    var m = today.getMonth() - birthDate.getMonth();
                        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                                age--;
                            }
                            return age;
                                    

                if( age >= 18){                     
                return true;  
                }  
                else  
                { 
                alert('Your age must be above 18 years to register'); 
                return false;  
                }  
             } 
        });

    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);

        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.email !== userParam.email) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
        { email: userParam.email, password: userParam.password },
        function (err, user) {
            var uemail = userParam.email;
            var passid = userParam.password;
            var udob = userParam.dob;;  
                if(ValidateEmail(uemail)){
                    if(passid_validation(passid,6,12)){
                        if(getAge(udob)){
                        if (err) deferred.reject(err.name + ': ' + err.message);

                        if (user) {
                        // username already exists
                    deferred.reject('Email "' + userParam.email + '" is already taken');
                    } else {
                        createUser();
                    }  
                 }
             }
             
                return false;
            }
             function ValidateEmail(uemail){ 
               var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  
                if(uemail.match(mailformat)) {  
                    return true; 
                } 
                else { 
                    deferred.reject('You have entered an invalid email address!');
                    return false;  
                }  
            }
            function passid_validation(passid,mx,my){  
                var passid_len = passid.length;  
                if (passid_len == 0 ||passid_len >= my || passid_len < mx){  
                deferred.reject("Password should not be empty / length be between "+mx+" to "+my);  
                return false;  
                }  
                return true;  
            }                      
            function getAge(udob) {
                    //var dateformat = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
                    var today = new Date();
                    var birthDate = new Date(udob);
                    var age = today.getFullYear() - birthDate.getFullYear();
                    var m = today.getMonth() - birthDate.getMonth();
                        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                                age--;
                            }
                            return age;
                        if( age >= 18){                     
                            return true;  
                            }  
                            else { 
                            deferred.reject('Your age must be above 18 years to register'); 
                            return false;  
                        }  
                    } 
        });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            Name: userParam.Name,
            dob: userParam.dob,
            email: userParam.email,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}