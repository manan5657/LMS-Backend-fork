const { query } = require("express");
const Courses = require("../Models/courses");
const User=require('../Models/user');
module.exports.fetchCourses = async (req, res) => {
  try {
    const courses = await Courses.find().populate("owner");
    res.json(courses);
  } catch (e) {
    console.log("Error ", e);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.createCourse = async (req, res) => {
  try {
    const{auth}=req.query;
    let course = new Courses(req.body);
    // const user=await User.findById(auth);
    course.owner=auth;
    // user.courses.push(course._id);
    // await user.save();
    await course.save();
    res.status(200).send("Course Saved Successfully");
  } catch (e) {
    console.log("Error received", e);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.getCourse = async (req, res) => {
  try {
    let { id } = req.params;
    let course = await Courses.findById(id);
    res.json(course);
  } catch (e) {
    console.log("Error ", e);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.editCourse = async (req, res) => {
  try {
    let { id } = req.params;
    await Courses.findByIdAndUpdate(id, req.body);
    res.status(200).send("Updated Successfully");
  } catch (e) {
    console.log("Error", e);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.deleteCourse = async (req, res) => {
  try {
    let { id } = req.params;
    await Courses.findByIdAndDelete(id);
    res.status(200).send("Course Deleted Successfully");
  } catch (e) {
    console.log("Error", e);
    res.status(500).send("Internal Server Error");
  }
};


module.exports.dashCourses=async(req,res)=>{
  try{
  const {auth}=req.query;
  const course=await Courses.find({owner:auth});
  res.json(course)
  }
  catch(err){
    res.json(err);
  }
}