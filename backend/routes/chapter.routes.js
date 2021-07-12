const {Router} = require('express')
const Chapter = require('../models/Chapter')
const Fanfic = require('../models/Fanfic')
const {StatusCodes} = require("http-status-codes")
const router = Router()
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: 'andstef',
    api_key: '699547247689624',
    api_secret: 'pHZrBXWi54jrXiPFy8jR41gEgqI'
});

router.post('/create', async(req,res) => {
    try{
        const {title,text, fanficId} = req.body
        const file = req.files

        const cloudinaryFile = await cloudinary.uploader.upload(file.file.tempFilePath,function (err){
            if (err) {
                return res.status(StatusCodes.BAD_REQUEST).json({message: "Error with cloud storage. Try again!"})
            }
        })

        const duplicateTitle = await Chapter.findOne({title})
        if (duplicateTitle) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: "This title already using"})
        }

        const chapter = new Chapter({title, text, photo: cloudinaryFile.url, fanfic: fanficId})

        await chapter.save()

        await Fanfic.findByIdAndUpdate(fanficId, {$addToSet: {"chapters": chapter._id}},
            {safe: true, upsert: true},
            function (err) {
                if (err) {
                    return res.status(StatusCodes.BAD_REQUEST).json
                    ({message: "Error with adding new chapter in this fanfic"})
                } else return res.status(StatusCodes.CREATED).json({message: "Chapter created successfully"})
            })

    } catch(e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Something went wrong! Try again!'})
    }
})

router.post('/chaptersByIds', async(req, res) => {
    try{
        const {chapterIds} = req.body
        const chapters = await Chapter.find({_id: {$in: chapterIds}})
        res.json(chapters)
    } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Something went wrong! Try again!'})
    }
})

router.get('/:id', async (req,res) => {
    try{
        const chapter = await Chapter.findById(req.params.id)
        res.json(chapter)
    }
    catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Something went wrong! Try again!'})
    }
})

module.exports = router