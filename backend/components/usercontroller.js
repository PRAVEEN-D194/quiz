
const userSchema = require("../modules/userSchema");
const bcrypt = require("bcrypt")

const getuser = async (req, res) => {
    try {
        const { userid } = req.body;
        const user = await userSchema.findById(userid);

        if (!user) {
            return res.json({
                success: false,
                message: "account not found. please register first."
            })
        }
        return res.status(200).json({
            success: true,
            user: {
                name: user.name,
                isverified: user.isverified,
                email:user.email,
                point:user.point,
            }
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const updatepoint = async (req, res) => {
    const { userid, point } = req.body;
    if (!userid || !point) { return res.json({ success: false, message: "Requirements missing" }) }
    try {
        const user = await userSchema.findById(userid);

        if (!user) {
            res.json({
                success: false,
                message: "User Not Found go to login"
            })
        }
        const coin = user.point;
        user.point = point + coin;
        await user.save();

        res.json({
            success: true,
            message: "point change successfully"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const updateuser = async (req, res) => {
    const { userid, name } = req.body;
    if (!userid || !name) { return res.json({ success: false, message: "Requirements missing" }) }
    try {
        const user = await userSchema.findById(userid);

        if (!user) {
            res.json({
                success: false,
                message: "User Not Found go to login"
            })
        }
        
        user.name= name;
        await user.save();

        res.json({
            success: true,
            message: "point change successfully"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const deleteuser = async (req, res)=>{
    const { userid } = req.body;
    if (!userid) { return res.json({ success: false, message: "Requirements missing relogin" }) }
    try {
        const user = await userSchema.findByIdAndDelete(userid);

        if (!user) {
            res.json({
                success: false,
                message: "User Not Found go to login"
            })
        }
        res.json({
            success: true,
            message: "Deleted successfull"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}


const getalluser = async(req, res)=>{
        try {
            const user = await userSchema.find({}).sort({ point: -1 });

            if(user.length <= 0){
                return res.json({
                    success:false,
                    message:"No user found"
                })
            }
            res.json({
                success:true,
                user:user
            })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const checkpassword = async (req, res)=>{

    const {userid, password} = req.body;

    if(!userid || !password){
        return res.json({
            success:false,
            message:"Missing Details"
        })
    }
    try {
        const user = await userSchema.findOne({_id: userid});

        if(!user){
            return res.json({
            success:false,
            message:"Account not found. Please register first."
        })
        }

        const match = await bcrypt.compare(password, user.password);

            if(!match){
                    return res.json({
                    success:false,
                    message:"Invalid password."
                })
            }

        return res.status(200).json({
            success:true,
            message:"Password confirmed."
        })
        

    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }
}

const updatepassword = async (req, res) => {
    const { userid, password } = req.body;
    if (!userid || !password) {
        return res.json({
            success: false,
            message: "Missing Details"
        });
    }

    try {
        const user = await userSchema.findById(userid);

        if (!user) {
            return res.json({
                success: false,
                message: "User does not exist, go to register"
            });
        }

        const hashpassword = await bcrypt.hash(password, 10);

        user.password = hashpassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};
module.exports = { getuser: getuser,checkpassword:checkpassword, updatepassword:updatepassword, updatepoint: updatepoint, deleteuser: deleteuser ,updateuser:updateuser, getalluser:getalluser}