if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const courseRouter = require("./Routes/course_router");
const userRouter=require('./Routes/userRouter');
const paymentRouter=require('./Routes/paymentRouter');
const cors=require('cors');
const methodOverride=require('method-override');


const cookieParser = require('cookie-parser');

const MongoUrl = process.env.MONGOURL;

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  
app.use(cookieParser());
app.use(methodOverride('_method'))
const allowedOrigins = ['http://localhost:3001', 'http://localhost:3002'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin, like mobile apps or curl requests
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
mongoose
  .connect(MongoUrl)
  .then(() => console.log("Connected to online Database"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

//Routes
app.use("/api/admin", courseRouter);
app.use("/api",userRouter);
app.use("/api",paymentRouter);


app.get('/api/getkey',(req,res)=>{
  res.status(200).send({key:process.env.RAZORPAY_API_KEY})
})

//Listening to port
app.listen(3000, () => {
  console.log("App is listening to port 3000");
});
