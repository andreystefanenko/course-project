const {Router} = require('express')
const Tag = require('../models/Tag')
const {StatusCodes} = require("http-status-codes")
const router = Router()


router.get('/all', async(req,res) => {
    try{
        const tags = await Tag.find()
        res.json(tags)
    }
    catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Something went wrong! Try again!'})
    }
})

router.post('/byIds', async(req,res) => {
    try{
        const {tagsIds} = req.body
        const tags = await Tag.find({ _id: {$in: tagsIds}})
        res.json(tags)
    }
    catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Something went wrong! Try again!'})
    }
})

module.exports = router