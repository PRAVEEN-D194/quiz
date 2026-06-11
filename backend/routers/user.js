const express = require("express");
const userrouter = express.Router();
const { register, login, logout } = require("../components/user");  
const userauth = require("../middleware/authjwt");
const { getuser, updatepoint, deleteuser, getalluser, updateuser } = require("../components/usercontroller");

userrouter.post('/register', register);
userrouter.post('/login', login);
userrouter.post('/logout', logout);
userrouter.get('/getuser', userauth , getuser);
userrouter.put('/updatepoint', userauth , updatepoint);
userrouter.delete('/deleteuser', userauth , deleteuser);
userrouter.get('/getalluser' , getalluser);
userrouter.put('/updateuser', userauth , updateuser);

module.exports = userrouter;