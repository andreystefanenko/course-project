const {Router} = require('express')
const Fandom = require('../models/Fandom')
const {StatusCodes} = require("http-status-codes");
const router = Router()


router.get('/all', async(req,res) => {
    try{
        const fandoms = await Fandom.find()
        res.json(fandoms)
    }
    catch (e) {
        console.log(e)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Something went wrong! Try again!'})
    }
})

module.exports = router