const {Router} = require('express')
const Fanfic = require('../models/Fanfic')
const Fandom = require('../models/Fandom')
const Tag = require('../models/Tag')
const User = require('../models/User')
const {validationResult} = require("express-validator");
const {StatusCodes} = require("http-status-codes");
const {check} = require("express-validator");
const auth = require('../middleware/auth.middleware')
const router = Router()

router.post(
    '/create', auth,
    [
        check('title', 'Title must be more than 1 character')
            .isLength({min:2}),
        check('fandom', 'Fandom must be more than 1 character')
            .isLength({min:2}),
        check('describe', 'Describe must be more than 1 character')
            .isLength({min:2}),
        check('tags', 'Tag must be more than 1 character')
            .isLength({min:2}),
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    errors: errors.array(),
                    message: 'Incorrect creating data'
                })
            }

            const {title, fandom, tags, describe, createData} = req.body

            const duplicateTitle = await Fanfic.findOne({title})
            if (duplicateTitle) {
                return res.status(StatusCodes.BAD_REQUEST).json({message: "This title already using"})
            }

            const fanfic = new Fanfic({title, fandom: fandom._id, tags, describe, createData, author: req.user.userId})

            await fanfic.save()

            await Fandom.findByIdAndUpdate(fandom._id, {$addToSet: {"fanfic": fanfic._id}},
                {safe: true, upsert: true},
                function (err) {
                    if (err) {
                        return res.status(StatusCodes.BAD_REQUEST).json
                        ({message: "Error with adding new fanfic in this fandom"})
                    }
                })

            async function updateTags(tags) {
                for (const item of tags) {
                    await Tag.findByIdAndUpdate(item._id,{$addToSet: {"fanfic": fanfic._id}},
                        {safe: true, upsert: true},
                        function (err) {
                            if (err) {
                                return res.status(StatusCodes.BAD_REQUEST).json
                                ({message: "Error with adding new fanfic in this tags"})
                            }})
                }
            }
            await updateTags(tags)

            await User.findByIdAndUpdate(req.user.userId,{$addToSet: {"fanfics": fanfic._id}},
                {safe: true, upsert: true},
                function (err) {
                    if (err) {
                        return res.status(StatusCodes.BAD_REQUEST).json
                        ({message: "Error with adding new fanfic to this user"})
                    }
                })

            return res.status(StatusCodes.CREATED).json({fanfic: fanfic._id, message: "Fanfic created successfully"})


        } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Something went wrong! Try again!'})
        }
    })



router.get('/', auth, async(req,res) => {
    try{
        const fanfics = await Fanfic.find({author: req.user.userId})
        res.json(fanfics)
    }
    catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Something went wrong! Try again!'})
    }
})


router.get('/latest', async (req,res) => {
    try{
        const fanfics = await Fanfic.find({}, {}, {sort: {'createDate': -1}} )
        res.status(StatusCodes.OK).json({fanfics, message: "The latest fanfics were got from the server"})
    } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Something went wrong! Try again!'})
    }
})

router.get('/:id', async (req,res) => {
    try{
        const fanfic = await Fanfic.findById(req.params.id)
        res.json(fanfic)
    }
    catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Something went wrong! Try again!'})
    }
})

module.exports = router