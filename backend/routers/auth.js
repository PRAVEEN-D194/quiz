const express = require("express");
const {sendotp, verifyotp, isAuthentication, resendotp, resetpassword} = require("../components/auth");
const userauth = require("../middleware/authjwt");
const authrouter = express.Router();


authrouter.post('/sendotp', userauth ,sendotp);
authrouter.post('/verify-opt',userauth, verifyotp);
authrouter.post('/isauth',userauth, isAuthentication);
authrouter.post('/resendotp' ,resendotp);
authrouter.post('/resetpassword',resetpassword);

module.exports = authrouter;