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
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Something went wrong! Try again!'})
    }
})

router.post('/byIds', async(req,res) => {
    try {
        const fandomIds = req.body
        const fandoms = await Fandom.find({ _id: {$in: fandomIds}})
        res.status(StatusCodes.OK).json({response: fandoms, message: "Fandoms were got successfully"})

    } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Something went wrong! Try again!'})
    }
})

router.post('/byId', async(req,res) => {
    try {

        const {fandomId} = req.body
        const fandom = await Fandom.find({ _id: fandomId})
        res.json(fandom)

    } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: '123Something went wrong! Try again!'})
    }
})

module.exports = router