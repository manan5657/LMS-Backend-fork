const express = require("express");
const router = express.Router();
const {postNotice} = require("../Controller/NoticeController");

router.post("/postNotice",postNotice);









module.exports = router;