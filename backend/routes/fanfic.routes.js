const {Router} = require('express')
const Fanfic = require('../models/Fanfic')
const {validationResult} = require("express-validator");
const {StatusCodes} = require("http-status-codes");
const {check} = require("express-validator");
const auth = require('../middleware/auth.middleware')
const router = Router()

router.post(
    '/create',
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
        try{

            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    errors: errors.array(),
                    message: 'Incorrect creating data'
                })
            }

            const {title, fandom, tags, describe, photo, createData} = req.body

            const duplicateTitle = await Fanfic.findOne({title})
            if (duplicateTitle) {
                return res.status(StatusCodes.BAD_REQUEST).json({message: "This title already using"})
            }

            const fanfic = new Fanfic({title, fandom, tags, describe, photo, createData })

            await fanfic.save()

            res.status(StatusCodes.CREATED).json({message: "Fanfic created successfully"})

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


module.exports = router