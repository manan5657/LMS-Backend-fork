const express = require("express");
const router = express.Router();
const {
  scheduleClass,
  getLiveClasses,
  getUpcomingclasses,
} = require("../Controller/ClassController");
const { validatemeeting } = require("../middleware.js");

router.post(
  "/scheduleClass",
  // validatemeeting
  scheduleClass
);
router.get("/liveClasses", getLiveClasses);
router.get("/upComingClasses", getUpcomingclasses);

module.exports = router;
