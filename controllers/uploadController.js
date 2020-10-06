const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

// services
const dbService = require('../services/dbService');
const awsServices = require('../services/awsService');

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

const uploadFiles = upload.array("images", process.env.MAX_IMAGE_UPLOAD);

const uploadImages = (req, res, next) => {
    uploadFiles(req, res, err => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_UNEXPECTED_FILE") {
                return res.send("Too many files to upload.");
            }
        } else if (err) {
            return res.send(err);
        }

        next();
    });
};
const resizeImages = async (req, res, next) => {
    if (!req.files) return next();

    req.body.images = [];
    await Promise.all(
        req.files.map(async file => {
            const filename = file.originalname.replace(/\..+$/, "");
            const newFilename = `${filename}-${Date.now()}.jpeg`;

            await sharp(file.buffer)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`${process.env.STORAGE_DIRECTORY_PATH}${newFilename}`);
            req.body.images.push(newFilename);
        })
    );
    next();
};

const getResult = async (req, res) => {
    try {


        console.log(req.body)
        if (Object.keys(req.body).length == 0) {
            return res.send(`You must select at least 1 image.`);
        }
        if (req.body.images.length <= 0) {
            return res.send(`You must select at least 1 image.`);
        }

        

        const dbObj = [];

        req.body.images.forEach(element => {
            dbObj.push({
                src: `${process.env.BUCKET_URL}${element}`,
                thumbnail: `${process.env.BUCKET_URL}${element}`,
                thumbnailWidth: 0,
                thumbnailHeight: 0,
                isSelected: false,
                caption: ""
            })
            awsServices.uploadFile(`${process.env.STORAGE_DIRECTORY_PATH}${element}`, element)
        });
        dbService.storeImages(dbObj).then(resp=>{
            console.log(resp)
        }).catch(err=>{
            console.log(err)
        })

        return res.send(`Images were uploaded`);
    } catch (error) {
        console.log(error)
        return res.send(`InternalServerError`)
    }
};


module.exports = {
    uploadImages: uploadImages,
    resizeImages: resizeImages,
    getResult: getResult
};