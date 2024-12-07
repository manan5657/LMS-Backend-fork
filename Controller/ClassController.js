const Schedule = require("../Models/Classroom");
const nodemailer = require("nodemailer");

module.exports.scheduleClass = async (req, res) => {
  try {
    const { course, teacher } = req.query;
    const { date, time_start, time_to, roomCode } = req.body;
    console.log(roomCode);
    const schedule = new Schedule({
      teacher,
      course,
      date,
      time_start,
      time_to,
      roomCode,
    });
    await schedule.save();
    res.json("Class Scheduled successfully");
  } catch (err) {
    res.json("Error occured", err);
  }
};

module.exports.getLiveClasses = async (req, res) => {
  try {
    const { auth } = req.query;
    const classes = await Schedule.find({ teacher: auth }).populate([
      "course",
      "teacher",
    ]);
    res.json(classes);
  } catch (err) {
    res.json("Error in fetching classes", err);
  }
};

module.exports.getUpcomingclasses = async (req, res) => {
  try {
    const { course } = req.query;
    const classes = await Schedule.find({ course: course }).populate("course");
    res.json(classes);
  } catch (err) {
    res.json("Error in Fetching classes", err);
  }
};

module.exports.sendBulkEmail = async (req, res) => {
  const transporter = nodemailer.createTransport({
    // host: process.env.EMAIL_HOST,
    // port: process.env.EMAIL_PORT,
    // secure: false, // true for 465, false for other ports
    service: "gmail",
    auth: {
      user: "learnlynx9@gmail.com", // email address
      pass: "iklv jzwv gfrs tbgl", // email password or app-specific password
    },
  });

  const { emails, subject, body } = req.body;

  if (!emails || emails.length === 0) {
    return res.status(400).json({ error: "No email addresses provided." });
  }

  try {
    // Prepare bulk email options
    const mailOptions = {
      from: `"LearnLynx" <learnlynx@gmail.com>`, // sender address
      to: emails.join(","), // recipient emails separated by commas
      subject: subject,
      text: body, // plain text body
      html: `<p>${body.replace(/\n/g, "<br>")}</p>`, // HTML version
    };

    // Send emails
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ error: "Failed to send emails." });
  }
};
