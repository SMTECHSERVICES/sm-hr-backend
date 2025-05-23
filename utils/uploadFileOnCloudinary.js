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

const uploadFileOnCloudinary = async(localfilePath)=>{

    if(!localfilePath) return

    try {
         const response = await cloudinary.uploader.upload(localfilePath, {
      public_id: randomUUID(),
      type: 'upload',
      resource_type: 'raw', // ✅ Important for PDF/ZIP/Non-image files
      format: 'pdf' // optional, but enforces PDF extension
    });
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

module.exports = uploadFileOnCloudinary;

// const dotenv = require('dotenv');
// const { randomUUID } = require('crypto');
// const { v2: cloudinary } = require('cloudinary');
// const { Readable } = require('stream');

// dotenv.config();

// cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadFileOnCloudinary = async (buffer, filename = 'file.pdf') => {
//   if (!buffer) return;

//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         public_id: randomUUID(),
//         resource_type: 'raw', // important for PDFs, ZIPs, etc.
//         type: 'upload',
//         filename_override: filename, // helps retain original file name
//       },
//       (error, result) => {
//         if (error) {
//           console.error('Cloudinary upload error:', error);
//           return reject(null);
//         }
//         resolve(result.secure_url);
//       }
//     );

//     const readable = new Readable();
//     readable._read = () => {};
//     readable.push(buffer);
//     readable.push(null);
//     readable.pipe(stream);
//   });
// };

// module.exports = uploadFileOnCloudinary;
