const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    title: {type: String, required: true, unique: true},
    fanfic: [{type: Types.ObjectId, ref: 'Fandom', required: true}],
})

module.exports = model('Fandom', schema)