require('express-async-errors');
require('dotenv').config();

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const morgan = require('morgan')
const express = require('express');
const jwt = require('jsonwebtoken')
const app = express();
const cors = require('cors');
// const multer = require('multer')              // multer will be used to handle the form data.
// const Aws = require('aws-sdk')

const connectDB = require('./backend/db/connect')
const productRouter = require('./backend/routers/productRouter');
const userRouter = require('./backend/routers/userRouter');
const homeRouter = require('./backend/routers/homeRouter');
const errorHandler= require('./backend/middleware/errorHandler')
// app.set('view-engine', 'pug')
// app.set('views', './views')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))


// app.use(express.static('public'))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });


if (app.get('env') === 'development' ) {
    app.use(morgan('tiny'))
    console.log('morgan enabled...')
}

app.use('/api/v1', homeRouter )
app.use('/api/v1/user', userRouter )
app.use('/api/v1/product', productRouter)

app.use(errorHandler)

 const port = process.env.PORT || 3000
async function start(){
    try {
        const success = await connectDB(process.env.Mongo_URI)
        if (success) console.log('connected')
        app.listen(port, console.log(`server listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}
start()

// app.listen(port, ()=>{
//    startupDebugger('server listening on port ' + port);
// })