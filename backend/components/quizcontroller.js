const quiz = require("../modules/quiz");

const getallquestions = async(req, res)=>{
    try{
        const question = await quiz.find({}).limit(10);

        if(question.length == 0){
            return res.json({
                success:false,
                message:"No Question found",
            })
        }

        res.json({
                success:true,
                quiz:question,
        })
    }catch(err){
        res.json({
            success:false,
            message:err.message
        })
    }
}

const getquestion = async(req, res)=>{
    const id = req.params.id;
    if(!id){
        return res.json({
            success:false,
            message:"Enter link"
        })
    }
    try {
        const question = await quiz.findOne({code:id});
        if(!question){
            return res.json({
                success:false,
                message:"No Question found",
            })
        }
        res.json({
                success:true,
                quiz:question,
        })
    } catch (error) {
        res.json({
            success:false,
            message:"wrong link check the link"
        })
    }
}

const createquiz = async(req, res)=>{
    const {Title, questions} = req.body;
    if(!Title || !questions){
        return res.json({
                success:false,
                quiz:"Missing Details Recreate Quiz. all  field are required",
        })
    }
    try {
        const question = await quiz.create({
            Title,
            questions
        })
        res.json({
            success:true,
            quiz:question,
        })

    } catch (error) {
        res.json({
            success:false,
            message:err.message
        })
    }
}

module.exports = {getallquestions:getallquestions, getquestion:getquestion, createquiz:createquiz}