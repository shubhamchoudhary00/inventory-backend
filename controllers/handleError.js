
const handleError=(error,res)=>{
    return res.status(500).json({successs:false,message:"Internal Server Error"})
}

module.exports=handleError;