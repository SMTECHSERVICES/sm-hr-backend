const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

router.post('/login',async(req,res)=>{
    const {adminSecret} = req.body;
     if(adminSecret === process.env.ADMIN_SECRET){
        const token = jwt.sign(adminSecret,process.env.JWT_ADMIN_SECRET)
        
        return res.status(200).json({
            message:'welcome admin',
            token
        })
     }

     return res.status(401).json({
        message:'invalid credential'
     })

})

router.post('/logout',async(req,res)=>{
    return res.status(200).json({
        message:'succesfull logout'
    })
})



module.exports = router;