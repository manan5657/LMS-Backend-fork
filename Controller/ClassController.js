const Schedule=require('../Models/Classroom');

module.exports.scheduleClass=async(req,res)=>{
    try{
        const {course}= req.query;
        const {date,time_start,time_to}=req.body;
        const schedule= new Schedule({course,date,time_start,time_to});
        await schedule.save();
        res.json("Class Scheduled successfully");
    }
    catch(err){
        res.json("Error occured",err);
    }

}