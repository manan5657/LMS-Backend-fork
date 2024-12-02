const bcrypt = require("bcrypt");
const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const ExpressError = require("../utils/ExpressError");
const Teacher = require("../Models/Teacher");
const Student = require("../Models/Student");

module.exports.signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!(username && email && password)) {
      return res.json(new ExpressError(400, "Please Enter All Details"));
    }

    // Check if there's already a user with the email address
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.json(new ExpressError(400, "Email Already In Use"));
    }

    // Hash the password
    const EncPass = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      username,
      email,
      password: EncPass,
    });

    // Generate a token
    const token = jwt.sign({ id: user._id, email }, "MySecretKey", {
      expiresIn: "2h",
    });

    user.token = token;
    user.password = undefined;
    await user.save;
    next();
  } catch (error) {
    return res.json(new ExpressError(400, "Username already Exsists"));
  }
};

module.exports.loginIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.json(new ExpressError(400, "Please Enter All Details"));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json(new ExpressError(400, "User is not Registerd"));
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, "MySecretKey", {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: false,
        sameSite: "None",
      };

      return res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        user,
      });
    }

    return res.json(
      new ExpressError(400, "Username or Password are incorrect")
    );
  } catch (error) {
    console.error(error);
    return res.json(new ExpressError(400, error));
  }
};

module.exports.LoginWithGoogle = async (req, res) => {};

module.exports.logOut = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });

  res.status(200).json({
    success: true,
    message: "Successfully logged out",
  });
};

module.exports.verifyUser = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.json({
      success: false,
    });
  } else {
    const verify = jwt.verify(token, "MySecretKey");
    const id = verify.id;
    const user = await User.findById(id);
    res.json({
      success: true,
      user,
    });
  }
};

module.exports.mylearning = async (req, res) => {
  const { auth } = req.query;

  const user = await Student.findOne({ id: auth }).populate("myLearnings");
  if (user) {
    const mylearning = user.myLearnings;
    res.json({
      mylearning,
    });
  }
};

module.exports.myStudent = async (req, res) => {
  try {
    const { auth } = req.query;
    const teacher = await Teacher.findOne({ id: auth }).populate("students");
    res.json(teacher.students);
  } catch (err) {
    res.json(err);
  }
};
