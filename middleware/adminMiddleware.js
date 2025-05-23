const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

dotenv.config();

 const adminOnly = (req,res,next)=>{
     try {
      const token = req.headers.authorization;
     console.log(token)
     if(!token){
        return res.status(401).json({message:'only admin can access this route'})
     }

     const adminSecret = jwt.verify(token,process.env.JWT_ADMIN_SECRET);

     if(adminSecret===process.env.ADMIN_SECRET){
       return next();
     }else{
  return res.status(401).json({
        message:'only admin can access this route'
     })
     }
     } catch (error) {
      return res.status(500).json('internal server errror')
         console.log(error)
     }
   
}

module.exports = {adminOnly}