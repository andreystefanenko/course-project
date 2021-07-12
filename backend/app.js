const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const app = express()
const path = require('path');
const fileUpload = require('express-fileupload')
// const bodyParser = require('body')
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));
app.use(fileUpload({
    useTempFiles: true
}))
// //register routes
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/fandom', require('./routes/fandom.routes'))
app.use('/api/tag', require('./routes/tag.routes'))
app.use('/api/fanfic', require('./routes/fanfic.routes'))
app.use('/api/chapter', require('./routes/chapter.routes'))
app.use('/api/user', require('./routes/user.routers'))

const PORT = process.env.PORT || config.get('port') || 5000

if (process.env.NODE_ENV === 'production'){
    //for deploy
    app.use('/', express.static(path.join(__dirname,'/../frontend/build')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '/../frontend/build', 'index.html'));
    });
}


async function start (){
    try{
        await mongoose.connect(config.get('mongoUri'),{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))

    }
    catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}
start()


