const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const Imgstorage = multer.diskStorage(
    {
        destination: './src/upload/images',
        filename: (req,file,cb)=>
        {
            crypto.pseudoRandomBytes(16,(err, raw)=>
        {
            cb(null, raw.toString('hex') + Date.now() + path.extname(file.originalname));
        })
        }
    }
);
const upload=multer({storage:Imgstorage});

module.exports=upload;