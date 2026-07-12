const userSchema = require("../modules/userSchema");
const transporter = require("../config/sendemail")
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt")

const sendotp = async(req, res)=>{
    console.log("[Email Controller] Executing sendotp for userid:", req.body.userid);
    try {
        const {userid} = req.body;

        const user = await userSchema.findById(userid);
        
        if(!user){
            console.log("[Email Controller] sendotp failed: User not found for ID:", userid);
            return res.json({
            success:false,
            message:"user not found. please register first."
        })
        }
        if(user.isverified){
            console.log("[Email Controller] sendotp skipped: User already verified:", user.email);
            return res.json({
            success:false,
            isverify:true,
            message:"user already verified"
        })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        console.log(`[Email Controller] Generated OTP for ${user.email}`);
        user.verifyotp = otp;
        user.verifyotpexpireat = Date.now() + 24*60*60*1000;
        await user.save();

        const sendmail = {
            from:process.env.email,
            to:user.email,
            subject: "verification otp",
            text: `Your otp is ${otp}. verify your account use this otp.`
        }

        console.log(`[Email Controller] Triggering mail delivery to ${user.email}...`);
        await transporter.sendMail(sendmail);
        console.log(`[Email Controller] Mail delivery succeeded for ${user.email}`);
        res.json({
            success: true,
            message: "OTP sent successfully."
        });
    } catch (error) {
        console.error(`[Email Controller Error] sendotp failed for userid ${req.body.userid}:`, error.message);
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
            message:"User ID and OTP are required."
        })
    }

    try {
        const user = await userSchema.findById(userid);
    if(!user){
        return res.json({
        success:false,
        message:"user not found. please register first."
    })
    }

    if(user.verifyotp !== otp || user.verifyotp === ""){
        return res.json({
        success:false,
        message:"Invalid OTP."
    })
    }
    if(user.verifyotpexpireat < Date.now()){
        return res.json({
        success:false,
        message:"OTP has expired. Please request a new OTP."
    })
}

    
    user.isverified=true;
    user.verifyotp="";
    user.verifyotpexpireat=0;

    await user.save();

    return res.json({
        success:true,
        message:"OTP verified successfully."
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
        res.json({
            success:true
        })
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}

const resendotp = async(req, res)=>{
    console.log("[Email Controller] Executing resendotp for email:", req.body.email);
    const {email} = req.body;

    if(!email){
        console.log("[Email Controller] resendotp failed: Missing email in request body.");
        return res.json({
            success:false,
            message:"Email is required"
        })
    }

    try {
        
        const user = await userSchema.findOne({email});
        if(!user){
            console.log("[Email Controller] resendotp failed: User not found for email:", email);
            return res.json({
            success:false,
            message:"user not found. please register first."
        })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        console.log(`[Email Controller] Generated reset OTP for ${email}`);
        
        user.resetotp = otp;
        user.resetotpexpeireat = Date.now() + 24*60*60*1000;
        await user.save();
        
        const sendmail = {
            from:process.env.email,
            to:user.email,
            subject: "verification otp",
            text: `Your otp is ${otp}. verify your account use this otp.`
        }

        console.log(`[Email Controller] Triggering reset mail delivery to ${user.email}...`);
        await transporter.sendMail(sendmail);
        console.log(`[Email Controller] Reset mail delivery succeeded for ${user.email}`);
        res.json({
            success: true,
            message: "OTP sent successfully."
        });


    } catch (error) {
        console.error(`[Email Controller Error] resendotp failed for ${email}:`, error.message);
        return res.json({
            success:false,
            message:error.message
        })
    }
}

const resetpassword = async (req, res)=>{
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({
            success:false,
            message:"Missing Details"
        })
    }
    try {

        const user = await userSchema.findOne({email});
        if(!user){
            return res.json({
            success:false,
            message:"user not found. please register first."
        })
        }

        if(user.resetotp === "" || user.resetotp !== otp){
            return res.json({
            success:false,
            message:"Invalid OTP."
        })
        }

        if(user.resetotpexpeireat < Date.now()){
            return res.json({
            success:false,
            message:"OTP has expired. Please request a new OTP."
            })
        }

        const hashpassword = await bcrypt.hash(newPassword, 10);

       
        user.password = hashpassword
        user.resetotp="";
        user.resetotpexpeireat=0;
        await user.save();

        return res.json({
            success:true,
            message:"password changed successfully"
        })
               
    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }
}
module.exports = {sendotp:sendotp, verifyotp:verifyotp, isAuthentication:isAuthentication, resendotp:resendotp, resetpassword:resetpassword};