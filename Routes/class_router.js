const express = require("express");
const router = express.Router();
const{scheduleClass,getLiveClasses,getUpcomingclasses}=require('../Controller/ClassController');




router.post("/scheduleClass",scheduleClass)
router.get("/liveClasses",getLiveClasses);
router.get("/upComingClasses",getUpcomingclasses);







module.exports=router