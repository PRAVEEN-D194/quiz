const userSchema = require("../modules/userSchema");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const transporter = require("../config/sendemail")
const nodemailer = require("nodemailer");


const register = async(req, res)=>{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.json({
            success:false,
            message:"Missing Details"
        })
    }

    try {
        const existinguser = await userSchema.findOne({email})
        if(existinguser){
            return res.json({
            success:false,
            message:"user already exists"
        })
        }


        const hashpassword = await bcrypt.hash(password, 10);

        const user = new userSchema({
            name,
            email,
            password:hashpassword,
        })

        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRTE, {expiresIn: '7d'});

        res.cookie('token', token , {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production"?"none":"strict",
            maxAge:7*24*60*60*1000   
        })

        const sendmessage = {
            from:process.env.email,
            to:email,
            subject: "Welcome to Quiz Galata",
            html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    
    <h1 style="color: #4F46E5; text-align: center;">
        🎉 Welcome to Quiz Galata!
    </h1>

    <p>
        Thank you for joining <strong>Quiz Galata</strong>.
    </p>

    <p>
        Create exciting quizzes, share them with your friends, and challenge them to beat your score.
    </p>

    <ul>
        <li>📝 Create your own quizzes</li>
        <li>🔗 Share quiz links instantly</li>
        <li>🏆 Compete for high scores</li>
        <li>🎯 Learn while having fun</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
        <a href="YOUR_WEBSITE_URL"
           style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
            Get Started
        </a>
    </div>

    <p>
        We hope you enjoy creating and playing quizzes with Quiz Galata.
    </p>

    <p>
        Happy Quizzing! 🎉
    </p>

    <p>
        <strong>The Quiz Galata Team</strong>
    </p>

</div>
`
        }

        await transporter.sendMail(sendmessage)

        res.json({
            success:true,
            message:"user registered successfull"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const login = async(req, res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Missing Details"
        })
    }
    try {
    const user = await userSchema.findOne({email});
    if(!user){
            return res.json({
            success:false,
            message:"user not exists go to register"
        })
    }
    const match = await bcrypt.compare(password, user.password);
    if(!match){
            return res.json({
            success:false,
            message:"Your password is wrong"
        })
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRTE, {expiresIn: '7d'});
    res.cookie('token', token , {
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:process.env.NODE_ENV === "production"?"none":"strict",
        maxAge:7*24*60*60*1000   
    })
    res.json({
        success:true,
        message:"user login successfull"
    })
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}


const logout = async(req, res)=>{
    try {
        res.clearCookie("token", {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production"?"none":"strict",
        })
        res.status(200).json({
            success:true,
            message:"logout successfull"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const sendotp = async(req, res)=>{
    try {
        const {userid} = req.body;

        const user = await userSchema.findById(userid);
        if(user.isverified){
            return res.json({
            success:false,
            message:"user already verified"
        })
        }
        if(!user){
            return res.json({
            success:false,
            message:"user not exists go to register"
        })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyotp = otp;
        user.verifyotpexpireat = Date.now() + 24*60*60*1000;
        await user.save();

        const sendmail = {
            from:process.env.email,
            to:email,
            subject: "verification otp",
            text: `Your otp is ${otp}. verify your account use this otp.`
        }

        await transporter.sendMail(sendmail);
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}

module.exports = {register : register, login:login,  logout:logout}