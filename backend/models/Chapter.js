const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    number: {type: Number, required: true, default: 1},
    title: {type: String, required: true, unique: true},
    text: {type: String, required:true},
    photo: {type: String, required: true},
    fanfic: {type: Types.ObjectId, ref: 'Fandom', required: true},
})

module.exports = model('Chapter', schema)