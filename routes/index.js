
const express = require("express");
const router = express.Router();

const dbService = require('../services/dbService');

router.get('/', (req, res) => {
    try {
        dbService.getAll().then(resp => {
            console.log(resp)
            res.send({
                StatusCode: 200,
                "Message": "Hello"
            })
        }).catch(err => {
            throw err
        })
    } catch (error) {
        console.log(err)
        res.send({
            StatusCode: 500,
            "Message": "InternalServerError"
        })
    }
})



module.exports = router;
