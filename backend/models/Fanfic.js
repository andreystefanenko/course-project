const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    title: {type: String, required: true, unique: true},
    fandom: {type: Types.ObjectId, ref: 'Fandom', required: true},
    tags: [{type: Types.ObjectId, ref: 'Tag', required: true}],
    describe: {type: String, required: true},
    chapters: [{type: Types.ObjectId, ref: 'Chapter'}],
    createDate: {type: Date, default: Date.now},
    author: {type: Types.ObjectId, ref: 'User'}
})

module.exports = model('Fanfic', schema)