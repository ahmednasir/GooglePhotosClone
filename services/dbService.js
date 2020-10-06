const imageModel = require('../models/imageModel');


const getAll = () => {
    return new Promise((resolve, reject) => {
        imageModel.find({}, (err, images) => {
            if (err) reject(err)
            resolve(images)
        })
    })
}

const storeImages = (body) => {
    return new Promise((reject, resolve) => {
        imageModel.insertMany(body, (err, resp) => {
            if (err) reject(err)
            console.log(resp);
            resolve(resp)
        })
    })


}



module.exports = {
    getAll: getAll,
    storeImages: storeImages
};

