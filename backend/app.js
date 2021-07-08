const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()
const path = require('path');       //for deploy

app.use(express.json({extended: true}))
// //register routes
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/fandom', require('./routes/fandom.routes'))
app.use('/api/tag', require('./routes/tag.routes'))
app.use('/api/fanfic', require('./routes/fanfic.routes'))

const PORT = process.env.PORT || config.get('port') || 5000

async function start (){
    try{
        await mongoose.connect(config.get('mongoUri'),{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
        //for deploy
        app.use(express.static('client/build'));
        app.get('*', (req, res) => {
            res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
        });
    }
    catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}
start()


