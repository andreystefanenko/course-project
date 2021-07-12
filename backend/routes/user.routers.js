const {Router} = require('express')
const User = require('../models/User')
const {StatusCodes} = require("http-status-codes");
const router = Router()

router.post('/byIds', async(req,res) => {
    try {
        const authorId = req.body
        const author = await User.find({ _id: authorId})
        res.status(StatusCodes.OK).json({response: author, message: "Author were got successfully"})

    } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Something went wrong! Try again!'})
    }
})

router.post('/byId', async(req,res) => {
    try {
        const {userId} = req.body
        const user = await User.find({ _id: userId})
        res.json(user)

    } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Something went wrong! Try again!'})
    }
})

module.exports = router