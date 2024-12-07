const Notice = require("../Models/Notice");
const Course = require("../Models/courses");


module.exports.postNotice= async(req,res,next)=>{
    try{
        const {course} = req.query;
        console.log(course);
        const resp=await Course.findById(course);
        const {title,notice}= req.body;
        const newnotice= new Notice({
            course,
            title,
            notice
        })
        await newnotice.save();
        res.json("Notice Posted Successfully");
    }
    catch(err){
        res.json(err)
    }
}