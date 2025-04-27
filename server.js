const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");
const colors=require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");


const app=express();

dotenv.config();

connectDB();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use("/api",require("./routes/route"))


app.get("/",(req,res)=>{
    res.status(200).json({success:true,message:"API running successfully"})
});

const port=process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server is running successfully on port ${port}`)
})

