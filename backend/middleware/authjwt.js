
const jwt = require("jsonwebtoken")

const userauth = (req, res, next)=>{
    const {token} = req.cookies;
    if(!token){
        return res.json({
            success:false,
            message:"user not authorized go to login"
        })
    }
    try {
        const tokendecode = jwt.verify(token, process.env.JWT_SECRTE)
        if (!req.body) {
            req.body = {};
        }
        req.body.userid = tokendecode.id;
        next();
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}

module.exports = userauth;