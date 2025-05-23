const fs = require('fs');
const dotenv = require('dotenv');

const {randomUUID} = require('crypto')

const { v2 } = require('cloudinary');

const cloudinary = v2;


dotenv.config();
   cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
const uploadOnCloudinary = async(localfilePath)=>{

    if(!localfilePath) return

    try {
        const response = await cloudinary.uploader.upload(localfilePath,{
            public_id:randomUUID(),
            resource_type:'auto'
        })
        fs.unlinkSync(localfilePath);
        return response.secure_url
    } catch (error) {
        console.log('error while uploading on cloudinary',error);
        if(fs.existsSync(localfilePath)){
            fs.unlinkSync(localfilePath)
        }
        return null;
    }


}


module.exports = uploadOnCloudinary