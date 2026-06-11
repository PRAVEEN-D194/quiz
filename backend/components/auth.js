const userSchema = require("../modules/userSchema");
const transporter = require("../config/sendemail")
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt")

const sendotp = async(req, res)=>{
    try {
        const {userid} = req.body;

        const user = await userSchema.findById(userid);
        
        if(!user){
            return res.json({
            success:false,
            message:"user not exists go to register"
        })
        }
        if(user.isverified){
            return res.json({
            success:false,
            isverify:true,
            message:"user already verified"
        })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyotp = otp;
        user.verifyotpexpireat = Date.now() + 24*60*60*1000;
        await user.save();

        const sendmail = {
            from:process.env.email,
            to:user.email,
            subject: "verification otp",
            text: `Your otp is ${otp}. verify your account use this otp.`
        }

        await transporter.sendMail(sendmail);
        res.json({
            success: true,
            message: "OTP sent successfully."
        });
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}

const verifyotp = async(req, res)=>{
    const {userid, otp} = req.body;
    if(!userid || !otp){
        return res.json({
            success:false,
            message:"Missing Details"
        })
    }

    try {
        const user = await userSchema.findById(userid);
    if(!user){
        return res.json({
        success:false,
        message:"user not exists go to register"
    })
    }

    if(user.verifyotp !== otp || user.verifyotp === ""){
        return res.json({
        success:false,
        message:"invalid otp"
    })
    }
    if(user.verifyotpexpireat < Date.now()){
        return res.json({
        success:false,
        message:"otp expired"
    })
}

    
    user.isverified=true;
    user.verifyotp="";
    user.verifyotpexpireat=0;

    await user.save();

    return res.status(200).json({
        success:true,
        message:"otp verified"
    })
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}

const isAuthentication = async(req, res)=>{
    try {
        res.status(200).json({
            success:true
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const resendotp = async(req, res)=>{
    const {email} = req.body;

    if(!email){
        return res.status(400).json({
            success:false,
            message:"Email is required"
        })
    }

    try {
        
        const user = await userSchema.findOne({email});
        if(!user){
            return res.status(404).json({
            success:false,
            message:"user not exists go to register"
        })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        
        user.resetotp = otp;
        user.resetotpexpeireat = Date.now() + 24*60*60*1000;
        await user.save();
        
        const sendmail = {
            from:process.env.email,
            to:user.email,
            subject: "verification otp",
            text: `Your otp is ${otp}. verify your account use this otp.`
        }

        await transporter.sendMail(sendmail);
        res.status(200).json({
            success: true,
            message: "OTP sent successfully."
        });


    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const resetpassword = async (req, res)=>{
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.status(400).json({
            success:false,
            message:"Missing Details"
        })
    }
    try {

        const user = await userSchema.findOne({email});
        if(!user){
            return res.status(404).json({
            success:false,
            message:"user not exists go to register"
        })
        }

        if(user.resetotp === "" || user.resetotp !== otp){
            return res.status(400).json({
            success:false,
            message:"otp Invalid"
        })
        }

        if(user.resetotpexpeireat < Date.now()){
            return res.status(400).json({
            success:false,
            message:"otp expeired go to relogin"
            })
        }

        const hashpassword = await bcrypt.hash(newPassword, 10);

       
        user.password = hashpassword
        user.resetotp="";
        user.resetotpexpeireat=0;
        await user.save();

        res.status(200).json({
            success:true,
            message:"password changed successfully"
        })
               
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
module.exports = {sendotp:sendotp, verifyotp:verifyotp, isAuthentication:isAuthentication, resendotp:resendotp, resetpassword:resetpassword};